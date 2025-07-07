import { authClient } from "@/lib/auth-client"; //import the auth client
import { transporter } from "@/lib/mail";
import { to } from "await-to-ts";

type AuthParams = {
  email: string;
  password: string;
  name: string;
  image?: string;
  callbackURL?: string;
};

export const signUp = async ({
  email,
  password,
  name,
  image,
  callbackURL,
}: AuthParams) => {
  const { data, error } = await authClient.signUp.email(
    {
      email,
      password,
      name,
      image,
      callbackURL,
    },
    {
      onRequest: () => {},
      onSuccess: () => {},
      onError: (ctx) => {
        console.log(ctx.error.message);
      },
    },
  );
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const sendVerificationEmail = async ({
  reciever,
  url,
}: {
  reciever: string;
  url: string;
}) => {
  const [error, response] = await to(
    transporter.sendMail({
      to: reciever,
      subject: "Email Verification",
      html: `
        <h1>Click on the link below to verify your email</h1>
        <a href="${url}">Verify</a>
      `,
    }),
  );
  if (error) {
    console.error(error, "EMAIL");
    throw new Error("Something went wrong");
  }
  return response;
};
