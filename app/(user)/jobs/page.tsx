"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useJobStore } from "@/store/job-store";
import { JobTable } from "@/components/user/jobs/job-table";
import { AddJobModal } from "@/components/user/jobs/add-job-modal";
import { OverdueJobs } from "@/components/user/jobs/overdue-jobs";

export default function JobManagementPage() {
  const { openAddModal } = useJobStore();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Main Jobs Table */}
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
          <JobTable />
          <OverdueJobs />
        </CardContent>
      </Card>
      <AddJobModal />
    </div>
  );
}
