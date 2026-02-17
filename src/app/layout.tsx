import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["700", "800", "900"] });

export const metadata: Metadata = {
  title: "Smart Bookmark App — Save, Organize & Sync",
  description: "A real-time bookmark manager with Google OAuth, private collections, and instant sync across all your devices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <div className="bg-main" />
        <div className="bg-noise" />
        <div className="relative min-h-screen z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
