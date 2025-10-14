"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreHorizontal, Plus, Users } from "lucide-react";
import { Team, TeamMember } from "@/services/teams/teams-types";
import { useTeamDetails } from "@/services/teams/teams";
import Link from "next/link";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const { data: teamDetails } = useTeamDetails(team.id);
  return (
    <Link href={`/teams/${team.id}`} className="block">
      <Card className="relative group hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{team.name}</h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Team</DropdownMenuItem>
                  <DropdownMenuItem>View Members</DropdownMenuItem>
                  <DropdownMenuItem>Team Settings</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Delete Team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Avatar Group */}
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {(teamDetails?.data.members ?? [])
                .slice(0, 4)
                .map((member: TeamMember) => {
                  const avatarUrl =
                    member.user?.avatar_url ??
                    member.avatar_url ??
                    "/placeholder.svg";
                  const firstName =
                    member.user?.first_name ?? member.first_name ?? "";
                  const lastName =
                    member.user?.last_name ?? member.last_name ?? "";
                  return (
                    <Avatar
                      key={member.id}
                      className="w-8 h-8 border-2 border-white"
                    >
                      <AvatarImage
                        src={avatarUrl}
                        alt={`${firstName} ${lastName}`}
                      />
                      <AvatarFallback className="text-xs">
                        {firstName?.[0] ?? ""}
                        {lastName?.[0] ?? ""}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}
              {(teamDetails?.data.members?.length ?? 0) > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    +{(teamDetails?.data.members?.length ?? 0) - 4}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Users className="w-3 h-3" />
              <span>{teamDetails?.data.members.length ?? 0}</span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(team.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
