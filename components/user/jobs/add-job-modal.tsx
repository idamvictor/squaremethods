"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useJobStore } from "@/store/job-store";
import { EquipmentHierarchyModal } from "./equipment-hierarchy-modal";
import { useTeams, useTeamMembers } from "@/services/teams/teams";
import { useCreateJob } from "@/services/jobs/jobs-queries";
import { useTasks } from "@/services/tasks/tasks-queries";
import { CreateJobInput } from "@/services/jobs/jobs-types";

export function AddJobModal() {
  const { isAddModalOpen, newJob, closeAddModal, updateNewJob, createJob } =
    useJobStore();

  const { data: tasksData, isLoading: isTasksLoading } = useTasks();
  const {
    data: teamsData,
    isLoading: isTeamsLoading,
    error: teamsError,
  } = useTeams();
  const {
    data: teamMembersData,
    isLoading: isTeamMembersLoading,
    error: teamMembersError,
  } = useTeamMembers(newJob.team || ""); // Will only fetch when team ID is not empty
  const [isEquipmentModalOpen, setEquipmentModalOpen] = useState(false);

  const createJobMutation = useCreateJob();

  const handleCreateJob = async () => {
    try {
      const newJobData = await createJob();

      if (
        !newJobData.title ||
        !newJobData.team ||
        !newJobData.assignedOwner ||
        !newJobData.dueDate ||
        !newJobData.task_ids.length
      ) {
        console.error("Required fields missing");
        return;
      }

      // Ensure we have a valid date
      const dueDate = new Date(newJobData.dueDate);
      if (isNaN(dueDate.getTime())) {
        console.error("Invalid due date");
        return;
      }

      // Create a job with all selected tasks
      const jobInput: CreateJobInput = {
        title: newJobData.title,
        description: newJobData.description || "No description provided",
        team_id: newJobData.team,
        assigned_to: newJobData.assignedOwner,
        priority: newJobData.priority,
        due_date: dueDate.toISOString(),
        estimated_duration: Math.round(parseFloat(newJobData.duration) * 60),
        safety_notes: newJobData.safety_notes || "No safety notes provided",
        task_ids: newJobData.task_ids,
      };
      await createJobMutation.mutateAsync(jobInput);
      closeAddModal();
    } catch (error) {
      console.error("Failed to create job:", error);
      // TODO: Handle error (show toast notification, etc.)
    }
  };

  return (
    <>
      <Dialog open={isAddModalOpen} onOpenChange={closeAddModal}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Job</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-sm font-medium">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobTitle"
                placeholder="Enter job title"
                value={newJob.title}
                onChange={(e) => updateNewJob("title", e.target.value)}
              />
            </div>

            {/* Task Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Select Task <span className="text-red-500">*</span>
                </Label>
                <span className="text-xs text-gray-400">
                  Choose a task from your list
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {newJob.task_ids.map((id) => {
                    const task = tasksData?.data.find((t) => t.id === id);
                    if (!task) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {task.title}
                        <button
                          onClick={() => {
                            updateNewJob(
                              "task_ids",
                              newJob.task_ids.filter((taskId) => taskId !== id)
                            );
                          }}
                          className="hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                <Select
                  disabled={isTasksLoading}
                  onValueChange={(value) => {
                    if (!newJob.task_ids.includes(value)) {
                      updateNewJob("task_ids", [...newJob.task_ids, value]);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose tasks" />
                  </SelectTrigger>
                  <SelectContent>
                    {isTasksLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : tasksData?.data?.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        No tasks found
                      </div>
                    ) : (
                      tasksData?.data
                        .filter((task) => !newJob.task_ids.includes(task.id))
                        .map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Attached Equipment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Attached Equipment
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEquipmentModalOpen(true)}
                >
                  Select Equipment
                </Button>
              </div>
              <div className="w-full p-3 bg-gray-50 rounded-md border">
                {newJob.equipment ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {newJob.equipmentName}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updateNewJob("equipment", "");
                        updateNewJob("equipmentName", "");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">
                    No equipment selected
                  </span>
                )}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Priority</Label>
              </div>
              <Select
                value={newJob.priority}
                onValueChange={(value: "low" | "medium" | "urgent") =>
                  updateNewJob("priority", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Team */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Team</Label>
              </div>
              <Select
                value={newJob.team}
                onValueChange={(value) => {
                  updateNewJob("team", value);
                  // Clear assigned owner when team changes
                  updateNewJob("assignedOwner", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {isTeamsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : teamsError ? (
                    <SelectItem value="error" disabled>
                      Error loading teams
                    </SelectItem>
                  ) : (
                    teamsData?.data.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Assigned Owner */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Assigned Owner</Label>
              </div>
              <Select
                value={newJob.assignedOwner}
                onValueChange={(value) => updateNewJob("assignedOwner", value)}
                disabled={!newJob.team}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !newJob.team ? "Select a team first" : "Select owner"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {!newJob.team ? (
                    <SelectItem value="no-team" disabled>
                      Please select a team first
                    </SelectItem>
                  ) : isTeamMembersLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : teamMembersError ? (
                    <SelectItem value="error" disabled>
                      Error loading team members
                    </SelectItem>
                  ) : !teamMembersData?.data?.length ? (
                    <SelectItem value="no-members" disabled>
                      No members in this team
                    </SelectItem>
                  ) : (
                    teamMembersData?.data?.map((member) => {
                      const fullName =
                        `${member.first_name} ${member.last_name}`.trim();
                      return (
                        <SelectItem key={member.id} value={member.id}>
                          {fullName}
                        </SelectItem>
                      );
                    }) || []
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Due Date</Label>
              </div>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newJob.dueDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {newJob.dueDate ? (
                      format(new Date(newJob.dueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={
                      newJob.dueDate ? new Date(newJob.dueDate) : undefined
                    }
                    onSelect={(date) =>
                      updateNewJob("dueDate", date ? date.toISOString() : "")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Duration (hours)</Label>
              </div>
              <Input
                type="number"
                value={newJob.duration}
                onChange={(e) => updateNewJob("duration", e.target.value)}
                min="1"
                step="0.5"
                placeholder="Enter duration in hours"
              />
            </div>

            {/* Safety Notes */}
            <div className="space-y-2">
              <Label htmlFor="safetyNotes" className="text-sm font-medium">
                Safety Notes
              </Label>
              <Textarea
                id="safetyNotes"
                placeholder="Enter safety notes"
                value={newJob.safety_notes}
                onChange={(e) => updateNewJob("safety_notes", e.target.value)}
              />
            </div>

            {/* Create Job Button */}
            <Button
              onClick={handleCreateJob}
              className="w-full bg-[#39447A] hover:bg-[#2d355f] text-white"
              disabled={
                !newJob.title ||
                !newJob.team ||
                !newJob.assignedOwner ||
                !newJob.dueDate ||
                !newJob.duration ||
                !newJob.priority ||
                !newJob.task_ids.length
              }
            >
              Create Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <EquipmentHierarchyModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setEquipmentModalOpen(false)}
        onAttach={(equipmentId, equipmentName) => {
          updateNewJob("equipment", equipmentId);
          updateNewJob("equipmentName", equipmentName);
        }}
      />
    </>
  );
}
