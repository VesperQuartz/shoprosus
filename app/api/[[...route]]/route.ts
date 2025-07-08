import { requestId } from "hono/request-id";
import { zValidator } from "@hono/zod-validator";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { handle } from "hono/vercel";
import { z } from "zod";
import {
  InvalidToolArgumentsError,
  NoSuchToolError,
  streamText,
  tool,
  ToolExecutionError,
} from "ai";
import { groq } from "@ai-sdk/groq";
import {
  addItemsToCart,
  clearCart,
  getCartItem,
  initializeTransaction,
} from "@/services";
import to from "await-to-ts";
import { auth } from "@/lib/auth";
import { getAvailableRestuarant, getRestuarantMenus } from "@/agents/tools";
import { logOrderInGraph } from "@/services/knowlege-graph";

export const runtime = "nodejs";

export const maxDuration = 30;

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().basePath("/api");

app.use(logger());
app.use(secureHeaders());
app.use(poweredBy());
app.use(prettyJSON());
app.use("*", requestId());

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.get("/cart", async (c) => {
  const user = c.get("user");
  if (!user) return c.json(null, 401);
  const [error, result] = await to(getCartItem(user?.id));
  if (error) {
    console.log(error);
    throw error;
  }
  return c.json(result);
});

app.delete("/cart", async (c) => {
  const user = c.get("user");
  if (!user) return c.json(null, 401);
  const [error, result] = await to(clearCart(user?.id));
  if (error) {
    console.log(error);
    throw error;
  }
  return c.json(result);
});

app.post(
  "/initialize",
  zValidator(
    "json",
    z.object({
      amount: z.number(),
    }),
  ),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.json(null, 401);
    const { amount } = c.req.valid("json");
    const metadata = {
      userId: user.id,
    };
    const [error, result] = await to(
      initializeTransaction({ email: user.email, amount, metadata }),
    );
    if (error) {
      console.log(error);
      throw error;
    }
    return c.json(result);
  },
);

app.post("/webhook", async (c) => {
  const event = await c.req.json();
  if (event.event === "charge.success") {
    const userId = event.event.metadata.userId;
    await clearCart(userId);
  }
  return c.json({ message: "webhook recieved" });
});

app.post("/chat", async (c) => {
  const user = c.get("user");
  if (!user) return c.json(null, 401);
  const { messages } = await c.req.json();
  try {
    const result = streamText({
      model: groq("llama3-70b-8192"),
      messages,
      tools: {
        getAvailableRestuarant,
        getRestuarantMenus,
        addMenuItemToCart: tool({
          parameters: z.object({
            cart: z.array(
              z.object({
                name: z.string(),
                price: z.number(),
                image: z.string(),
                quantity: z.number(),
              }),
            ),
          }),
          description:
            "Add one or more selected menu items to the user's cart. Use this after the user chooses food or drinks they want to order.",
          execute: async ({ cart }) => {
            console.log("ED", cart);
            const user = c.get("user");
            const [error, result] = await to(addItemsToCart(cart, user?.id));
            if (user && !error) {
              await logOrderInGraph({ userId: user.id, cart });
            }
            if (error) {
              console.error("Error", error);
              throw new Error("Cannot add items to cart");
            }
            return result;
          },
        }),
        getUserCart: tool({
          parameters: z.object({}).optional(),
          description:
            "Retrieve and display all items currently in the user's cart. Use this to show the user what they have added so far.",
          execute: async () => {
            const user = c.get("user");
            console.log("cart", user);
            try {
              const result = await getCartItem(user?.id);
              return result;
            } catch (error) {
              console.error(error);
            }
          },
        }),
        providePaymentButton: tool({
          parameters: z.object({
            totalAmount: z.number().describe("Total price of items in cart"),
          }),
          description:
            "Generate a payment link for the user to complete their order. Use this when the user is ready to checkout and pay for their cart.",
          execute: async ({ totalAmount }) => {
            const user = c.get("user");
            const metadata = {
              userId: user?.id,
            };
            const [error, result] = await to(
              initializeTransaction({
                email: user!.email,
                metadata,
                amount: totalAmount * 100,
              }),
            );
            if (error) {
              console.error("Error", error);
              throw new Error("Cannot add items to cart");
            }
            return result;
          },
        }),
        deleteCartItem: tool({
          parameters: z.object({}).optional(),
          description:
            "Remove all items from the user's cart. Use this when the user wants to clear their cart or start over.",
          execute: async () => {
            const user = c.get("user");
            await clearCart(user!.id);
            return { message: "cart deleted" };
          },
        }),
      },
      maxSteps: 3,
      system: `
  You are an AI assistant for a restaurant ordering platform. You help users discover restaurants, browse menus, and manage their orders.

      Your capabilities:
      1. List available restaurants
      2. Show menu items from specific restaurants
      3. Add items to cart
      4. Process payments
      5. Provide personalized recommendations based on user preferences
      6. Suggest menu items that fit the user's dietary needs using the knowledge graph

      Remember to:
      - Be friendly and helpful
      - Ask clarifying questions when needed
      - Always verify item IDs (6 digits) for tool calls
      - Always Get items from cart before proceding to checkout
      - Check for allergies and dietary restrictions before making any food suggestions
      - Always use the knowledge graph to suggest menu items that fit the user's dietary needs and avoid allergens
      - If unsure about a user's restrictions, ask before suggesting food
      - Suggest items based on user's taste preferences and order history
      - Call dependent tools in the right order
      - Call the dietary suggestion tool when the user asks for recommendations or when making suggestions

      If a user mentions food preferences, allergies, or dietary restrictions, make note of them for future recommendations.
      `,
    });
    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        if (NoSuchToolError.isInstance(error)) {
          console.log(error);
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          console.log(error);
        } else if (ToolExecutionError.isInstance(error)) {
          console.log(error);
        } else {
          console.log(error);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        throw new Error(error as any);
      },
    });
  } catch (error) {
    console.log("THE Error", error);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
