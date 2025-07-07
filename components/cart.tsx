"use client";

import React, { useState } from "react";
import { ShoppingCart, X, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetHeader,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useClearCart, useGetCart, useInitializePayment } from "@/hooks/api";
import { formatToNaira } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Cart = ({ children }: { children: React.ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const deleteCart = useClearCart();
  const queryClient = useQueryClient();
  const initPay = useInitializePayment();

  const cart = useGetCart();

  const getTotalItems = () => {
    return cart?.data?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getTotalPrice = () => {
    return (
      cart?.data?.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ) || 0
    );
  };

  const isEmpty = !cart.data || cart.data.length === 0;

  return (
    <div className="w-full">
      <div className="flex items-center space-x-4">
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <div className="relative bg-transparent size-full cursor-pointer">
              {children}
            </div>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-md p-0 border-none bg-gray-900"
          >
            <div className="flex flex-col h-full">
              <SheetHeader className="px-6 py-4 border-b border-purple-800/50 bg-gradient-to-r from-purple-900/50 to-purple-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="h-5 w-5 text-purple-400" />
                    <SheetTitle className="text-lg font-semibold text-white">
                      Shopping Cart
                    </SheetTitle>
                    {getTotalItems() > 0 && (
                      <Badge
                        variant="secondary"
                        className="rounded-full bg-purple-600 text-white border-purple-500"
                      >
                        {getTotalItems()}{" "}
                        {getTotalItems() === 1 ? "item" : "items"}
                      </Badge>
                    )}
                  </div>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-purple-800/50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                {isEmpty ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                    <ShoppingCart className="h-16 w-16 text-purple-600/50 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Add some items to get started
                    </p>
                  </div>
                ) : (
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {cart?.data?.map((item, index) => (
                        <div key={item.id}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white truncate">
                                {item.name}
                              </h4>
                              <p className="text-sm font-medium text-purple-400 mt-1 flex gap-2">
                                {formatToNaira(item.price)} <X size={20} />{" "}
                                {item.quantity}
                              </p>
                            </div>
                          </div>
                          {index < cart.data.length - 1 && (
                            <Separator className="mt-4 bg-purple-800/50" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!isEmpty && (
                <div className="border-t border-purple-800/50 bg-gradient-to-r from-purple-900/30 to-purple-800/20 px-6 py-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-white">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-purple-400">
                        {formatToNaira(getTotalPrice())}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 font-medium shadow-lg"
                        size="lg"
                        onClick={() => {
                          initPay.mutate(getTotalPrice() * 100, {
                            onSuccess: async (data) => {
                              const PaystackPop = await import(
                                "@paystack/inline-js"
                              );
                              const popup = new PaystackPop.default();
                              popup.resumeTransaction(
                                data.data?.access_code ?? "",
                                {
                                  onSuccess: (data) => {
                                    toast.success(data.message);
                                    deleteCart.mutate(undefined, {
                                      onSuccess: () => {
                                        queryClient.invalidateQueries({
                                          queryKey: ["cart_items"],
                                        });
                                      },
                                    });
                                  },
                                },
                              );
                            },
                          });
                        }}
                      >
                        Proceed to Checkout{" "}
                        {initPay.isPending && (
                          <Loader2Icon className="animate-spin" />
                        )}
                      </Button>
                      <div className="text-center">
                        <Button
                          variant="ghost"
                          className="text-red-400 w-full bg-red-900 hover:text-red-300 hover:bg-red-900 font-medium"
                          onClick={() => {
                            deleteCart.mutate(undefined, {
                              onSuccess: (data) => {
                                queryClient.invalidateQueries({
                                  queryKey: ["cart_items"],
                                });
                                toast.success(data.message);
                              },
                            });
                          }}
                        >
                          Clear Cart{" "}
                          {deleteCart.isPending && (
                            <Loader2Icon className="animate-spin" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
