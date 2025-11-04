"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/services/users/users-querries";
import { useAddTeamMember } from "@/services/teams/teams";
import { toast } from "sonner";
import type { User } from "@/services/users/users-types";

interface SelectUserModalProps {
  open: boolean;
  onClose: () => void;
  teamId: string;
  currentMembers: string[];
}

export function SelectUserModal({
  open,
  onClose,
  teamId,
  currentMembers,
}: SelectUserModalProps) {
  const { data: usersData, isLoading } = useUsers({ limit: 100 });
  const addTeamMember = useAddTeamMember(teamId);

  const handleUserSelect = async (user: User) => {
    if (currentMembers.includes(user.id)) {
      return; // Don't allow selection of current members
    }

    try {
      await addTeamMember.mutateAsync({
        user_id: user.id,
        role: "member",
      });
      toast.success(`${user.first_name} ${user.last_name} added to team`);
      onClose();
    } catch (error) {
      toast.error("Failed to add member to team");
      console.error("Failed to add member:", error);
    }
  };

  const isUserSelectable = (userId: string) => !currentMembers.includes(userId);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Team Member</DialogTitle>
          </DialogHeader>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Team Member</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>USER</TableHead>
                  <TableHead>EMAIL</TableHead>
                  <TableHead>ROLE</TableHead>
                  <TableHead>STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(usersData?.data || []).map((user) => {
                  const isDisabled = !isUserSelectable(user.id);

                  return (
                    <TableRow
                      key={user.id}
                      className={`
                        ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:bg-gray-50"
                        }
                      `}
                      onClick={() => !isDisabled && handleUserSelect(user)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>
                              {user.first_name[0]}
                              {user.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.username}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
