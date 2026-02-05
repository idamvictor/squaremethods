"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { MetricCard } from "./metric-card";
import { JobTable } from "@/components/user/jobs/job-table";
import { CameraScanner } from "./camera-scanner";
import { useDashboard } from "@/services/users/users-querries";

export default function TechnicianDashboard() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { data, isLoading } = useDashboard();

  const dashboardData = data?.data;
  const stats = dashboardData?.stats;

  const metrics = [
    {
      title: "Total Task",
      value: isLoading ? "..." : (stats?.total_tasks?.toString() ?? "0"),
    },
    {
      title: "Task Completed",
      value: isLoading ? "..." : (stats?.completed_tasks?.toString() ?? "0"),
    },
    {
      title: "Pending Tasks",
      value: isLoading ? "..." : (stats?.pending_tasks?.toString() ?? "0"),
    },
    {
      title: "Job Aid Created",
      value: isLoading ? "..." : (stats?.job_aid_created?.toString() ?? "0"),
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Hello, Squaremethods</h1>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsCameraOpen(!isCameraOpen)}
        >
          <QrCode className="h-4 w-4" />
          Click to scan
        </Button>
      </div>

      {isCameraOpen && (
        <CameraScanner open={isCameraOpen} onOpenChange={setIsCameraOpen} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
          />
        ))}
      </div>

      <div className="space-y-4">
        {/* <SearchInput /> */}
        <JobTable />
      </div>
    </div>
  );
}
