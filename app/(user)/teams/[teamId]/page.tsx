import { TeamDetails } from "@/components/user/teams/team-details";
import { mockTeams } from "@/lib/mock-data";

export default async function TeamDetailsPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const team = mockTeams.find((t) => t.id === teamId);

  if (!team) {
    return <div className="p-6 text-center text-gray-600">Team not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamDetails team={team} />
    </div>
  );
}
