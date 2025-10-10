"use client";

import { JobAidCard } from "./job-aid-card";
import { JobAidsTable } from "./job-aid-table";
import { useJobAids } from "@/services/job-aid/job-aid-queries";
import { useState } from "react";

interface JobAidGridProps {
  viewMode: "grid" | "list";
  searchQuery?: string;
  equipmentId?: string;
  status?: "draft" | "published";
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function JobAidGrid({
  viewMode,
  searchQuery,
  equipmentId,
  status,
  onDelete,
  onEdit,
}: JobAidGridProps) {
  const [page] = useState(1);
  const { data, isLoading, isError } = useJobAids({
    page,
    limit: 20,
    status,
    equipment_id: equipmentId,
    search: searchQuery,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading job aids...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading job aids.</p>
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No job aids found matching your criteria.
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <JobAidsTable jobAids={data.data} onDelete={onDelete} onEdit={onEdit} />
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data.data.map((jobAid) => (
        <JobAidCard
          key={jobAid.id}
          jobAid={jobAid}
          viewMode={viewMode}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
