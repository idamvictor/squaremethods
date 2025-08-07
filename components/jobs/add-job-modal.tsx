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
import { Plus, Users, User, Calendar, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobStore } from "@/store/job-store";

export function AddJobModal() {
  const {
    isAddModalOpen,
    newJob,
    closeAddModal,
    updateNewJob,
    addTaskToList,
    removeTaskFromList,
    createJob,
  } = useJobStore();

  const [newTaskInput, setNewTaskInput] = useState("");

  const handleAddTask = () => {
    if (newTaskInput.trim()) {
      addTaskToList(newTaskInput);
      setNewTaskInput("");
    }
  };

  const handleCreateJob = () => {
    createJob();
    setNewTaskInput("");
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={closeAddModal}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-5 h-5 border border-gray-400 rounded"></div>
            Add New Job
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle">
              Job Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jobTitle"
              placeholder="Hydraulic press maintenance"
              value={newJob.title}
              onChange={(e) => updateNewJob("title", e.target.value)}
            />
          </div>

          {/* Task List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Task List</Label>
              <span className="text-xs text-gray-500">
                Click + To task from your task list
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add new task..."
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
              />
              <Button size="icon" variant="outline" onClick={handleAddTask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {newJob.taskList.length > 0 && (
              <div className="space-y-2">
                {newJob.taskList.map((task, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 p-2 bg-gray-50 rounded">{task}</div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeTaskFromList(index)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Equipment/System */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center"></div>
              Equipment/System
            </Label>
            <Select onValueChange={(value) => updateNewJob("equipment", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Hydraulic Press" />
              </SelectTrigger>
              <SelectContent>{/* Equipment options */}</SelectContent>
            </Select>
          </div>

          {/* Team */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              Team
            </Label>
            <Select
              value={newJob.team}
              onValueChange={(value) => updateNewJob("team", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Maintenance Team" />
              </SelectTrigger>
              <SelectContent>{/* Team options */}</SelectContent>
            </Select>
          </div>

          {/* Assigned Owner */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Assigned Owner
            </Label>
            <Select
              value={newJob.assignedOwner}
              onValueChange={(value) => updateNewJob("assignedOwner", value)}
            >
              {/* Owner options */}
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Due Date
            </Label>
            <Select
              value={newJob.dueDate}
              onValueChange={(value) => updateNewJob("dueDate", value)}
            >
              {/* Date options */}
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              Duration
            </Label>
            <Select
              value={newJob.duration}
              onValueChange={(value) => updateNewJob("duration", value)}
            >
              {/* Duration options */}
            </Select>
          </div>

          {/* Create Job Button */}
          <Button
            onClick={handleCreateJob}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!newJob.title || !newJob.team || !newJob.assignedOwner}
          >
            Create Job
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
