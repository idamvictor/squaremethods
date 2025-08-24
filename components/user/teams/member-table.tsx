"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import type { TeamMember } from "@/types/team";

interface MemberTableProps {
  members: TeamMember[];
}

export function MemberTable({ members }: MemberTableProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="py-3">
            <TableHead className="w-[40px] py-4">
              <Checkbox />
            </TableHead>
            <TableHead className="py-4">MEMBERS</TableHead>
            <TableHead className="py-4">ROLE</TableHead>
            <TableHead className="py-4">EMAIL</TableHead>
            <TableHead className="py-4">CONTACT</TableHead>
            <TableHead className="py-4">DATE ENTERED</TableHead>
            <TableHead className="text-right p-4">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="py-3">
              <TableCell className="py-4">
                <Checkbox />
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                    />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.name}</span>
                </div>
              </TableCell>
              <TableCell className="py-4">{member.role}</TableCell>
              <TableCell className="py-4">{member.email}</TableCell>
              <TableCell className="py-4">{member.contact}</TableCell>
              <TableCell className="py-4">{member.dateEntered}</TableCell>
              <TableCell className="text-right py-4">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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
