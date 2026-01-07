"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useJobStore } from "@/store/job-store";
// import { SearchInput } from "@/components/user/jobs/search-input";
// import { JobFilters } from "@/components/user/jobs/job-filters";
import { JobTable } from "@/components/user/jobs/job-table";
import { AddJobModal } from "@/components/user/jobs/add-job-modal";

export default function JobManagementPage() {
  const { openAddModal } = useJobStore();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Job Management</CardTitle>
            <Button onClick={openAddModal} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput />
            </div>
            <JobFilters />
          </div> */}
          <JobTable />
        </CardContent>
      </Card>
      <AddJobModal />
    </div>
  );
}
