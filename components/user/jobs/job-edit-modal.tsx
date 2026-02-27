"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useJobById, useUpdateJob } from "@/services/jobs/jobs-queries";
import { useTasks } from "@/services/tasks/tasks-queries";
import { useTeams, useTeamMembers } from "@/services/teams/teams";
import { JobPriority } from "@/services/jobs/jobs-types";
import { EquipmentHierarchyModal } from "./equipment-hierarchy-modal";

interface JobEditModalProps {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobEditModal({ jobId, isOpen, onClose }: JobEditModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as JobPriority,
    due_date: new Date(),
    equipment_id: "",
    equipment_name: "",
    task_ids: [] as string[],
    team: "",
    assigned_owner: "",
    duration: "",
    safety_notes: "",
  });

  const [isEquipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { data: job, isLoading: isLoadingJob } = useJobById(jobId || undefined);
  const updateJobMutation = useUpdateJob();

  const { data: tasksData, isLoading: isTasksLoading } = useTasks({
    equipment_id: formData.equipment_id || undefined,
  });
  const {
    data: teamsData,
    isLoading: isTeamsLoading,
    error: teamsError,
  } = useTeams();
  const {
    data: teamMembersData,
    isLoading: isTeamMembersLoading,
    error: teamMembersError,
  } = useTeamMembers(formData.team || "");

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        description: job.description || "",
        priority: (job.priority || "medium") as JobPriority,
        due_date: new Date(job.due_date),
        equipment_id: job.equipment_id || "",
        equipment_name: job.equipment?.name || "",
        task_ids: job.tasks?.map((task) => task.id) || [],
        team: job.team_id || "",
        assigned_owner: job.assigned_to || "",
        duration: job.estimated_duration
          ? (job.estimated_duration / 60).toString()
          : "",
        safety_notes: job.safety_notes || "",
      });
    }
  }, [job]);

  const handleSave = async () => {
    if (!jobId || !formData.title) return;

    try {
      await updateJobMutation.mutateAsync({
        jobId,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        due_date: formData.due_date.toISOString(),
        equipment_id: formData.equipment_id || null,
        task_ids: formData.task_ids,
        team_id: formData.team,
        assigned_to: formData.assigned_owner,
        estimated_duration: formData.duration
          ? Math.round(parseFloat(formData.duration) * 60)
          : 0,
        safety_notes: formData.safety_notes,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>

          {isLoadingJob ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="job-title" className="text-sm font-medium">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="job-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter job title"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter job description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
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
                  {formData.equipment_id ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        {formData.equipment_name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            equipment_id: "",
                            equipment_name: "",
                          });
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

              {/* Task Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Select Task <span className="text-red-500">*</span>
                  </Label>
                  <span className="text-xs text-gray-400">
                    Choose tasks from your list
                  </span>
                </div>
                {!formData.equipment_id ? (
                  <div className="w-full p-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-sm text-blue-700">
                      Please select equipment first to see available tasks
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {formData.task_ids.map((id) => {
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
                                setFormData({
                                  ...formData,
                                  task_ids: formData.task_ids.filter(
                                    (taskId) => taskId !== id,
                                  ),
                                });
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
                        if (!formData.task_ids.includes(value)) {
                          setFormData({
                            ...formData,
                            task_ids: [...formData.task_ids, value],
                          });
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
                            No tasks found for this equipment
                          </div>
                        ) : (
                          tasksData?.data
                            .filter(
                              (task) => !formData.task_ids.includes(task.id),
                            )
                            .map((task) => (
                              <SelectItem key={task.id} value={task.id}>
                                {task.title}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value as JobPriority })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Team */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Team</Label>
                <Select
                  value={formData.team}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      team: value,
                      assigned_owner: "",
                    });
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
                <Label className="text-sm font-medium">Assigned Owner</Label>
                <Select
                  value={formData.assigned_owner}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assigned_owner: value })
                  }
                  disabled={!formData.team}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !formData.team ? "Select a team first" : "Select owner"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {!formData.team ? (
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
                <Label htmlFor="due-date" className="text-sm font-medium">
                  Due Date <span className="text-red-500">*</span>
                </Label>
                <Popover
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      id="due-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.due_date && "text-muted-foreground",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.due_date
                        ? format(formData.due_date, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.due_date}
                      onSelect={(date) => {
                        if (date) {
                          setFormData({ ...formData, due_date: date });
                        }
                        setIsDatePickerOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Duration (hours)</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
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
                  value={formData.safety_notes}
                  onChange={(e) =>
                    setFormData({ ...formData, safety_notes: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoadingJob}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                isLoadingJob ||
                updateJobMutation.isPending ||
                !formData.title ||
                !formData.team ||
                !formData.assigned_owner ||
                !formData.task_ids.length
              }
            >
              {updateJobMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EquipmentHierarchyModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setEquipmentModalOpen(false)}
        onAttach={(equipmentId, equipmentName) => {
          setFormData({
            ...formData,
            equipment_id: equipmentId,
            equipment_name: equipmentName,
          });
        }}
      />
    </>
  );
}
