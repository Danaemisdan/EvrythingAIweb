import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Evrything AI",
  description: "Democratising AI for everybody",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        {children}
        <style dangerouslySetInnerHTML={{ __html: `nextjs-portal, #__next-build-watcher, [data-nextjs-dialog-overlay] { display: none !important; }` }} />
      </body>
    </html>
  );
}
