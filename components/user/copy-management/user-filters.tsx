"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Search } from "lucide-react";
import type { UserFilters as APIUserFilters } from "@/services/users/users-types";

interface UserFiltersProps {
  filters: APIUserFilters;
  onFilterChange: (filters: Partial<APIUserFilters>) => void;
  totalUsers: number;
}

export function UserFilters({
  filters,
  onFilterChange,
  totalUsers,
}: UserFiltersProps) {
  const handleFilterChange = (
    key: keyof APIUserFilters,
    value: string | number
  ) => {
    onFilterChange({ [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      search: "",
      role: "",
      status: "",
      team_id: "",
      page: 1,
      limit: 20,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full pl-10"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select
            value={filters.limit?.toString()}
            onValueChange={(value) =>
              handleFilterChange("limit", parseInt(value))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={filters.role || "all"}
          onValueChange={(value) =>
            handleFilterChange("role", value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                All Roles
                <Badge variant="secondary" className="text-xs">
                  {totalUsers}
                </Badge>
              </div>
            </SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            handleFilterChange("status", value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          onClick={resetFilters}
          className="text-gray-600 hover:text-gray-900 ml-auto"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
