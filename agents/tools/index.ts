import "server-only";
import { fetchAvailableRestuarant, getRestuarantMenu } from "@/services";
import { tool } from "ai";
import to from "await-to-ts";
import z from "zod";

export const getAvailableRestuarant = tool({
  parameters: z.object({}).describe("No parameters needed").default({}),
  description: "Get the available restuarant",
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
  description: "Get the menu of a restuarant",
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
  description: "Update user profile based on conversation insights",
  execute: async ({ preferences, reasoning }) => {
    console.log(`Learning: ${reasoning}`);
    console.log(`preference: ${preferences}`);
    return { success: true, learned: reasoning };
  },
});

export const getPersonalizedSuggestions = tool({
  parameters: z.object({}).describe("No parameters needed").default({}),
  description:
    "Get personalized restaurant recommendations based on user profile",
  execute: async ({}) => {
    return { message: "Getting personalized recommendations..." };
  },
});
