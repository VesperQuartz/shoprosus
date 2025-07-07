import { env } from "@/env/server";
import * as nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.mail,
    pass: env.mailPass,
  },
});
