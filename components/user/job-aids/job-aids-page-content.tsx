"use client";

import { JobAidsManagement } from "@/components/user/job-aids/job-aids-management";
import AddJobAidForm from "@/components/user/job-aids/add-job-aid-form";
import ImageAnnotationManager from "@/components/user/job-aids/image-annotation/image-annotation-manager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function JobAidsPageContent() {
  const [isCreating, setIsCreating] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotationType, setAnnotationType] = useState<
    "precaution" | "procedure" | null
  >(null);

  if (isAnnotating) {
    return (
      <div className="min-h-screen">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => {
              setIsAnnotating(false);
              setAnnotationType(null);
            }}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Aid Form
          </Button>
          <ImageAnnotationManager type={annotationType || "procedure"} />
        </div>
      </div>
    );
  }

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
