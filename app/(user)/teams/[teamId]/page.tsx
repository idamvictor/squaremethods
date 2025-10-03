import { TeamDetails } from "@/components/user/teams/team-details";

export default async function TeamDetailsPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamDetails teamId={teamId} />
    </div>
  );
}
