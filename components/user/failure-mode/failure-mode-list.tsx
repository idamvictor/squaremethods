"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
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
import { Search, Pencil, Trash2, Eye } from "lucide-react";
import { AddFailureModeModal } from "./add-failure-mode-modal";
import { EditFailureModeModal } from "./edit-failure-mode-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import type { FailureModeData } from "./add-failure-mode-modal";

import { FailureMode } from "@/services/failure-mode/failure-mode-types";
import { useFailureModes } from "@/services/failure-mode/failure-mode-queries";

const getStatusColor = (status: FailureMode["status"]) => {
  switch (status) {
    case "resolved":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "open":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "in_progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

export function FailureModeList() {
  const router = useRouter();
  const pathname = usePathname();
  const isInTechnicianRoute = pathname.includes("technician");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFailureMode, setSelectedFailureMode] =
    useState<FailureMode | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [failureModeToDelete, setFailureModeToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [limit] = useState(10);

  const { data: failureModesResponse, isLoading } = useFailureModes({
    page: currentPage,
    limit,
  });

  const failureModes = failureModesResponse?.data || [];
  const totalPages = failureModesResponse?.pagination?.pages || 1;

  const handleDeleteClick = (mode: FailureMode) => {
    setFailureModeToDelete({ id: mode.id, title: mode.title });
    setIsDeleteModalOpen(true);
  };

  const handleAddFailureMode = (data: FailureModeData) => {
    console.log("Add failure mode:", data);
    setIsAddModalOpen(false);
    // We'll implement the add functionality later
  };

  const handleEdit = (mode: FailureMode) => {
    setSelectedFailureMode(mode);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (mode: FailureMode) => {
    router.push(
      isInTechnicianRoute
        ? `/technician/failure-mode/${mode.id}`
        : `/failure-mode/${mode.id}`,
    );
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
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add new Failure Mode
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_0.5fr] gap-4 border-b border-border bg-muted/50 px-6 py-3 text-sm font-medium text-muted-foreground">
          <div>Failure Mode Title</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Reported By</div>
          <div>Due Date</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-8">
              <div className="flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            </div>
          ) : failureModes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No failure modes found
            </div>
          ) : (
            failureModes.map((mode) => (
              <div
                key={mode.id}
                className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_0.5fr] gap-4 px-6 py-4 text-sm hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 font-medium text-foreground">
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
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className={
                      mode.priority === "high"
                        ? "border-red-500 text-red-500"
                        : mode.priority === "medium"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-blue-500 text-blue-500"
                    }
                  >
                    {(mode.priority || "low").charAt(0).toUpperCase() +
                      (mode.priority || "low").slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={mode.reporter.avatar_url}
                      alt={`${mode.reporter.first_name} ${mode.reporter.last_name}`}
                    />
                    <AvatarFallback>
                      {mode.reporter.first_name[0]}
                      {mode.reporter.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-foreground">
                    {`${mode.reporter.first_name} ${mode.reporter.last_name}`}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  {mode.due_date
                    ? format(new Date(mode.due_date), "MMM dd")
                    : "No due date"}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleViewDetails(mode)}
                  >
                    <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(mode)}
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeleteClick(mode)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <Pagination>
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1,
                )
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
            </PaginationContent>
          </Pagination>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>

      <AddFailureModeModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddFailureMode}
      />

      {selectedFailureMode && (
        <EditFailureModeModal
          failureMode={selectedFailureMode}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      )}

      {failureModeToDelete && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          failureModeId={failureModeToDelete.id}
          failureModeTitle={failureModeToDelete.title}
        />
      )}
    </div>
  );
}
