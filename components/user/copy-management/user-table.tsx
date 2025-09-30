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
import { useState } from "react";
import type { User } from "@/services/users/users-types";
import { DeleteUserModal } from "./delete-user-modal";
import { EditUserForm } from "./edit-user-form";
import { useDeleteUser, useUpdateUser } from "@/services/users/users-querries";
import { toast } from "sonner";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const deleteUser = useDeleteUser(userToDelete?.id || "");
  const updateUser = useUpdateUser(userToEdit?.id || "");

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
  };

  const handleEditClick = (user: User) => {
    setUserToEdit(user);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser.mutateAsync();
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setUserToDelete(null);
    }
  };

  const handleUpdateSubmit = async (data: {
    first_name: string;
    last_name: string;
    phone?: string;
    role: string;
  }) => {
    if (!userToEdit) return;

    try {
      await updateUser.mutateAsync(data);
      setUserToEdit(null);
    } catch {
      throw new Error("Failed to update user");
    }
  };
  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "default";
      case "editor":
        return "outline";
      case "viewer":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
              DATE JOINED
            </TableHead>
            <TableHead className="font-medium text-gray-700">ACTIONS</TableHead>
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
                        src={user.avatar_url || "/placeholder.svg"}
                        alt={`${user.first_name} ${user.last_name}`}
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        {getUserInitials(user.first_name, user.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    {user.email_verified && (
                      <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-500 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {`${user.first_name} ${user.last_name}`}
                    </span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
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
                <span className="text-gray-600">
                  {user.team?.name || "No Team"}
                </span>
              </TableCell>
              <TableCell className="text-gray-600">
                {formatDate(user.created_at)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(user)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete user</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(user)}
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

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <DeleteUserModal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleDeleteConfirm}
          userName={`${userToDelete.first_name} ${userToDelete.last_name}`}
        />
      )}

      {/* Edit User Form */}
      {userToEdit && (
        <EditUserForm
          user={userToEdit}
          isOpen={!!userToEdit}
          onClose={() => setUserToEdit(null)}
          onSubmit={handleUpdateSubmit}
        />
      )}
    </div>
  );
}
