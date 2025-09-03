import type { Metadata } from "next";

import localFont from "next/font/local";

import "./globals.css";
import Navbar from "@/components/navbar";

const Inter = localFont({
  src: "../../assets/fonts/Inter-VariableFont.ttf",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GB Chiropractic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={Inter.variable}>
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
