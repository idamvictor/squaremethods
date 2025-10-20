"use client";

import { JobAidsManagement } from "@/components/user/job-aids/job-aids-management";
import AddJobAidForm from "@/components/user/job-aids/add-job-aid-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function JobAidsPage() {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <div className="min-h-screen">
        <div className="p-6">
          <Button
            variant="ghost"
            className=""
            onClick={() => setIsCreating(false)}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Aids
          </Button>
          <AddJobAidForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JobAidsManagement onCreateClick={() => setIsCreating(true)} />
    </div>
  );
}
