import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
