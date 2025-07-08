"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Github, Loader2Icon } from "lucide-react";
import { signupSchema, type SignupFormData } from "@/lib/auth-schema";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import to from "await-to-ts";
import { toast } from "sonner";
import { emailSignUp } from "@/actions/auth";
import React from "react";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = React.useState<
    { state: boolean; type: string } | undefined
  >(undefined);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    console.log("Form submitted:", data);
    if (!data.acceptTerms) {
      toast.error("please accept the terms and condition");
      return;
    }
    const [error, response] = await to(
      emailSignUp({
        name: `${data.lastName} ${data.firstName}`,
        email: data.email,
        password: data.password,
      }),
    );
    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }
    toast.success(response.message);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-form-bg rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          <div className="lg:w-1/2 relative">
            <Image
              src={"/landscape.jpg"}
              alt="Purple mountain landscape"
              className="w-full h-full object-cover"
              width={500}
              height={500}
            />
            <div className="absolute inset-0 bg-gradient-primary opacity-20" />
          </div>

          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create an account
              </h1>
              <p className="text-muted-foreground mb-8">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-primary hover:underline font-medium"
                >
                  Log in
                </button>
              </p>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="First Name"
                              className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Last Name"
                              className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email"
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 pr-12"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </FormControl>
                          <label className="text-sm text-muted-foreground">
                            I agree to the{" "}
                            <Button
                              variant={"link"}
                              type="button"
                              className="text-purple-600 hover:underline"
                            >
                              terms & conditions
                            </Button>
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-purple-600 text-white font-semibold text-base hover:bg-purple-600/60 transition-opacity"
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Create account"
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-form-bg px-4 text-muted-foreground">
                        Or register with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={async () => {
                        setLoading({ state: true, type: "google" });
                        const [error] = await to(
                          authClient.signIn.social({
                            provider: "google",
                            callbackURL: "/",
                          }),
                        );
                        if (error) {
                          setLoading({ state: false, type: "google" });
                          toast.error(error.message);
                          return;
                        }
                      }}
                      type="button"
                      variant="outline"
                      className="h-12 bg-secondary border-border hover:bg-accent text-foreground"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                      {loading?.state && loading.type == "google" && (
                        <Loader2Icon className="animate-spin" />
                      )}
                    </Button>
                    <Button
                      onClick={async () => {
                        setLoading({ state: true, type: "github" });
                        const [error] = await to(
                          authClient.signIn.social({
                            provider: "github",
                            callbackURL: "/",
                          }),
                        );
                        if (error) {
                          setLoading({ state: false, type: "github" });
                          toast.error(error.message);
                          return;
                        }
                      }}
                      type="button"
                      variant="outline"
                      className="h-12 bg-secondary border-border hover:bg-accent text-foreground"
                    >
                      <Github className="w-5 h-5 mr-2" />
                      GitHub
                      {loading?.state && loading.type == "github" && (
                        <Loader2Icon className="animate-spin" />
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
