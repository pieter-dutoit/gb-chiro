import type { Metadata } from "next";
import localFont from "next/font/local";

import Navbar from "@/components/navbar";

import "./globals.css";

const Font = localFont({
  src: "../../assets/fonts/NunitoSans-VariableFont.ttf",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GB Chiropractic",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={Font.variable}>
      <body className="antialiased">
        <header>
          <Navbar />
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
