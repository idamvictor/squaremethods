"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Pencil, CheckCircle } from "lucide-react";
import type { User } from "@/types/user";
import { useUserStore } from "@/store/user-store";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const { deleteUser } = useUserStore();

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
  };

  const handleEditUser = (userId: string) => {
    // Placeholder for edit functionality
    console.log("Edit user:", userId);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "default";
      case "Admin":
        return "secondary";
      case "Editor":
        return "outline";
      case "Viewer":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>USERS</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead>TEAM</TableHead>
            <TableHead>DATE ENTERED</TableHead>
            <TableHead className="text-right">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getRoleBadgeVariant(user.role)}
                  className="text-xs"
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-gray-600">{user.team}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-600">{user.dateEntered}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditUser(user.id)}
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
