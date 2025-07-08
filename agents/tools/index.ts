/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { fetchAvailableRestuarant, getRestuarantMenu } from "@/services";
import { tool } from "ai";
import to from "await-to-ts";
import z from "zod";
import { updateUserProfileInGraph } from "@/services/knowlege-graph";

export const getAvailableRestuarant = tool({
  parameters: z.object({}).optional(),
  description:
    "Retrieve a list of all available restaurants for the user to browse or select from. Use this to help the user discover where they can order food.",
  execute: async ({}) => {
    const [error, result] = await to(fetchAvailableRestuarant());
    if (error) {
      console.error("Error", error);
      throw new Error("Cannot get available restuarant");
    }
    return result;
  },
});

export const getRestuarantMenus = tool({
  parameters: z.object({
    id: z.number().min(6),
    name: z.string().optional(),
  }),
  description:
    "Get the full menu for a specific restaurant, including all available dishes and drinks. Use this when the user wants to see what a restaurant offers.",
  execute: async ({ id }) => {
    const [error, result] = await to(getRestuarantMenu(id));
    if (error) {
      console.error("Error", error);
      throw new Error("Cannot get restuarant menu");
    }
    return result;
  },
});

export const updateUserProfile = tool({
  parameters: z.object({
    preferences: z.object({
      cuisines: z.array(z.string()).optional(),
      allergens: z.array(z.string()).optional(),
      spiceLevel: z.enum(["mild", "medium", "hot"]).optional(),
      dietaryRestrictions: z.array(z.string()).optional(),
      priceRange: z.enum(["budget", "mid-range", "premium"]).optional(),
    }),
    reasoning: z.string().describe("Explain what you learned about the user"),
  }),
  description:
    "Update the user's profile with new preferences, allergies, or dietary restrictions learned from the conversation. Use this to personalize future recommendations.",
  execute: async ({ preferences, reasoning }, context) => {
    const user = context && "user" in context ? context.user : undefined;
    if (
      user &&
      typeof user === "object" &&
      "id" in user &&
      "name" in user &&
      "email" in user
    ) {
      await updateUserProfileInGraph({
        userId: (user as any).id,
        name: (user as any).name,
        email: (user as any).email,
        preferences,
        reasoning,
      });
    }
    console.log(`Learning: ${reasoning}`);
    console.log(`preference: ${preferences}`);
    return { success: true, learned: reasoning };
  },
});

export const getPersonalizedSuggestions = tool({
  parameters: z.object({}).describe("No parameters needed").default({}),
  description:
    "Get personalized restaurant or menu recommendations based on the user's profile, preferences, and order history. Use this to help the user discover food they are likely to enjoy and can safely eat.",
  execute: async ({}) => {
    return { message: "Getting personalized recommendations..." };
  },
});
