import { JobAidDetails } from "@/components/user/job-aids/job-aid-details";

interface JobAidDetailsPageProps {
  params: {
    jobAidId: string;
  };
}

export default function JobAidDetailsPage({ params }: JobAidDetailsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <JobAidDetails jobAidId={params.jobAidId} />
    </div>
  );
}
