"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TaskList } from "./task-list";
import { TaskPagination } from "./task-pagination";
import { Filter, Plus, Search } from "lucide-react";
import { useTaskStore } from "@/store/task-store";

export function TaskManagement() {
  const { filters, searchQuery, setFilter, resetFilters, setSearchQuery } =
    useTaskStore();

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilter(key, value);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button className="">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-3">
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
          onClick={handleResetFilters}
        >
          Reset Filter
        </Button>
      </div>

      {/* Top Pagination */}
      <TaskPagination />

      {/* Task List */}
      <TaskList />

      {/* Bottom Pagination */}
      <TaskPagination />
    </div>
  );
}
