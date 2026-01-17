import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootStoreProvider } from "@/zustand/root-store-provider";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YieldMind - Creative Technology Institute",
  description: "Master Graphic Design, Web Development, and VFX at Dehradun's premier institute.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
      
        <main className="flex-1">
          <RootStoreProvider>
          {children}
          </RootStoreProvider>
        </main>
       
        <Toaster />
      </body>
    </html>
  );
}
