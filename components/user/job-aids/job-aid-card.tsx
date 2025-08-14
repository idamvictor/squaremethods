"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import type { JobAid } from "@/types/job-aid"
import Link from "next/link"
import Image from "next/image"

interface JobAidCardProps {
  jobAid: JobAid
  viewMode: "grid" | "list"
}

export function JobAidCard({ jobAid, viewMode }: JobAidCardProps) {
  return (
    <Link href={`/job-aids/${jobAid.id}`} className="block">
      <Card className="relative group hover:shadow-md transition-shadow overflow-hidden">
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Job Aid</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {viewMode === "grid" ? (
          <>
            <div className="aspect-video relative">
              <Image src={jobAid.image || "/placeholder.svg"} alt={jobAid.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium text-white bg-black/70 px-3 py-1 rounded text-sm">{jobAid.title}</h3>
                <p className="font-medium text-white bg-black/70 px-3 py-1 rounded text-sm">{jobAid.subtitle}</p>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={jobAid.image || "/placeholder.svg"}
                  alt={jobAid.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{jobAid.title}</h3>
                <p className="text-gray-600">{jobAid.subtitle}</p>
                <p className="text-sm text-gray-500 mt-1">
                  By {jobAid.author} • {jobAid.dateCreated}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
