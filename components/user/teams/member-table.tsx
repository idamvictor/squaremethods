"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserX2 } from "lucide-react";
import { TeamMember } from "@/services/teams/teams-types";

interface MemberTableProps {
  members: TeamMember[];
  isLoading?: boolean;
  onViewProfile?: (memberId: string) => void;
  onChangeRole?: (memberId: string) => void;
  onRemoveMember?: (memberId: string) => void;
}

export function MemberTable({
  members,
  isLoading,
  onViewProfile,
  onChangeRole,
  onRemoveMember,
}: MemberTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading members...
        </div>
      </div>
    );
  }

  if (!members?.length) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center gap-2">
        <UserX2 className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">No team members found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Join Date</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {member.first_name[0]}
                    {member.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="font-medium">
                  {member.first_name} {member.last_name}
                </div>
              </div>
            </TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell className="capitalize">{member.role}</TableCell>
            <TableCell>
              {new Date(member.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewProfile?.(member.id)}>
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onChangeRole?.(member.id)}>
                    Change Role
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onRemoveMember?.(member.id)}
                    className="text-red-600"
                  >
                    Remove Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
