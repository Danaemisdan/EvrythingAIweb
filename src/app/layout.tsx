import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
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
      <body className={`${spaceGrotesk.variable} antialiased font-sans`}>
        {children}
        <style dangerouslySetInnerHTML={{ __html: `nextjs-portal, #__next-build-watcher, [data-nextjs-dialog-overlay] { display: none !important; }` }} />
      </body>
    </html>
  );
}
