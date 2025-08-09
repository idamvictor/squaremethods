"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import type { User } from "./user-management";

interface UserTableProps {
  users: User[];
  onDeleteUser: (userId: string) => void;
  onEditUser: (userId: string) => void;
}

export function UserTable({ users, onDeleteUser, onEditUser }: UserTableProps) {
  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "Super Admin":
        return "default";
      case "Admin":
        return "secondary";
      case "Editor":
        return "outline";
      case "Viewer":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getTeamBadgeVariant = (team: User["team"]) => {
    switch (team) {
      case "Operational":
        return "default";
      case "Sanitation":
        return "secondary";
      case "Maintenance":
        return "outline";
      case "Automation":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="font-medium text-gray-700">USERS</TableHead>
            <TableHead className="font-medium text-gray-700">ROLE</TableHead>
            <TableHead className="font-medium text-gray-700">TEAM</TableHead>
            <TableHead className="font-medium text-gray-700">
              DATE ENTERED
            </TableHead>
            <TableHead className="font-medium text-gray-700">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    {user.isVerified && (
                      <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-500 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getRoleBadgeVariant(user.role)}
                  className="font-normal"
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getTeamBadgeVariant(user.team)}
                  className="font-normal"
                >
                  {user.team}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">
                {user.dateEntered}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteUser(user.id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete user</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditUser(user.id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit user</span>
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
