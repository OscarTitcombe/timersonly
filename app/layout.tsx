import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemedBody } from "@/components/ThemedBody";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "TimersOnly – Minimal Online Timers",
  description:
    "TimersOnly is a clean, ad-free collection of minimalist online timers and Pomodoro tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <ThemeProvider>
        <ThemedBody>{children}</ThemedBody>
      </ThemeProvider>
    </html>
  );
}

