"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JobStatus, JobPriority, Job } from "@/services/jobs/jobs-types";
// import { useTeams } from "@/services/teams/teams";
import { useUsers } from "@/services/users/users-querries";

interface JobFiltersProps {
  statusFilter: JobStatus | "all";
  onStatusChange: (status: JobStatus | "all") => void;
  priorityFilter: JobPriority | "all";
  onPriorityChange: (priority: JobPriority | "all") => void;
  teamFilter: string | "all";
  onTeamChange: (teamId: string | "all") => void;
  assignedFilter: string | "all";
  onAssignedChange: (userId: string | "all") => void;
  equipmentFilter: string | "all";
  onEquipmentChange: (equipmentId: string | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReset: () => void;
  jobs: Job[];
}

export function JobFilters({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  // teamFilter,
  // onTeamChange,
  assignedFilter,
  onAssignedChange,
  equipmentFilter,
  onEquipmentChange,
  searchQuery,
  onSearchChange,
  onReset,
  jobs,
}: JobFiltersProps) {
  // const { data: teamsData } = useTeams();
  const { data: usersData } = useUsers({ page: 1, limit: 1000 });

  // Get unique equipment from jobs
  const uniqueEquipment = Array.from(
    new Map(
      jobs
        .filter((job) => job.equipment)
        .map((job) => [job.equipment!.id, job.equipment!]),
    ).values(),
  );

  const handleExportToExcel = () => {
    if (!jobs || jobs.length === 0) {
      alert("No data to export");
      return;
    }

    // Prepare data for Excel
    const csvContent = [
      ["Title", "Status", "Priority", "Equipment", "Assigned To", "Due Date"],
      ...jobs.map((job) => [
        job.title,
        job.status,
        job.priority,
        job.equipment?.name || "N/A",
        `${job.assignedUser.first_name} ${job.assignedUser.last_name}`,
        new Date(job.due_date).toLocaleDateString(),
      ]),
    ];

    // Create CSV string
    const csvString = csvContent
      .map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma
            const cellStr = String(cell);
            return cellStr.includes(",") || cellStr.includes('"')
              ? `"${cellStr.replace(/"/g, '""')}"`
              : cellStr;
          })
          .join(","),
      )
      .join("\n");

    // Create blob and download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `jobs-export-${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
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

          {/* <Select value={teamFilter} onValueChange={onTeamChange}>
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
          </Select> */}

          <Select value={assignedFilter} onValueChange={onAssignedChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by assigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {usersData?.data?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={equipmentFilter} onValueChange={onEquipmentChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              {uniqueEquipment.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>

          <Button
            variant="outline"
            onClick={handleExportToExcel}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
