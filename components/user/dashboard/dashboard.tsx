"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";
import { MetricCard } from "./metric-card";
import { SOPChart } from "./sop-chart";
import { ExportSection } from "./export-section";
// import { AlertBanner } from "./alert-banner";
import { useDashboard } from "@/services/users/users-querries";
import { useMemo } from "react";

export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  const dashboardData = data?.data;
  const stats = dashboardData?.stats;
  const graphData = dashboardData?.graphData;

  // Convert graph data to chart format
  const sopChartData = useMemo(() => {
    return (graphData?.sop_created || []).map((item) => ({
      date: item.date,
      value: item.count,
    }));
  }, [graphData?.sop_created]);

  const equipmentChartData = useMemo(() => {
    return (graphData?.equipment_registered || []).map((item) => ({
      date: item.date,
      value: item.count,
    }));
  }, [graphData?.equipment_registered]);

  const totalTaskChartData = useMemo(() => {
    return (graphData?.total_task || []).map((item) => ({
      date: item.date,
      value: item.count,
    }));
  }, [graphData?.total_task]);

  const completedTaskChartData = useMemo(() => {
    return (graphData?.completed_task || []).map((item) => ({
      date: item.date,
      value: item.count,
    }));
  }, [graphData?.completed_task]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <AlertBanner /> */}

      <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Hello, Squaremethods
          </h1>
        </div>

        {/* Metrics Grid - Mobile: 2x3, Desktop: 1x5 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
          <MetricCard
            title="Job Aid Created"
            value={isLoading ? "..." : (stats?.job_aid_created ?? 0).toString()}
            icon={TrendingUp}
          />
          <MetricCard
            title="Total Equipment"
            value={isLoading ? "..." : (stats?.total_equipment ?? 0).toString()}
          />
          <MetricCard
            title="Total Tasks"
            value={isLoading ? "..." : (stats?.total_tasks ?? 0).toString()}
          />
          <MetricCard
            title="Completed Tasks"
            value={isLoading ? "..." : (stats?.completed_tasks ?? 0).toString()}
          />
          <div className="col-span-2 sm:col-span-1">
            <MetricCard
              title="Pending Task"
              value={isLoading ? "..." : (stats?.pending_tasks ?? 0).toString()}
            />
          </div>
        </div>

        {/* Chart Section */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="total-sop" className="space-y-4 sm:space-y-6">
              <div className="overflow-x-auto">
                <TabsList className="inline-flex h-auto p-1 bg-gray-100 min-w-full sm:min-w-0">
                  <TabsTrigger
                    value="total-sop"
                    className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
                  >
                    Total job Aid Created
                  </TabsTrigger>
                  <TabsTrigger
                    value="total-equipment"
                    className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
                  >
                    Total Equipment Registered
                  </TabsTrigger>
                  <TabsTrigger
                    value="total-task"
                    className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
                  >
                    Total Task
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed-task"
                    className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
                  >
                    Completed Task
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="total-sop" className="space-y-4 sm:space-y-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl sm:text-4xl font-bold">
                    {isLoading ? "..." : (stats?.job_aid_created ?? 0)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    ↗ 10.5% from last period
                  </span>
                </div>
                <SOPChart data={sopChartData} title="SOP created" />
              </TabsContent>

              <TabsContent
                value="total-equipment"
                className="space-y-4 sm:space-y-6"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl sm:text-4xl font-bold">
                    {isLoading ? "..." : (stats?.total_equipment ?? 0)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    ↗ 8.2% from last period
                  </span>
                </div>
                <SOPChart
                  data={equipmentChartData}
                  title="Equipment registered"
                />
              </TabsContent>

              <TabsContent
                value="total-task"
                className="space-y-4 sm:space-y-6"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl sm:text-4xl font-bold">
                    {isLoading ? "..." : (stats?.total_tasks ?? 0)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    ↗ 8.2% from last period
                  </span>
                </div>
                <SOPChart data={totalTaskChartData} title="Tasks created" />
              </TabsContent>

              <TabsContent
                value="completed-task"
                className="space-y-4 sm:space-y-6"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl sm:text-4xl font-bold">
                    {isLoading ? "..." : (stats?.completed_tasks ?? 0)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    ↗ 12.3% from last period
                  </span>
                </div>
                <SOPChart
                  data={completedTaskChartData}
                  title="Tasks completed"
                />
              </TabsContent>
            </Tabs>

            <ExportSection />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
