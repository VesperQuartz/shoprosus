import { Card } from "@/components/ui/card";
import { formatToNaira } from "@/lib/utils";
import { CartTableInsert } from "@/repo/schema/schema";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { match } from "ts-pattern";

export const AddToCartMenuUI = makeAssistantToolUI<
  {
    cart: Array<{
      name: string;
      price: number;
      image?: string;
      quantity?: number;
    }>;
  },
  CartTableInsert[]
>({
  toolName: "addMenuItemToCart",
  render: ({ status, result, args }) => {
    console.log("STATUS", status);
    console.log("ARGS", args);
    console.log("RESULT", result);
    if (status.type === "incomplete" && status.error === "error") {
      console.log("INCOMPLETE");
      return <div className="text-red-500">Failed to add item to cart</div>;
    }
    return match(status.type)
      .with("running", () => {
        return (
          <div className="flex items-center gap-2">
            <Loader2Icon className="animate-spin" />
            <span>Adding your items to your cart</span>
          </div>
        );
      })
      .with("complete", () => {
        const queryClient = useQueryClient();
        queryClient.invalidateQueries({
          queryKey: ["cart_items"],
        });
        return (
          <div className="mt-4 px-8 w-full">
            <h1>Items added to cart</h1>
            <div className="flex gap-2 m-2 flex-col">
              {result?.map((item) => (
                <Card
                  key={item.id}
                  className="w-full h-20 sm:h-24 md:h-28 
                 border-none bg-gray-900 flex flex-row 
                 transition-all duration-200 hover:bg-gray-800"
                >
                  <div className="flex-shrink-0 w-16 sm:w-20 md:w-24 h-full p-1 sm:p-2">
                    <Image
                      src={item.image ?? "/no_image.png"}
                      width={200}
                      height={200}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 p-2 sm:p-3 flex flex-col justify-center min-w-0">
                    <p
                      className="text-xs sm:text-sm md:text-base font-medium text-white 
                     line-clamp-2 leading-tight"
                    >
                      {item.name}
                    </p>

                    <div className="flex justify-between items-center mt-1 sm:mt-2">
                      <p className="text-xs sm:text-sm md:text-base font-semibold text-green-400">
                        {formatToNaira(item.price)}
                      </p>
                      <p
                        className="text-xs text-gray-300 
                       bg-gray-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex-shrink-0"
                      >
                        x{item.quantity}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })
      .otherwise(() => {
        return (
          <div className="text-red-500">Failed to get Restuarent menu</div>
        );
      });
  },
});
