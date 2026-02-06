"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X, Plus, Copy, Share2 } from "lucide-react";
import { useJobAidDetails } from "@/services/job-aid/job-aid-queries";
import { useJobAidStore } from "@/store/job-aid-store";
import Link from "next/link";
import Image from "next/image";
import ImageAnnotationManager from "@/components/user/job-aids/image-annotation/image-annotation-manager";
import { StepsGridView } from "@/components/user/job-aids/steps-grid-view";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface JobAidDetailsProps {
  jobAidId: string;
}

export function JobAidDetails({ jobAidId }: JobAidDetailsProps) {
  const { data: jobAidResponse, isLoading, error } = useJobAidDetails(jobAidId);
  // const [searchQuery, setSearchQuery] = useState("");
  const [showAnnotating, setShowAnnotating] = useState(false);
  const [viewMode, setViewMode] = useState<"details" | "procedures">("details");
  const [showFullInstructions, setShowFullInstructions] = useState(false);
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const setCurrentJobAid = useJobAidStore((state) => state.setCurrentJobAid);

  const handleCopyUrl = useCallback(() => {
    const url = `${window.location.origin}/job-aids/${jobAidId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("URL copied to clipboard!");
        setIsShareDropdownOpen(false);
      })
      .catch(() => {
        toast.error("Failed to copy URL");
      });
  }, [jobAidId]);

  if (isLoading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  if (error || !jobAidResponse) {
    return (
      <div className="p-6 text-center text-gray-600">
        Failed to load job aid details.
      </div>
    );
  }

  const jobAid = jobAidResponse.data;

  if (!jobAid) {
    return (
      <div className="p-6 text-center text-gray-600">Job aid not found.</div>
    );
  }

  const handleNewProcedureClick = () => {
    setCurrentJobAid(jobAid);
    setShowAnnotating(true);
  };

  // Handle view more for procedures
  const handleViewMoreProcedures = () => {
    setViewMode("procedures");
  };

  if (showAnnotating) {
    return (
      <div className="min-h-screen">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => {
              setShowAnnotating(false);
            }}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Aid Details
          </Button>
          <ImageAnnotationManager />
        </div>
      </div>
    );
  }

  // Show procedures grid view
  if (viewMode === "procedures" && jobAid.procedures) {
    return (
      <StepsGridView
        title="Procedures"
        jobAidTitle={jobAid.title}
        steps={jobAid.procedures}
        type="procedure"
        onBack={() => setViewMode("details")}
        onAddNew={handleNewProcedureClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/job-aids"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Job Aids</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div> */}
            <DropdownMenu
              open={isShareDropdownOpen}
              onOpenChange={setIsShareDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button className="bg-slate-700 hover:bg-slate-800">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="p-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Share this job aid
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/job-aids/${jobAidId}`}
                      readOnly
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyUrl}
                      className="flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/job-aids">
              <Button variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Aid Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Job Aid Details</CardTitle>
                  <Badge
                    variant={
                      jobAid.status === "published" ? "default" : "secondary"
                    }
                    className={
                      jobAid.status === "published"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }
                  >
                    {jobAid.status.charAt(0).toUpperCase() +
                      jobAid.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input value={jobAid.title} readOnly />
                </div>

                {/* Author, Category, Date Created */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <Input
                      value={`${jobAid.creator.first_name} ${jobAid.creator.last_name}`}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Input value={jobAid.category || "Not assigned"} readOnly />
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Instructions</h3>
                  </div>
                  {jobAid.instruction ? (
                    <div className="space-y-2">
                      <div className="text-gray-700 whitespace-pre-wrap break-words">
                        {showFullInstructions
                          ? jobAid.instruction
                          : jobAid.instruction.length > 300
                            ? jobAid.instruction.substring(0, 300) + "..."
                            : jobAid.instruction}
                      </div>
                      {jobAid.instruction.length > 300 && (
                        <button
                          onClick={() =>
                            setShowFullInstructions(!showFullInstructions)
                          }
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {showFullInstructions ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No instructions added yet.</p>
                  )}
                </div>

                {/* Procedures with Precautions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Procedures</h3>
                    {jobAid.procedures && jobAid.procedures.length > 0 && (
                      <button
                        onClick={handleViewMoreProcedures}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View All
                      </button>
                    )}
                  </div>
                  {jobAid.procedures && jobAid.procedures.length > 0 ? (
                    <div className="space-y-4">
                      {jobAid.procedures.slice(0, 3).map((procedure, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 font-medium">
                                {procedure.instruction}
                              </p>
                              {procedure.precautions &&
                                procedure.precautions.length > 0 && (
                                  <div className="mt-3 pl-3 border-l-2 border-amber-400 bg-amber-50 p-3 rounded">
                                    <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1">
                                      <span className="text-amber-600">⚠</span>
                                      Precautions
                                    </p>
                                    <ul className="space-y-1">
                                      {procedure.precautions.map(
                                        (precaution, precIdx) => (
                                          <li
                                            key={precIdx}
                                            className="text-sm text-amber-900"
                                          >
                                            • {precaution.instruction}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {jobAid.procedures.length > 3 && (
                        <p className="text-sm text-gray-500 italic pt-2">
                          ... and {jobAid.procedures.length - 3} more
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No procedures added yet.</p>
                  )}
                </div>

                {/* Add New Button */}
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full h-16 border-dashed bg-transparent"
                    onClick={handleNewProcedureClick}
                  >
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-2" />
                      <span>Add Procedure with Optional Precautions</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Assigned Equipment */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assigned equipment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Equipment Name and Image */}
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Equipment Details
                  </h3>
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 mb-4">
                    {jobAid.image ? (
                      <Image
                        src={jobAid.image}
                        alt={jobAid.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image available
                      </div>
                    )}
                  </div>
                </div>

                {/* Assigned Equipment List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Equipment
                  </label>
                  {jobAid.assignedEquipments &&
                  jobAid.assignedEquipments.length > 0 ? (
                    <ul className="space-y-2">
                      {jobAid.assignedEquipments.map((equipment) => (
                        <li
                          key={equipment.id}
                          className="p-2 border rounded text-gray-700"
                        >
                          {equipment.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No equipment assigned.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
