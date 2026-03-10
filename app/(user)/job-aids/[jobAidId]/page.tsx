import { JobAidDetails } from "@/components/user/job-aids/job-aid-details";

export default async function JobAidDetailsPage({
  params,
}: {
  params: Promise<{ jobAidId: string }>;
}) {
  const { jobAidId } = await params;
  return (
    <div className=" ">
      <JobAidDetails jobAidId={jobAidId} />
    </div>
  );
}
