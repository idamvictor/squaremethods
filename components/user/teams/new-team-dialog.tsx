"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateTeam } from "@/services/teams/teams";
import { AddMemberModal } from "./add-member-modal";

interface NewTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTeamDialog({ open, onOpenChange }: NewTeamDialogProps) {
  const [newTeamData, setNewTeamData] = useState({
    name: "",
    description: "",
  });
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const { mutate: createTeam } = useCreateTeam();

  const handleCreateTeam = async () => {
    createTeam(newTeamData, {
      onSuccess: () => {
        onOpenChange(false);
        setNewTeamData({ name: "", description: "" });
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Team</DialogTitle>
            <DialogDescription>
              You can create new teams and add team members to your teams
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                value={newTeamData.name}
                onChange={(e) =>
                  setNewTeamData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Operations team"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTeamData.description}
                onChange={(e) =>
                  setNewTeamData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Team description"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button onClick={() => setIsAddMemberOpen(true)}>
              Add members
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={!newTeamData.name.trim()}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AddMemberModal
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
      />
    </>
  );
}
