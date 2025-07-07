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
