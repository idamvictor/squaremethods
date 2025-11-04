"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TrendingUp } from "lucide-react";
import { MetricCard } from "./metric-card";
import { SOPChart } from "./sop-chart";
import { ExportSection } from "./export-section";
import { AlertBanner } from "./alert-banner";
import { useDashboardStore } from "@/store/dashboard-store";
import { useEffect } from "react";

// Chart data now comes from the dashboard store

export default function Dashboard() {
  const {
    totalSOPs,
    sopChartData,
    totalEquipment,
    equipmentChartData,
    isLoading,
    fetchTotalSOPs,
    fetchTotalEquipment,
  } = useDashboardStore();

  useEffect(() => {
    fetchTotalSOPs();
    fetchTotalEquipment();
  }, [fetchTotalSOPs, fetchTotalEquipment]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AlertBanner />

      <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Hello, Squaremethods
          </h1>

          {/* Date Selectors */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Select defaultValue="may-7-13">
              <SelectTrigger className="w-full sm:w-[180px] bg-white">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="may-7-13">May 7 - 13</SelectItem>
                <SelectItem value="may-14-20">May 14 - 20</SelectItem>
                <SelectItem value="may-21-27">May 21 - 27</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="this-year">
              <SelectTrigger className="w-full sm:w-[140px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metrics Grid - Mobile: 2x3, Desktop: 1x5 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
          <MetricCard
            title="Total SOP Created"
            value={isLoading ? "..." : totalSOPs.toString()}
            icon={TrendingUp}
          />
          <MetricCard
            title="Total Equipment Registered"
            value={isLoading ? "..." : totalEquipment.toString()}
          />
          <MetricCard title="Total Tasks" value="120" />
          <MetricCard title="Completed Tasks" value="96" />
          <div className="col-span-2 sm:col-span-1">
            <MetricCard title="Pending Task" value="24" />
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
                    Total SOP Created
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
                    {isLoading ? "..." : totalSOPs}
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
                    {isLoading ? "..." : totalEquipment}
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
                  <span className="text-3xl sm:text-4xl font-bold">120</span>
                  <span className="text-sm text-green-600 font-medium">
                    ↗ 8.2% from last period
                  </span>
                </div>
                <SOPChart data={[]} title="Tasks created" />
              </TabsContent>

              <TabsContent
                value="completed-task"
                className="space-y-4 sm:space-y-6"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl sm:text-4xl font-bold">96</span>
                  <span className="text-sm text-green-600 font-medium">
                    ↗ 12.3% from last period
                  </span>
                </div>
                <SOPChart data={[]} title="Tasks completed" />
              </TabsContent>

              <TabsContent
                value="pending-task"
                className="space-y-4 sm:space-y-6"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl sm:text-4xl font-bold">24</span>
                  <span className="text-sm text-red-600 font-medium">
                    ↗ 5.1% from last period
                  </span>
                </div>
                <SOPChart data={[]} title="Tasks pending" />
              </TabsContent>
            </Tabs>

            <ExportSection />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
