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
import { Badge } from "@/components/ui/badge";
import type { User } from "@/services/users/users-types";
import { useUsers } from "@/services/users/users-querries";

interface SelectableUserTableProps {
  onUserSelect: (user: User | null) => void;
  selectedUser: User | null;
  currentMembers: string[]; // Array of current member IDs
}

export function SelectableUserTable({
  onUserSelect,
  selectedUser,
  currentMembers,
}: SelectableUserTableProps) {
  const { data: usersData, isLoading } = useUsers({ limit: 100 });
  const users = usersData?.data || [];

  const handleRowClick = (user: User) => {
    if (currentMembers.includes(user.id)) {
      return; // Don't allow selection of current members
    }
    onUserSelect(selectedUser?.id === user.id ? null : user);
  };

  const isUserSelectable = (userId: string) => !currentMembers.includes(userId);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white shadow-sm p-4">
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
      </div>
    );
  }

  return (
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
          {users.map((user) => {
            const isSelected = selectedUser?.id === user.id;
            const isDisabled = !isUserSelectable(user.id);

            return (
              <TableRow
                key={user.id}
                className={`
                  ${isSelected ? "bg-blue-50" : ""}
                  ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-50"
                  }
                `}
                onClick={() => !isDisabled && handleRowClick(user)}
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
                      <p className="text-sm text-gray-500">{user.username}</p>
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
                    variant={user.status === "active" ? "default" : "secondary"}
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
  );
}
