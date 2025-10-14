"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberTable } from "./member-table";
import { ArrowLeft, Plus, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useTeamDetails, useTeamMembers } from "@/services/teams/teams";

interface TeamFilters {
  count: string;
}

interface TeamDetailsProps {
  teamId: string;
}

export function TeamDetails({ teamId }: TeamDetailsProps) {
  const { data: teamDetails, isLoading: isLoadingTeam } =
    useTeamDetails(teamId);
  const { data: membersData, isLoading: isLoadingMembers } =
    useTeamMembers(teamId);
  const [filters, setFilters] = useState<TeamFilters>({
    count: "50",
  });

  const handleFilterChange = (key: keyof TeamFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filter members based on the 'category' filter (we're just passing through all members since joined_at is not available)
  const filteredMembers = membersData?.data ?? [];

  if (isLoadingTeam || isLoadingMembers) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!teamDetails?.data) {
    return <div className="p-6 text-center text-gray-600">Team not found.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/teams" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            {teamDetails.data.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {teamDetails.data.members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                <AvatarFallback className="text-xs">
                  {member.first_name[0]}
                  {member.last_name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
            {teamDetails.data.members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  +{teamDetails.data.members.length - 3}
                </span>
              </div>
            )}
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Team</DropdownMenuItem>
              <DropdownMenuItem>Team Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <SlidersHorizontal />
          <Select
            value={filters.count}
            onValueChange={(value) => handleFilterChange("count", value)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="10">10</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Member Table */}
      <MemberTable members={filteredMembers} />
    </div>
  );
}
