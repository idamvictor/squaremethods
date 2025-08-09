"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useJobStore } from "@/store/job-store";

export function JobFilters() {
  const {
    statusFilter,
    teamFilter,
    setStatusFilter,
    setTeamFilter,
    resetFilters,
  } = useJobStore();

  return (
    <div className="flex gap-2">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="declined">Declined</SelectItem>
        </SelectContent>
      </Select>

      <Select value={teamFilter} onValueChange={setTeamFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Team" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Teams</SelectItem>
          <SelectItem value="Operational">Operational</SelectItem>
          <SelectItem value="Sanitation">Sanitation</SelectItem>
          <SelectItem value="Maintenance">Maintenance</SelectItem>
          <SelectItem value="Automation">Automation</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={resetFilters}>
        Reset
      </Button>
    </div>
  );
}
