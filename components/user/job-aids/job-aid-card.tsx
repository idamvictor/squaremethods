"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { JobAid } from "@/services/job-aid/job-aid-types";
import Link from "next/link";
import Image from "next/image";
// import { formatDate } from "@/lib/utils";

interface JobAidCardProps {
  jobAid: JobAid;
  viewMode: "grid" | "list";
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function JobAidCard({
  jobAid,
  viewMode,
  onDelete,
  onEdit,
}: JobAidCardProps) {
  return (
    <Link href={`/job-aids/${jobAid.id}`} className="block">
      <Card className="relative group hover:shadow-md transition-shadow overflow-hidden py-0">
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  onEdit?.(jobAid.id);
                }}
              >
                Edit Job Aid
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete?.(jobAid.id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {viewMode === "grid" ? (
          <>
            <div className="aspect-video relative">
              <Image
                src={jobAid.image_url || "/placeholder.svg"}
                alt={jobAid.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <CardContent className="absolute inset-0 flex flex-col justify-end p-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-white text-lg">
                    {jobAid.title}
                  </h3>
                  <p className="text-white/90 text-sm">{jobAid.description}</p>
                </div>
              </CardContent>
            </div>
          </>
        ) : (
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={jobAid.image_url || "/placeholder.svg"}
                  alt={jobAid.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{jobAid.title}</h3>
                <p className="text-gray-600">{jobAid.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  By {jobAid.creator.first_name} {jobAid.creator.last_name} •{" "}
                  {new Date(jobAid.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
