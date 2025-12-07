import { useState } from "react";
import {
  Search,
  Bell,
  RefreshCw,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { FileManagerModal } from "@/components/shared/file-manager/file-manager-modal";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.first_name || !user?.last_name) return "SM";
    const firstInitial = user.first_name.charAt(0);
    const lastInitial = user.last_name.charAt(0);
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleFileSelect = (fileUrl: string) => {
    // Handle file selection here
    console.log("Selected file:", fileUrl);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
        </div>

        <div className="flex flex-1 items-center justify-center px-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage
                  src={
                    user?.avatar_url || "/placeholder.svg?height=32&width=32"
                  }
                  alt={user?.first_name || "User"}
                />
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.first_name || "Guest"} {user?.last_name || ""}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "No email"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsFileManagerOpen(true)}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <FileManagerModal
        open={isFileManagerOpen}
        onOpenChange={setIsFileManagerOpen}
        onFileSelect={handleFileSelect}
      />
    </header>
  );
}
