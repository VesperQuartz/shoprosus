import { env } from "@/env/server";
import { db } from "@/lib/database";
import { cartTable, CartTableInsert } from "@/repo/schema/schema";
import { availableResturant } from "@/store/data" with {};
import { MenuItem } from "@/types";
import to from "await-to-ts";
import { eq } from "drizzle-orm";
import ky, { HTTPError } from "ky";

export const fetchWeatherAPI = async (location: string) => {
  console.log(location);
  return {
    temp: "26degree",
    condition: "Partly cloudy",
    humidity: "30%",
    wind: "13km/h",
  };
};

export const fetchAvailableRestuarant = async () => {
  console.log("The id why");
  return Promise.resolve(availableResturant);
};

export const getRestuarantMenu = async (id: number) => {
  console.log("The id", id);
  const [error, response] = await to(
    ky(`https://api.chowdeck.com/customer/vendor/${id}/menu`, {
      timeout: false,
    }),
  );
  if (error instanceof HTTPError) {
    const err = await error.response.json();
    console.log("Error", err);
    throw new Error(err.message);
  }
  const data = await response.json<{
    status: string;
    message: string;
    data: Array<MenuItem>;
  }>();
  return data.data
    .map((menu) => ({ ...menu, price: menu.price / 100 }))
    .map((menu) => ({
      id: menu.id,
      images: menu.images[0]?.path ?? "/no_image.png",
      name: menu.name,
      tags: menu.tags,
      price: menu.price,
      description: menu.description,
      currency: menu.currency,
      category: menu.category,
    }));
};

export const getCartItem = async (id: string | undefined) => {
  if (!id) throw new Error("You must provide id");
  const [_, result] = await to(
    db.select().from(cartTable).where(eq(cartTable.userId, id)),
  );
  return result;
};

export const addItemsToCart = async (
  cart: CartTableInsert[],
  id: string | undefined,
) => {
  const [_, result] = await to(
    db.transaction(async (tx) => {
      const [error, data] = await to(
        tx
          .insert(cartTable)
          .values(cart.map((data) => ({ ...data, userId: id })))
          .returning(),
      );
      if (error) {
        tx.rollback();
      }
      return data;
    }),
  );
  return result;
};

export const initializeTransaction = async ({
  email,
  amount,
  metadata,
}: {
  email: string;
  amount: number;
  metadata?: { userId?: string };
}) => {
  const [error, response] = await to(
    ky.post(`https://api.paystack.co/transaction/initialize`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.payStackSecret}`,
      },
      json: {
        email,
        amount,
        metadata,
      },
    }),
  );
  if (error) {
    throw error;
  }
  return response.json<{
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  }>();
};

export const clearCart = async (id: string) => {
  const [error] = await to(
    db.transaction(async (tx) => {
      return await tx
        .delete(cartTable)
        .where(eq(cartTable.userId, id))
        .returning();
    }),
  );
  if (error) throw new Error("Cannot delete cart item");
  return { message: "Cart item deleted" };
};
