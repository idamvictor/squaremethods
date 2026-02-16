"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JobAid } from "@/services/job-aid/job-aid-types";

interface JobAidsTableProps {
  jobAids: JobAid[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function JobAidsTable({ jobAids, onDelete, onEdit }: JobAidsTableProps) {
  if (jobAids.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No job aids found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium text-gray-700 py-4">
              JOB AID
            </TableHead>
            <TableHead className="font-medium text-gray-700">TITLE</TableHead>
            <TableHead className="font-medium text-gray-700">STATUS</TableHead>
            <TableHead className="font-medium text-gray-700">VIEWS</TableHead>
            <TableHead className="font-medium text-gray-700">CREATED</TableHead>
            <TableHead className="font-medium text-gray-700 w-16">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobAids.map((jobAid) => (
            <TableRow key={jobAid.id} className="hover:bg-gray-50">
              <TableCell className="py-4">
                <Link href={`/job-aids/${jobAid.id}`} className="block">
                  <div className="w-24 h-16 relative rounded overflow-hidden">
                    <Image
                      src={
                        jobAid.image || "/placeholder.svg?height=64&width=96"
                      }
                      alt={jobAid.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              </TableCell>
              <TableCell className="max-w-sm">
                <Link
                  href={`/job-aids/${jobAid.id}`}
                  className="block hover:text-blue-600"
                >
                  <div className="font-medium text-gray-900">
                    {jobAid.title}
                  </div>
                  <div className="text-gray-500 text-sm line-clamp-2">
                    {jobAid.instruction}
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <span className="text-gray-600">{jobAid.status}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-600">{jobAid.view_count}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-600">
                  {new Date(jobAid.createdAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(jobAid.id)}>
                      Edit Job Aid
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete?.(jobAid.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
