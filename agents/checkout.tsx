import { Button } from "@/components/ui/button";
import { formatToNaira } from "@/lib/utils";
import { makeAssistantToolUI } from "@assistant-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { match } from "ts-pattern";

export const CheckoutUI = makeAssistantToolUI<
  {
    totalAmount: number;
  },
  {
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  }
>({
  toolName: "providePaymentButton",
  render: ({ status, result, args }) => {
    console.log("STATUS", status);
    console.log("ARGS", args);
    console.log("RESULT", result);
    if (status.type === "incomplete" && status.error === "error") {
      console.log("INCOMPLETE");
      return (
        <div className="text-red-500">Failed to generate payment link</div>
      );
    }
    return match(status.type)
      .with("running", () => {
        return (
          <div className="flex items-center gap-2">
            <Loader2Icon className="animate-spin" />
            <span>Generating payment link</span>
          </div>
        );
      })
      .with("complete", () => {
        const queryClient = useQueryClient();
        return (
          <div className="mt-4 px-8 w-full">
            <Button
              className="bg-green-500"
              onClick={async () => {
                const PaystackPop = await import("@paystack/inline-js");
                const popup = new PaystackPop.default();
                popup.resumeTransaction(result?.data.access_code ?? "", {
                  onSuccess: (data) => {
                    console.log("Hay", data);
                    toast.success("transaction was a success");
                    queryClient.invalidateQueries({
                      queryKey: ["cart_items"],
                    });
                  },
                });
              }}
            >
              Pay {formatToNaira(args.totalAmount)}
            </Button>
          </div>
        );
      })
      .otherwise(() => {
        return (
          <div className="text-red-500">
            Failed to generate payment link, something went wrong
          </div>
        );
      });
  },
});
