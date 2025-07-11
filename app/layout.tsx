import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AsyncProvider } from "@/providers/async";
import { ThemeProvider } from "next-themes";
import { LoadingProvider } from "@/providers/loader";

const spaceSans = Space_Grotesk({
  weight: ["400", "700", "300", "500", "600"],
  variable: "--font-spece-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shoprosus",
  description: "Agent-Powered E-Commerce Restaurant App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("ENVIRONMENT-WHICH", process.env.NODE_ENV);
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${spaceSans.variable}  antialiased`}
        suppressHydrationWarning={true}
      >
        <AsyncProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LoadingProvider>
              <NuqsAdapter> {children}</NuqsAdapter>
            </LoadingProvider>
          </ThemeProvider>
        </AsyncProvider>
        <Toaster richColors={true} position="top-center" />
      </body>
    </html>
  );
}
