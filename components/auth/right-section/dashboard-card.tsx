"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ArrowUpIcon, ArrowDownIcon, CalendarIcon } from "lucide-react";

const data = [
  { name: "May 25", value: 40 },
  { name: "May 26", value: 30 },
  { name: "May 27", value: 45 },
  { name: "May 28", value: 25 },
  { name: "May 29", value: 60 },
  { name: "May 30", value: 45 },
];

export default function DashboardCard() {
  return (
    <Card className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
        <div className="col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Report Summary</h2>
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>May 25-May 30 2023</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-bold">1.44</span>
                <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  +12.40%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Average Completion</p>
            </div>

            <div>
              <div className="flex items-center">
                <span className="text-2xl font-bold">25,296</span>
                <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  +8.05%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Total Procedures</p>
            </div>

            <div>
              <div className="flex items-center">
                <span className="text-2xl font-bold">16,043</span>
                <span className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full flex items-center">
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                  -0.56%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Total Checks</p>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis hide={true} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-white p-4 rounded-lg h-full">
            <h3 className="text-sm text-center mb-2">Operational Adherence</h3>
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset="56.6"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">80%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <p className="font-bold">1254</p>
              </div>
              <div>
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                  <span className="text-xs">Performance</span>
                </div>
                <p className="font-bold">1145</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
