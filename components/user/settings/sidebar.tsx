"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Shield, Bell, Trash2 } from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive";
}

const sidebarItems: SidebarItem[] = [
  {
    id: "profile",
    label: "My Profile",
    icon: LayoutGrid,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
  },
  {
    id: "notification",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "delete",
    label: "Delete account",
    icon: Trash2,
    variant: "destructive",
  },
];

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  className?: string;
}

export function Sidebar({
  activeItem = "profile",
  onItemClick,
  className,
}: SidebarProps) {
  return (
    <div
      className={cn("w-64 bg-gray-50 border-r border-gray-200 p-4", className)}
    >
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          const isDestructive = item.variant === "destructive";

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10 px-3",
                isActive && "bg-gray-200 text-gray-900",
                isDestructive &&
                  !isActive &&
                  "text-red-600 hover:text-red-700 hover:bg-red-50",
                !isActive &&
                  !isDestructive &&
                  "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
              onClick={() => onItemClick?.(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
