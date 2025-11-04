"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Job } from "@/services/jobs/jobs-types";
import { Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useJobs,
  deleteJob,
  JOBS_QUERY_KEY,
} from "@/services/jobs/jobs-queries";
import {
  useQueryClient,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { JobFilters } from "./job-filters";
import { DeleteDialog } from "./delete-dialog";
import { JobDetailsModal } from "./job-details-modal";

import { JobStatus, DeleteJobResponse } from "@/services/jobs/jobs-types";
import { avatarImage } from "@/constants/images";

export function JobTable() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { data, isLoading } = useJobs({
    page,
    limit: 20,
    search: searchQuery || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const jobs = data?.data || [];
  const pagination = data?.pagination;
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteJobMutation: UseMutationResult<DeleteJobResponse, Error, string> =
    useMutation({
      mutationFn: deleteJob,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [JOBS_QUERY_KEY] });
      },
    });

  if (isLoading || !data) {
    return <div>Loading jobs...</div>;
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status: JobStatus | "all") => {
    setStatusFilter(status);
    setPage(1); // Reset to first page when filtering
  };

  const handleDelete = async (jobId: string) => {
    await deleteJobMutation.mutateAsync(jobId);
    setDeleteJobId(null);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPage(1);
  };

  const getStatusBadge = (status: JobStatus) => {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            status === "pending"
              ? "bg-blue-500"
              : status === "completed"
              ? "bg-green-500"
              : status === "in_progress"
              ? "bg-yellow-500"
              : status === "on_hold"
              ? "bg-orange-500"
              : "bg-red-500"
          }`}
        />
        <span className="capitalize text-sm">{status}</span>
      </div>
    );
  };

  const generatePageNumbers = () => {
    if (!pagination) return [];

    const { pages: totalPages, page: currentPage } = pagination;
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      <JobFilters
        statusFilter={statusFilter}
        onStatusChange={handleStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onReset={resetFilters}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Duration (hrs)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job: Job) => (
              <TableRow
                key={job.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedJobId(job.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{job.title}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(job.status)}</TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {job.team.name}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={avatarImage.image1}
                        alt={`${job.assignedUser.first_name} ${job.assignedUser.last_name}`}
                      />
                    </Avatar>
                    <span className="text-sm">{`${job.assignedUser.first_name} ${job.assignedUser.last_name}`}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(job.due_date).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {job.estimated_duration}
                  </span>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        /* Handle edit */
                      }}
                      className="h-8 w-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => setDeleteJobId(job.id)}
                      className="h-8 w-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.total > pagination.limit && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) {
                    setPage(page - 1);
                  }
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {generatePageNumbers().map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === "..." ? (
                  <span className="px-3 py-2">...</span>
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNum as number);
                    }}
                    isActive={page === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination && page < pagination.pages) {
                    setPage(page + 1);
                  }
                }}
                className={
                  page === pagination?.pages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <DeleteDialog
        isOpen={!!deleteJobId}
        jobId={deleteJobId}
        onClose={() => setDeleteJobId(null)}
        onConfirm={handleDelete}
        isDeleting={deleteJobMutation.isPending}
      />

      <JobDetailsModal
        jobId={selectedJobId}
        isOpen={!!selectedJobId}
        onClose={() => setSelectedJobId(null)}
      />
    </div>
  );
}
