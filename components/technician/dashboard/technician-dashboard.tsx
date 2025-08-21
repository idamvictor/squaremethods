"use client";

import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { MetricCard } from "./metric-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { avatarImage } from "@/constants/images";

interface Task {
  id: number;
  job: string;
  status: "Pending" | "Completed" | "NEW";
  assignedBy: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  duration: string;
}

const ITEMS_PER_PAGE = 7;

// Generate mock data
const mockTasks: Task[] = Array.from({ length: 55 }, (_, index) => ({
  id: index + 1,
  job: `${
    ["Inspect pressure gauge", "Check oil levels", "Test valve operation"][
      index % 3
    ]
  }`,
  status: index === 0 ? "NEW" : index % 3 === 0 ? "Completed" : "Pending",
  assignedBy: [
    { name: "Olivia Rhye", avatar: avatarImage.image1 },
    { name: "Phoenix Baker", avatar: avatarImage.image2 },
    { name: "Lana Steiner", avatar: avatarImage.image3 },
  ][index % 3],
  dueDate: "May 24",
  duration: "2hrs",
}));

const metrics = [
  { title: "Total Task", value: "55" },
  { title: "Task Completed", value: "41" },
  { title: "Pending Tasks", value: "14" },
  { title: "Job Aid Created", value: "3" },
];

export default function TechnicianDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(mockTasks.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTasks = mockTasks.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Hello, Squaremethods</h1>
        <Button variant="outline" className="gap-2">
          <QrCode className="h-4 w-4" />
          Click to scan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
          />
        ))}
      </div>

      <div className="rounded-lg border bg-card text-card-foreground">
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b bg-slate-50">
                <TableHead className="w-[300px] text-slate-500 font-medium">
                  Jobs
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Assigned by
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Due Date
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Duration (hrs)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-slate-50">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      {task.status === "NEW" && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                          NEW
                        </span>
                      )}
                      <span className="font-medium text-slate-900">
                        {task.job}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          task.status === "Completed"
                            ? "bg-green-500"
                            : task.status === "Pending"
                            ? "bg-slate-300"
                            : ""
                        }`}
                      />
                      <span className="text-slate-600">
                        {task.status !== "NEW" && task.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignedBy.avatar} />
                        <AvatarFallback className="bg-slate-100 text-slate-500">
                          {task.assignedBy.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-slate-600">
                        {task.assignedBy.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-slate-600">
                    {task.dueDate}
                  </TableCell>
                  <TableCell className="py-3 text-slate-600">
                    {task.duration}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="py-4 px-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  const isActive = currentPage === page;

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={isActive}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
