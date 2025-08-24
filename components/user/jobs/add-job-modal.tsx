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
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
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
      <DialogContent className="max-w-md mx-auto">
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

          {/* Task List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Task List</Label>
              <span className="text-xs text-gray-400">
                Click + to task from your task list
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add task"
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

          {/* Attached Equipment */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Attached Equipment</Label>
            </div>
            <Select onValueChange={(value) => updateNewJob("equipment", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hydraulic-press">Hydraulic Press</SelectItem>
                <SelectItem value="cnc-machine">CNC Machine</SelectItem>
                <SelectItem value="conveyor-belt">Conveyor Belt</SelectItem>
                <SelectItem value="industrial-robot">
                  Industrial Robot
                </SelectItem>
                <SelectItem value="packaging-machine">
                  Packaging Machine
                </SelectItem>
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
              onValueChange={(value) => updateNewJob("team", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Maintenance Team</SelectItem>
                <SelectItem value="operations">Operations Team</SelectItem>
                <SelectItem value="quality">Quality Control Team</SelectItem>
                <SelectItem value="production">Production Team</SelectItem>
                <SelectItem value="engineering">Engineering Team</SelectItem>
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
            >
              <SelectTrigger>
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                <SelectItem value="david-brown">David Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Due date</Label>
            </div>
            <Select
              value={newJob.dueDate}
              onValueChange={(value) => updateNewJob("dueDate", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="next-week">Next Week</SelectItem>
                <SelectItem value="two-weeks">In 2 Weeks</SelectItem>
                <SelectItem value="month">In a Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Duration</Label>
            </div>
            <Select
              value={newJob.duration}
              onValueChange={(value) => updateNewJob("duration", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="4hrs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="8">8 hours</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create Task Button */}
          <Button
            onClick={handleCreateJob}
            className="w-full bg-[#39447A] hover:bg-[#2d355f] text-white"
            disabled={!newJob.title || !newJob.team || !newJob.assignedOwner}
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
