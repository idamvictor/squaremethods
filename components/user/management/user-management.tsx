"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { UserTable } from "./user-table"
import { Filter, Plus } from 'lucide-react'
import { useUserStore } from "@/store/user-store"

export function UserManagement() {
  const { users, filters, setFilter, resetFilters } = useUserStore()

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilter(key, value)
  }

  const handleResetFilters = () => {
    resetFilters()
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">User List</h1>
        <Button className="bg-slate-700 hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
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

          <div className="flex items-center gap-2">
            <Badge
              variant={filters.category === "recent" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => handleFilterChange("category", "recent")}
            >
              Recent Added
            </Badge>
          </div>
        </div>

        <Button variant="ghost" className="text-gray-500 hover:text-gray-700" onClick={handleResetFilters}>
          Reset Filter
        </Button>
      </div>

      {/* User Table */}
      <UserTable users={users} />
    </div>
  )
}
