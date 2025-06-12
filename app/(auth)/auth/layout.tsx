import RightSection from "@/components/auth/right-section/right-section";
import React from "react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-accent">
      <div className="flex-1/2 ">{children}</div>
      <div className="flex-1/2"><RightSection /></div>
    </div>
  );
}