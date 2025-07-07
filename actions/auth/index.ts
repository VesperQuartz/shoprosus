"use server";
import { auth } from "@/lib/auth";
import to from "await-to-ts";

type Auth = {
  email: string;
  name: string;
  password: string;
};

export const emailSignUp = async ({ email, name, password }: Auth) => {
  const [error, response] = await to(
    auth.api.signUpEmail({
      body: {
        email,
        name,
        password,
        callbackURL: "/",
      },
    }),
  );
  if (error) {
    return { message: error.message };
  }
  console.log(response);
  return { message: "Check your email to verify" };
};
