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
import { Filter } from "lucide-react";
import { User } from "./user-management";

interface UserFiltersProps {
  users: User[];
  onFilterChange: (filteredUsers: User[]) => void;
}

export function UserFilters({ users, onFilterChange }: UserFiltersProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    applyFilters(value, sortBy);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFilters(selectedFilter, value);
  };

  const applyFilters = (filter: string, sort: string) => {
    let filtered = [...users];

    // Apply filters
    if (filter !== "all") {
      filtered = filtered.filter(
        (user) =>
          user.role.toLowerCase().includes(filter.toLowerCase()) ||
          user.team.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Apply sorting
    if (sort === "recent") {
      // Sort by most recent (in this case, all dates are the same)
      filtered.sort(
        (a, b) =>
          new Date(b.dateEntered).getTime() - new Date(a.dateEntered).getTime()
      );
    } else if (sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    onFilterChange(filtered);
  };

  const resetFilters = () => {
    setSelectedFilter("all");
    setSortBy("recent");
    onFilterChange(users);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  All{" "}
                  <Badge variant="secondary" className="text-xs">
                    {users.length}
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent Added</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="role">Role</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        onClick={resetFilters}
        className="text-gray-600 hover:text-gray-900"
      >
        Reset Filter
      </Button>
    </div>
  );
}
