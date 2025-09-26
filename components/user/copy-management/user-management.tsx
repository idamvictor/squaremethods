"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserTable } from "./user-table";
import { UserFilters } from "./user-filters";
import { UserPlus } from "lucide-react";
import { InviteUserModal } from "../teams/invite-user-modal";
import { avatarImage } from "@/constants/images";

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: "Admin" | "Super Admin" | "Viewer" | "Editor";
  team: "Operational" | "Sanitation" | "Maintenance" | "Automation";
  dateEntered: string;
  isVerified?: boolean;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Olivia Rhye",
    avatar: avatarImage.image1,
    role: "Admin",
    team: "Operational",
    dateEntered: "05 / 12 / 2025",
  },
  {
    id: "2",
    name: "Phoenix Baker",
    avatar: avatarImage.image2,
    role: "Super Admin",
    team: "Sanitation",
    dateEntered: "05 / 12 / 2025",
    isVerified: true,
  },
  {
    id: "3",
    name: "Phoenix Baker",
    avatar: avatarImage.image3,
    role: "Viewer",
    team: "Maintenance",
    dateEntered: "05 / 12 / 2025",
  },
  {
    id: "4",
    name: "Lana Steiner",
    avatar: avatarImage.image4,
    role: "Editor",
    team: "Maintenance",
    dateEntered: "05 / 12 / 2025",
  },
  {
    id: "5",
    name: "Phoenix Baker",
    avatar: avatarImage.image1,
    role: "Admin",
    team: "Maintenance",
    dateEntered: "05 / 12 / 2025",
  },
  {
    id: "6",
    name: "Phoenix Baker",
    avatar: avatarImage.image2,
    role: "Viewer",
    team: "Automation",
    dateEntered: "05 / 12 / 2025",
  },
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleInviteUser = () => {
    setIsInviteModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const handleEditUser = (userId: string) => {
    // Handle edit user logic
    console.log("Edit user:", userId);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">User List</h1>
        <Button
          onClick={handleInviteUser}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Filters */}
      <UserFilters users={users} onFilterChange={setFilteredUsers} />

      {/* User Table */}
      <UserTable
        users={filteredUsers}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleEditUser}
      />

      <InviteUserModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onInviteSuccess={(emails, role) => {
          console.log("Invited users:", emails, "with role:", role);
          // Handle successful invitation
        }}
      />
    </div>
  );
}
