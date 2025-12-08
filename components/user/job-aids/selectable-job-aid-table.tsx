"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useJobAids } from "@/services/job-aid/job-aid-queries";
import { useState } from "react";

interface SelectableJobAidTableProps {
  onSelectionChange: (selectedIds: string[]) => void;
  selectedIds: string[];
}

export function SelectableJobAidTable({
  onSelectionChange,
  selectedIds,
}: SelectableJobAidTableProps) {
  const [page] = useState(1);
  const { data, isLoading } = useJobAids({
    page,
    limit: 20,
  });

  const handleToggleSelect = (jobAidId: string) => {
    const newSelection = selectedIds.includes(jobAidId)
      ? selectedIds.filter((id) => id !== jobAidId)
      : [...selectedIds, jobAidId];
    onSelectionChange(newSelection);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading job aids...</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12"></TableHead>
            <TableHead className="font-medium text-gray-700 py-4 w-24">
              JOB AID
            </TableHead>
            <TableHead className="font-medium text-gray-700">TITLE</TableHead>
            <TableHead className="font-medium text-gray-700">STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((jobAid) => (
            <TableRow
              key={jobAid.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleToggleSelect(jobAid.id)}
            >
              <TableCell className="py-4">
                <Checkbox
                  checked={selectedIds.includes(jobAid.id)}
                  onCheckedChange={() => handleToggleSelect(jobAid.id)}
                />
              </TableCell>
              <TableCell>
                <div className="w-24 h-16 relative rounded overflow-hidden">
                  <Image
                    src={jobAid.image || "/placeholder.svg?height=64&width=96"}
                    alt={jobAid.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-gray-900">{jobAid.title}</div>
                <div className="text-gray-500 text-sm">
                  {jobAid.instruction}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-gray-600">{jobAid.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
