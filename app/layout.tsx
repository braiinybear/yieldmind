import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import "./globals.css";

import { RootStoreProvider } from "@/zustand/root-store-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import LoadingScreen from "@/components/shared/LoadingScreen";
import SmoothScroll from "@/components/shared/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Premium Fonts
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "YieldMind - Creative Technology Institute",
  description:
    "Master Graphic Design, Web Development, and VFX at Dehradun's premier institute.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col`}
      >

        <SessionProvider>
          <RootStoreProvider>
            <SmoothScroll />
            <LoadingScreen />
            <main className="flex-1">{children}</main>
          </RootStoreProvider>

          {/* Toast notifications */}
          <Toaster position="top-right" richColors closeButton />
        </SessionProvider>
      </body>
    </html>
  );
}
