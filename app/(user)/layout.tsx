import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/user/app-sidebar";
import { Header } from "@/components/user/header";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto px-4 py-6">{children}</div>{" "}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
