import type { Metadata } from "next";
import localFont from "next/font/local";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import { getHomePageData } from "@/lib/data";
import createMetadataConfig from "@/lib/utils/generate-metadata";

import "./globals.css";

const Font = localFont({
  src: "../../assets/fonts/NunitoSans-VariableFont.ttf",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomePageData();
  if (!seo) return {};
  return createMetadataConfig(seo);
}

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
        <Footer />
      </body>
    </html>
  );
}
