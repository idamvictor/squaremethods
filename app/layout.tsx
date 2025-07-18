import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Square Methods",
  description: "Generated by create next app",
  icons: {
    icon: "https://res.cloudinary.com/dyp8gtllq/image/upload/v1749653962/image-removebg-preview_p37kee.png",
    shortcut:
      "https://res.cloudinary.com/dyp8gtllq/image/upload/v1749653962/image-removebg-preview_p37kee.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
