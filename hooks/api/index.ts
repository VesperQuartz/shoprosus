import { CartTableSelect } from "@/repo/schema/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import to from "await-to-ts";
import ky, { HTTPError } from "ky";

export const useGetCart = () => {
  return useQuery({
    queryKey: ["cart_items"],
    queryFn: async () => {
      const [error, response] = await to(ky(`/api/cart`));
      if (error instanceof HTTPError) {
        const e = await error.response.json();
        throw new Error(e.message);
      }
      return response.json<CartTableSelect[]>();
    },
  });
};

export const useClearCart = () => {
  return useMutation({
    mutationKey: ["clear_cart"],
    mutationFn: async () => {
      const [error, response] = await to(ky.delete(`/api/cart`));
      if (error instanceof HTTPError) {
        const e = await error.response.json();
        throw new Error(e.message);
      }
      return response.json<{ message: string }>();
    },
  });
};

export const useInitializePayment = () => {
  return useMutation({
    mutationKey: ["init_payment"],
    mutationFn: async (amount: number) => {
      const [error, response] = await to(
        ky.post(`/api/initialize`, {
          json: { amount },
        }),
      );
      if (error instanceof HTTPError) {
        const e = await error.response.json();
        throw new Error(e.message);
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
    },
  });
};
