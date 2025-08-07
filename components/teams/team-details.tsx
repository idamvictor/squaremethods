"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MemberTable } from "./member-table"
import { ArrowLeft, Filter, Plus } from 'lucide-react'
import type { Team, TeamFilters } from "@/types/team"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react'

interface TeamDetailsProps {
  team: Team
}

export function TeamDetails({ team }: TeamDetailsProps) {
  const [filters, setFilters] = useState<TeamFilters>({
    count: "50",
    category: "all", // This will be 'declined', 'pending', 'recent' for this page
  })

  const handleFilterChange = (key: keyof TeamFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      count: "50",
      category: "all",
    })
  }

  // Filter members based on the 'category' filter (Declined, Pending, Recent)
  const filteredMembers = team.members.filter((member) => {
    if (filters.category === "all") return true

    const today = new Date()
    const memberDate = new Date(member.dateEntered)
    const daysDifference = Math.floor((today.getTime() - memberDate.getTime()) / (1000 * 60 * 60 * 24))

    switch (filters.category) {
      case "recent":
        // Members who joined in the last 30 days
        return daysDifference <= 30
      case "pending":
        // Members who joined between 31-90 days ago
        return daysDifference > 30 && daysDifference <= 90
      case "declined":
        // Members who joined more than 90 days ago
        return daysDifference > 90
      default:
        return true
    }
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">{team.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {team.members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            ))}
            {team.members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{team.members.length - 3}</span>
              </div>
            )}
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Team</DropdownMenuItem>
              <DropdownMenuItem>Team Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete Team</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
              variant={filters.category === "declined" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => handleFilterChange("category", "declined")}
            >
              Declined
            </Badge>
            <Badge
              variant={filters.category === "pending" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => handleFilterChange("category", "pending")}
            >
              Pending
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

        <Button variant="ghost" className="text-gray-500 hover:text-gray-700" onClick={resetFilters}>
          Reset Filter
        </Button>
      </div>

      {/* Member Table */}
      <MemberTable members={filteredMembers} />
    </div>
  )
}
