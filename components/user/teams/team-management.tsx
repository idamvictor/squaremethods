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
import { Badge } from "@/components/ui/badge";
import { TeamCard } from "./team-card";
import { Filter, Plus } from "lucide-react";
import { useTeams } from "@/services/teams/teams";
import { NewTeamDialog } from "./new-team-dialog";

interface TeamFilters {
  count: string;
  category: string;
}

export function TeamManagement() {
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);

  const [filters, setFilters] = useState<TeamFilters>({
    count: "50",
    category: "all",
  });

  const { data: teamsData, isLoading } = useTeams({
    limit: parseInt(filters.count === "all" ? "50" : filters.count),
    page: 1,
  });

  const handleFilterChange = (key: keyof TeamFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      count: "50",
      category: "all",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Team</h1>
        <Button onClick={() => setIsNewTeamDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Team
        </Button>
      </div>

      {/* New Team Dialog */}
      <NewTeamDialog
        open={isNewTeamDialogOpen}
        onOpenChange={setIsNewTeamDialogOpen}
      />

      {/* Filters */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
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

          <div className="flex items-center gap-2">
            <Badge
              variant={
                filters.category === "equipment" ? "default" : "secondary"
              }
              className="cursor-pointer"
              onClick={() => handleFilterChange("category", "equipment")}
            >
              Equipment
            </Badge>
            <Badge
              variant={filters.category === "recent" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => handleFilterChange("category", "recent")}
            >
              Recent
            </Badge>
          </div>
        </div>

        <Button
          variant="ghost"
          className="text-gray-500 hover:text-gray-700"
          onClick={resetFilters}
        >
          Reset Filter
        </Button>
      </div>

      {/* Team Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-48 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamsData?.data.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
