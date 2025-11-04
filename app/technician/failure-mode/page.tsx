import { FailureModeList } from "@/components/user/failure-mode/failure-mode-list";
import React from "react";

export default function page() {
  return (
    <main className="min-h-screen bg-background p-6">
      <FailureModeList />
    </main>
  );
}
