"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { JobAidGrid } from "./job-aid-grid"
import { Filter, Grid3X3, List, Search } from "lucide-react"
import { useJobAidStore } from "@/store/job-aid-store"

export function JobAidsManagement() {
  const { filters, searchQuery, viewMode, setFilter, resetFilters, setSearchQuery, setViewMode } = useJobAidStore()

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilter(key, value)
  }

  const handleResetFilters = () => {
    resetFilters()
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Job Aids</h1>
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
          <Button className="bg-slate-700 hover:bg-slate-800">Create</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filters.count} onValueChange={(value) => handleFilterChange("count", value)}>
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

          <Select value={filters.equipment} onValueChange={(value) => handleFilterChange("equipment", value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              <SelectItem value="hydraulic">Hydraulic</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="mechanical">Mechanical</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Badge
              variant={filters.category === "recent" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => handleFilterChange("category", "recent")}
            >
              Recent
            </Badge>
            <Badge
              variant={filters.category === "most-viewed" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => handleFilterChange("category", "most-viewed")}
            >
              Most viewed
            </Badge>
          </div>
        </div>

        <Button variant="ghost" className="text-gray-500 hover:text-gray-700" onClick={handleResetFilters}>
          Reset Filter
        </Button>
      </div>

      {/* Job Aid Grid */}
      <JobAidGrid />
    </div>
  )
}
