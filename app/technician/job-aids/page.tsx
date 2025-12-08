import { JobAidsManagement } from "@/components/user/job-aids/job-aids-management";

export default function JobAidsPage() {
  const handleCreateClick = () => {
    // TODO: Implement create job aid functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <JobAidsManagement onCreateClick={handleCreateClick} />
    </div>
  );
}
