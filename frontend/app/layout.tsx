import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";
import { AddButtonsProvider } from "@/components/AddButtonsContext";
import { ShowPreviousPeriodsProvider } from "@/components/ShowPreviousPeriodsContext";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Matches font.family.body/heading ("Inter") from the Figma tokens.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  // Tab title is the committee name; pages with their own title show as
  // "<page> | <committee>".
  title: { default: "Rising Idols: Fame is a Weapon", template: "%s | Rising Idols: Fame is a Weapon" },
  description: "Rising Idols: Fame is a Weapon crisis staff workspace.",
  icons: { icon: "/favicon.png", apple: "/favicon-apple.png" },
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen">
        <Providers>
          <TooltipProvider>
            <AddButtonsProvider>
              <ShowPreviousPeriodsProvider>
                <Navbar />
                {props.children}
              </ShowPreviousPeriodsProvider>
            </AddButtonsProvider>
            <Toaster />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
