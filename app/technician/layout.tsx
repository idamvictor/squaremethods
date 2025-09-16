import { TechnicianSidebar } from "@/components/technician/technician-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/user/header";
import { useAuthProtection } from "@/hooks/use-auth-protection";
import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";

export default function TechnicianLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuthProtection();
  const user = useAuthStore((state) => state.user);

  // Additional role-based protection
  if (isAuthenticated && (user?.role === "owner" || user?.role === "admin")) {
    redirect("/dashboard");
  }
  return (
    <SidebarProvider>
      <TechnicianSidebar />
      <SidebarInset>
        <Header />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
