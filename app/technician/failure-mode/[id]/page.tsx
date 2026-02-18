"use client";

import { useParams } from "next/navigation";
import { FailureModeDetails } from "@/components/user/failure-mode/failure-mode-details";

export default function TechnicianFailureModeDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <main>
      <FailureModeDetails id={id} />
    </main>
  );
}
