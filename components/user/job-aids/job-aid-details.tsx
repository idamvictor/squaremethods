"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, X, Plus } from "lucide-react";
import { useJobAidDetails } from "@/services/job-aid/job-aid-queries";
import Link from "next/link";
import Image from "next/image";

interface JobAidDetailsProps {
  jobAidId: string;
}

export function JobAidDetails({ jobAidId }: JobAidDetailsProps) {
  const { data: jobAidResponse, isLoading, error } = useJobAidDetails(jobAidId);
  const [searchQuery, setSearchQuery] = useState("");

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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button className="bg-slate-700 hover:bg-slate-800">Share</Button>
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
                <CardTitle>Job Aid Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input value={jobAid.title} readOnly />
                </div>

                {/* Author, Difficulty, Date Created */}
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
                      Difficulty Level
                    </label>
                    <Input value={jobAid.difficulty_level} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Created
                    </label>
                    <Input
                      value={new Date(jobAid.created_at).toLocaleDateString()}
                      readOnly
                    />
                  </div>
                </div>

                {/* Safety Notes */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">Safety Notes</h3>
                      <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    </div>
                  </div>
                  {jobAid.safety_notes ? (
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {jobAid.safety_notes}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No safety notes added. Protect your team by adding
                      essential precautions.
                    </p>
                  )}
                </div>

                {/* Instructions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Instructions</h3>
                  </div>
                  {jobAid.instructions ? (
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {jobAid.instructions}
                    </div>
                  ) : (
                    <p className="text-gray-500">No instructions added yet.</p>
                  )}
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Content</h3>
                  </div>
                  {jobAid.content ? (
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {jobAid.content}
                    </div>
                  ) : (
                    <p className="text-gray-500">No content added yet.</p>
                  )}
                </div>

                {/* Add New Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Button
                    variant="outline"
                    className="h-20 border-dashed bg-transparent"
                  >
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-2" />
                      <span>New Instruction</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 border-dashed bg-transparent"
                  >
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-2" />
                      <span>New Steps</span>
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
                    {jobAid.image_url ? (
                      <Image
                        src={jobAid.image_url}
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

                {/* Equipment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equipment type
                  </label>
                  <Input
                    value={jobAid.equipment_type_id || "Not assigned"}
                    readOnly
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location ID
                  </label>
                  <Input
                    value={jobAid.location_id || "Not assigned"}
                    readOnly
                  />
                </div>

                {/* View Equipment Button */}
                <Button variant="outline" className="w-full bg-transparent">
                  View equipment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
