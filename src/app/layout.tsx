import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ashlesha Enterprises | Premium Hardware",
  description: "Bespoke plywood, doors, furniture, and fishing tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#030303] text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
