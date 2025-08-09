import { TeamDetails } from "@/components/user/teams/team-details";
import { mockTeams } from "@/lib/mock-data";

interface TeamDetailsPageProps {
  params: {
    teamId: string;
  };
}

export default function TeamDetailsPage({ params }: TeamDetailsPageProps) {
  const team = mockTeams.find((t) => t.id === params.teamId);

  if (!team) {
    return <div className="p-6 text-center text-gray-600">Team not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamDetails team={team} />
    </div>
  );
}
