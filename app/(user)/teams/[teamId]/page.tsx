import { TeamDetails } from "@/components/user/teams/team-details";

export default function TeamDetailsPage({
  params,
}: {
  params: { teamId: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TeamDetails teamId={params.teamId} />
    </div>
  );
}
