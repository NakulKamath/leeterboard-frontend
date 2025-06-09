import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import { Toaster } from "sonner";
import Topnav from "@/components/Topnav";

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  variable: "--font-atkinson-hyperlegible",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "leeterboard.xyz",
  description: "Leetcode Leaderboards",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${atkinsonHyperlegible.variable} antialiased`}
      >
        <AuthProvider>
          <Topnav />
          <Toaster className="select-none" position="top-center"/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
