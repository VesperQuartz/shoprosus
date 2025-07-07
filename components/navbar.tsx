"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ShoppingCart, Menu, User, LogOut } from "lucide-react";
import React from "react";
import { authClient } from "@/lib/auth-client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { Cart } from "./cart";
import { useGetCart } from "@/hooks/api";

const Header = () => {
  const session = authClient.useSession();
  const navigate = useRouter();
  const cart = useGetCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              shoprosus
            </h1>
            <p className="text-xs text-muted-foreground">
              Premium Shopping Experience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-accent/50 transition-colors"
          >
            <Cart>
              <ShoppingCart className="w-5 h-5" />
            </Cart>
            {cart.data && cart.data?.length > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-primary">
                {cart.data.length ?? 0}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden hover:bg-accent/50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-2 hover:bg-accent/50 transition-colors"
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src={session.data?.user.image ?? ""} />
                  <AvatarFallback className="bg-gradient-primary text-white text-xs">
                    {session.data?.user.name.at(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {session.data?.user.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-popover border border-border shadow-lg"
              align="end"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{session.data?.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {session.data?.user.email}
                </p>
              </div>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="hover:bg-accent cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-accent cursor-pointer">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Order History
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={async () => {
                  await authClient.signOut();
                  navigate.replace("/auth");
                }}
                className="hover:bg-accent cursor-pointer text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
