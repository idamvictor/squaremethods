"use client";

import type * as React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Layers,
  FileText,
  Briefcase,
  CheckSquare,
  Users,
  UserCog,
  Settings,
  HelpCircle,
  Calendar,
  CircleX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Navigation data
const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Equipment Hierarchy",
    url: "/equipment-hierarchy",
    icon: Layers,
  },
  {
    title: "Job Aids",
    url: "/job-aids",
    icon: FileText,
  },
  {
    title: "Jobs",
    url: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Failure Mode",
    url: "/failure-mode",
    icon: CircleX,
  },
  {
    title: "Task",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Team",
    url: "/teams",
    icon: Users,
  },
  {
    title: "User Management",
    url: "/user-management",
    icon: UserCog,
  },
];

const supportNavItems = [
  {
    title: "Setting",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Help Center",
    url: "/help-center",
    icon: HelpCircle,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <Image
            src="https://res.cloudinary.com/dyp8gtllq/image/upload/v1749653962/image-removebg-preview_p37kee.png"
            alt="Squaremethods Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">
              SQUAREMETHODS
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            MAIN
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="h-9"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            SUPPORT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="h-9"
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group-data-[collapsible=icon]:hidden">
          <Calendar className="mr-2 h-4 w-4" />
          Claim your free trial
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
