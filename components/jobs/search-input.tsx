"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useJobStore } from "@/store/job-store";

export function SearchInput() {
  const { searchQuery, setSearchQuery } = useJobStore();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Search jobs or assignees..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
