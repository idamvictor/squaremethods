"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onLogout?: () => void;
}

export function PageHeader({ title, onLogout }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <Button variant="outline" onClick={onLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Log out
      </Button>
    </header>
  );
}
