import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ProgressProvider } from "@/providers/progress-provider";
import { SwrConfigProvider } from "@/providers/swr-config-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bulletproof Fitness Equipment",
  description: "Bulletproof Fitness Equipment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ProgressProvider>
          <SwrConfigProvider>{children}</SwrConfigProvider>
        </ProgressProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
