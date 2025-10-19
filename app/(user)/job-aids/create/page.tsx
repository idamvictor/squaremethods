import ImageAnnotationManager from "@/components/user/job-aids/image-annotation/image-annotation-manager";
import { JobAidForm } from "@/components/user/job-aids/job-aid-form";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <JobAidForm />
      <ImageAnnotationManager />
    </div>
  );
}
