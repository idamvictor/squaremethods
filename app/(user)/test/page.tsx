"use client";

import React from "react";
import { useTeams } from "@/services/teams/teams";

export default function TestPage() {
  const { data: teamsData, isLoading } = useTeams();

  console.log("Teams data:", teamsData);
  console.log("Loading state:", isLoading);

  return (
    <div>
      <h1>Teams Test Page</h1>
      {isLoading ? (
        <p>Loading teams...</p>
      ) : (
        <pre>{JSON.stringify(teamsData, null, 2)}</pre>
      )}
    </div>
  );
}
