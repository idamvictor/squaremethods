"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTeam } from "@/services/teams/teams";
import { Team } from "@/services/teams/teams-types";

interface UpdateTeamModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateTeamModal({
  team,
  isOpen,
  onClose,
}: UpdateTeamModalProps) {
  const [formData, setFormData] = useState({
    name: team.name,
    description: team.description,
  });

  const updateTeamMutation = useUpdateTeam();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTeamMutation.mutateAsync({
        teamId: team.id,
        data: formData,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Team</DialogTitle>
          <DialogDescription>
            Make changes to your team here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Team Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter team name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="description">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter team description"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateTeamMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateTeamMutation.isPending}>
              {updateTeamMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
