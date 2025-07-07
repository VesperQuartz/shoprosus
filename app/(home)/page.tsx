"use client";
import {
  AssistantRuntimeProvider,
  WebSpeechSynthesisAdapter,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { RestuarantToolUI } from "@/agents/available-resturant";
import { RestuarantMenuUi } from "@/agents/resturant-menu";
import { AddToCartMenuUI } from "@/agents/add-menu-to-cart";
import { CheckoutUI } from "@/agents/checkout";
import { CartMenuUI } from "@/agents/cart-menu";

const Shop = () => {
  const runtime = useChatRuntime({
    api: "/api/chat",
    adapters: {
      speech: new WebSpeechSynthesisAdapter(),
    },
    onError: (error) => {
      console.error("BIG_ERROR", error);
    },
    maxSteps: 5,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-dvh  gap-x-2 w-full">
        <Thread />
        <RestuarantToolUI />
        <RestuarantMenuUi />
        <AddToCartMenuUI />
        <CartMenuUI />
        <CheckoutUI />
      </div>
    </AssistantRuntimeProvider>
  );
};

export default Shop;
