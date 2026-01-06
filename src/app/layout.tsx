import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wasmer - Making software universally accessible",
  description: "Search packages, users, and apps on Wasmer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body className="bg-light-gray-wash text-wasmer-darker-grey antialiased">
        <div className="mx-auto max-w-[1440px]">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
