"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/user/app-sidebar";
import { Header } from "@/components/user/header";
import { useAuthProtection } from "@/hooks/use-auth-protection";
import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, isValidating } = useAuthProtection();
  const user = useAuthStore((state) => state.user);

  // Don't render anything while validating or if not authenticated
  if (isValidating || !isAuthenticated) {
    return null;
  }

  // Additional role-based protection
  if (user?.role !== "owner" && user?.role !== "admin") {
    redirect("/technician/dashboard");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
