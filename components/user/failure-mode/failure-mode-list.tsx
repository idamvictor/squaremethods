"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Search, Pencil, Trash2 } from "lucide-react";
import { AddFailureModeModal } from "./add-failure-mode-modal";
import type { FailureModeData } from "./add-failure-mode-modal";

type FailureModeStatus = "pending" | "completed" | "declined";

interface FailureMode {
  id: string;
  title: string;
  status: FailureModeStatus;
  team: string;
  assignedOwner: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  duration: string;
  isNew?: boolean;
}

const mockFailureModes: FailureMode[] = [
  {
    id: "1",
    title: "Inspect pressure gauge",
    status: "pending",
    team: "Operational",
    assignedOwner: {
      name: "Olivia Rhye",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "May 24",
    duration: "2hrs",
    isNew: true,
  },
  {
    id: "2",
    title: "Check oil levels",
    status: "completed",
    team: "Sanitation",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "3",
    title: "Test valve operation",
    status: "pending",
    team: "Maintenance",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "4",
    title: "Inspect pressure gauge",
    status: "completed",
    team: "Maintenance",
    assignedOwner: {
      name: "Lana Steiner",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "5",
    title: "Check oil levels",
    status: "pending",
    team: "Maintenance",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "6",
    title: "Test valve operation",
    status: "pending",
    team: "Automation",
    assignedOwner: {
      name: "Olivia Rhye",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "7",
    title: "Inspect pressure gauge",
    status: "declined",
    team: "Automation",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "8",
    title: "Check oil levels",
    status: "pending",
    team: "Maintenance",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
];

const getStatusColor = (status: FailureModeStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "pending":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    case "declined":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }
};

export function FailureModeList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [failureModes, setFailureModes] =
    useState<FailureMode[]>(mockFailureModes);

  const totalPages = 10;

  const handleDelete = (id: string) => {
    setFailureModes(failureModes.filter((mode) => mode.id !== id));
  };

  const handleAddFailureMode = (data: FailureModeData) => {
    const newFailureMode: FailureMode = {
      id: String(failureModes.length + 1),
      title: data.title,
      status: "pending",
      team: data.team,
      assignedOwner: {
        name: data.assignedOwner,
        avatar: "/placeholder.svg?height=32&width=32",
      },
      dueDate: data.dueDate,
      duration: data.duration,
      isNew: true,
    };
    setFailureModes([newFailureMode, ...failureModes]);
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground">
          Failure Modes
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9"
            />
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1e293b] hover:bg-[#334155]"
          >
            Add new Failure Mode
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        {/* Pagination Top */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            Previous
          </Button>
          <Pagination>
            <PaginationContent>
              {[1, 2, 3].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              {[8, 9, 10].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
          >
            Next
          </Button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_1fr_0.5fr] gap-4 border-b border-border bg-muted/50 px-6 py-3 text-sm font-medium text-muted-foreground">
          <div>Failure Mode Title</div>
          <div>Status</div>
          <div>Team</div>
          <div>Assigned owner</div>
          <div>Due Date</div>
          <div>Duration (Hrs)</div>
          <div>Edit</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {failureModes.map((mode) => (
            <div
              key={mode.id}
              className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_1fr_0.5fr] gap-4 px-6 py-4 text-sm hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2 font-medium text-foreground">
                {mode.isNew && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    NEW
                  </Badge>
                )}
                {mode.title}
              </div>
              <div className="flex items-center">
                <Badge
                  variant="secondary"
                  className={getStatusColor(mode.status)}
                >
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  {mode.status.charAt(0).toUpperCase() + mode.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center text-muted-foreground">
                {mode.team}
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={mode.assignedOwner.avatar || "/placeholder.svg"}
                    alt={mode.assignedOwner.name}
                  />
                  <AvatarFallback>
                    {mode.assignedOwner.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground">
                  {mode.assignedOwner.name}
                </span>
              </div>
              <div className="flex items-center text-muted-foreground">
                {mode.dueDate}
              </div>
              <div className="flex items-center text-muted-foreground">
                {mode.duration}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDelete(mode.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Bottom */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            Previous
          </Button>
          <Pagination>
            <PaginationContent>
              {[1, 2, 3].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              {[8, 9, 10].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
          >
            Next
          </Button>
        </div>
      </div>

      <AddFailureModeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddFailureMode}
      />
    </div>
  );
}
