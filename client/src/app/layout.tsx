import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
});




export const metadata: Metadata = {
  title: "Asked",
  description: "Multiplayer online guessing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={shareTechMono.className}>
        {children}
      </body>
    </html>
  );
}
