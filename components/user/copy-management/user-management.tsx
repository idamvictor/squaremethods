"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserTable } from "./user-table";
import { UserFilters } from "./user-filters";
import { UserPlus } from "lucide-react";
import { InviteUserModal } from "../teams/invite-user-modal";
import { useUsers } from "@/services/users/users-querries";
import type { UserFilters as APIUserFilters } from "@/services/users/users-types";

export function UserManagement() {
  const [filters, setFilters] = useState<APIUserFilters>({
    page: 1,
    limit: 20,
    search: "",
    role: "",
    status: "",
    team_id: "",
  });

  const { data: usersData, isLoading } = useUsers(filters);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  // const createUser = useCreateUser();

  const handleInviteUser = () => {
    setIsInviteModalOpen(true);
  };

  const handleFiltersChange = (newFilters: Partial<APIUserFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except when changing page)
      page: "page" in newFilters ? newFilters.page || 1 : 1,
    }));
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
      <UserFilters
        filters={filters}
        onFilterChange={handleFiltersChange}
        totalUsers={usersData?.pagination?.total || 0}
      />

      {/* User Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          Loading users...
        </div>
      ) : (
        <UserTable
          users={usersData?.data || []}
          onEditUser={(userId) => {
            console.log("Edit user:", userId);
          }}
          onDeleteUser={(userId) => {
            console.log("Delete user:", userId);
          }}
        />
      )}

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
