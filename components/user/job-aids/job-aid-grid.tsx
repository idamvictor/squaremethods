"use client";

import { JobAidCard } from "./job-aid-card";
import { useJobAidStore } from "@/store/job-aid-store";
import { JobAidsTable } from "./job-aid-table";

export function JobAidGrid() {
  const { getFilteredJobAids, viewMode } = useJobAidStore();
  const jobAids = getFilteredJobAids();

  if (jobAids.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No job aids found matching your criteria.
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return <JobAidsTable jobAids={jobAids} />;
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {jobAids.map((jobAid) => (
        <JobAidCard key={jobAid.id} jobAid={jobAid} viewMode={viewMode} />
      ))}
    </div>
  );
}
