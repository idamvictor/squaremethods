"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InviteUserModal } from "@/components/user/teams/invite-user-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter } from "lucide-react";
import { useUsers } from "@/services/users/users-querries";
// import { User as ApiUser } from "@/services/users/users-types";

// interface UserWithSelection extends ApiUser {
//   selected: boolean;
// }

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMemberModal({ open, onOpenChange }: AddMemberModalProps) {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [filters] = useState({
    page: 1,
    limit: 50,
    role: "",
    status: "active",
  });

  const { data: usersData, isLoading } = useUsers(filters);

  const handleUserSelect = (userId: string, selected: boolean) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "super admin":
        return "bg-purple-100 text-purple-800";
      case "editor":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Team Members</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              className="px-4 py-2 text-sm font-medium ml-auto"
              onClick={() => setInviteModalOpen(true)}
            >
              Invite User
            </Button>
          </div>
        </div>

        <InviteUserModal
          open={inviteModalOpen}
          onOpenChange={setInviteModalOpen}
          onInviteSuccess={(emails, role) => {
            // Handle the invite success if needed
            console.log("Invited users:", emails, "with role:", role);
          }}
        />

        {/* Filters */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select defaultValue="50">
                <SelectTrigger className="w-20 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">All</span>
            </div>
            <Button
              variant="ghost"
              className="text-sm text-gray-600 px-3 py-1 h-8"
            >
              Recent Added
            </Button>
          </div>
          <Button
            variant="ghost"
            className="text-sm text-gray-600 px-3 py-1 h-8"
          >
            Reset Filter
          </Button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 mb-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="col-span-4">USERS</div>
          <div className="col-span-2">ROLE</div>
          <div className="col-span-3">TEAM</div>
          <div className="col-span-3 text-right">Select</div>
        </div>

        {/* User List */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-sm text-gray-500">Loading users...</p>
              </div>
            ) : (
              usersData?.data.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0"
                >
                  {/* User Info */}
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatar_url || "/placeholder.svg"}
                        alt={`${user.first_name} ${user.last_name}`}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-xs font-medium">
                        {getInitials(`${user.first_name} ${user.last_name}`)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </span>
                  </div>

                  {/* Role */}
                  <div className="col-span-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium px-2 py-1 ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </Badge>
                  </div>

                  {/* Team */}
                  <div className="col-span-3">
                    <span className="text-sm text-gray-600">
                      {user.team?.name || "No team"}
                    </span>
                  </div>

                  {/* Select Checkbox */}
                  <div className="col-span-3 flex justify-end">
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={(checked) =>
                        handleUserSelect(user.id, checked as boolean)
                      }
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <Button className=" px-6 py-2 text-sm font-medium">Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
