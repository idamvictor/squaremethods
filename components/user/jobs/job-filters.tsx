"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JobStatus, JobPriority } from "@/services/jobs/jobs-types";
import { useTeams } from "@/services/teams/teams";

interface JobFiltersProps {
  statusFilter: JobStatus | "all";
  onStatusChange: (status: JobStatus | "all") => void;
  priorityFilter: JobPriority | "all";
  onPriorityChange: (priority: JobPriority | "all") => void;
  teamFilter: string | "all";
  onTeamChange: (teamId: string | "all") => void;
  assignedFilter: string | "all";
  onAssignedChange: (userId: string | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReset: () => void;
}

export function JobFilters({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  teamFilter,
  onTeamChange,
  assignedFilter,
  onAssignedChange,
  searchQuery,
  onSearchChange,
  onReset,
}: JobFiltersProps) {
  const { data: teamsData } = useTeams();
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={teamFilter} onValueChange={onTeamChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teamsData?.data?.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={assignedFilter} onValueChange={onAssignedChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by assigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
