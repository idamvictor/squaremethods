"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLogout } from "@/lib/api/auth";
import { useState } from "react";

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
    setDialogOpen(false);
  };

  return (
    <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You&apos;ll need to log in again
              to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isPending}
            >
              {isPending ? "Logging out..." : "Log out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
