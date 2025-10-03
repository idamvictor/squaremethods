"use client";

import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  date: string;
  value: number;
}

interface SOPChartProps {
  data: ChartData[];
  title: string;
}

const defaultData = [
  { date: "May 6", value: 23 },
  { date: "May 7", value: 27 },
  { date: "May 8", value: 28 },
  { date: "May 9", value: 30 },
  { date: "May 10", value: 35 },
  { date: "May 11", value: 32 },
  { date: "May 12", value: 28 },
];

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
};

export function SOPChart({ data = defaultData, title }: SOPChartProps) {
  return (
    <div className="w-full h-[250px] sm:h-[300px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              width={30}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(value) => `Thursday ${value}, 2025`}
              formatter={(value) => [
                <div key="tooltip-content">
                  {title}: {value}
                  <br />
                  <span className="text-green-600">+10.5% Previous day</span>
                </div>,
                title,
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorValue)"
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
              activeDot={{
                r: 5,
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
