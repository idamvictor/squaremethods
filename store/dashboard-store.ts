import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchJobAids } from "@/services/job-aid/job-aid-queries";
import { fetchEquipment } from "@/services/equipment/equipment-queries";
import { JobAid } from "@/services/job-aid/job-aid-types";

interface ChartDataPoint {
  date: string;
  value: number;
}

interface DashboardState {
  totalSOPs: number;
  sopChartData: ChartDataPoint[];
  totalEquipment: number;
  equipmentChartData: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  setTotalSOPs: (count: number) => void;
  setTotalEquipment: (count: number) => void;
  fetchTotalSOPs: () => Promise<void>;
  fetchTotalEquipment: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      totalSOPs: 0,
      sopChartData: [],
      totalEquipment: 0,
      equipmentChartData: [],
      isLoading: false,
      error: null,
      lastUpdated: null,

      setTotalSOPs: (count) => set({ totalSOPs: count }),
      setTotalEquipment: (count) => set({ totalEquipment: count }),

      fetchTotalEquipment: async () => {
        try {
          set({ isLoading: true, error: null });

          // Fetch all equipment
          const response = await fetchEquipment({
            limit: 1000, // Get all equipment
          });

          const totalEquipment = response.data.length; // Count the actual equipment in the data array

          // Generate last 7 days of data for the chart
          const chartData: ChartDataPoint[] = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStr = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            // For now, distribute the total across days with some variation
            const dayValue = Math.max(
              0,
              Math.floor(totalEquipment / 7 + (Math.random() - 0.5) * 3)
            );
            chartData.push({ date: dayStr, value: dayValue });
          }

          set({
            totalEquipment,
            equipmentChartData: chartData,
            lastUpdated: new Date().toISOString(),
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch equipment",
            isLoading: false,
          });
        }
      },

      fetchTotalSOPs: async () => {
        try {
          set({ isLoading: true, error: null });

          // Fetch all job aids
          const response = await fetchJobAids({
            limit: 1000, // Assuming we want to get all job aids
            status: "published", // Only count published SOPs
          });

          // Calculate total SOPs by counting procedures in each job aid
          const totalSOPs = response.data.reduce(
            (total: number, jobAid: JobAid) => {
              return total + (jobAid.procedures?.length || 0);
            },
            0
          );

          // Generate last 7 days of data for the chart
          const chartData: ChartDataPoint[] = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStr = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            // For now, distribute the total across days with some variation
            const dayValue = Math.max(
              0,
              Math.floor(totalSOPs / 7 + (Math.random() - 0.5) * 5)
            );
            chartData.push({ date: dayStr, value: dayValue });
          }

          set({
            totalSOPs,
            sopChartData: chartData,
            lastUpdated: new Date().toISOString(),
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch SOPs",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "dashboard-store",
      // Only persist these fields
      partialize: (state) => ({
        totalSOPs: state.totalSOPs,
        sopChartData: state.sopChartData,
        totalEquipment: state.totalEquipment,
        equipmentChartData: state.equipmentChartData,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
