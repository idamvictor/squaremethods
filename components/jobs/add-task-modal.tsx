"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Plus, Minus, User, Users } from "lucide-react";
import { useTaskStore } from "@/store/task-store";

export function AddTaskModal() {
  const {
    isAddModalOpen,
    newTask,
    closeAddModal,
    updateNewTask,
    addTaskToList,
    removeTaskFromList,
    createTask,
  } = useTaskStore();

  const [newTaskInput, setNewTaskInput] = useState("");

  const handleAddTask = () => {
    if (newTaskInput.trim()) {
      addTaskToList(newTaskInput);
      setNewTaskInput("");
    }
  };

  const handleCreateTask = () => {
    createTask();
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
              value={newTask.title}
              onChange={(e) => updateNewTask("title", e.target.value)}
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

            {newTask.taskList.length > 0 && (
              <div className="space-y-2">
                {newTask.taskList.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">
                      {index + 1}. {task}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeTaskFromList(index)}
                      className="h-6 w-6"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Equipment/System */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-500 rounded"></div>
              </div>
              Equipment/System
            </Label>
            <Select
              onValueChange={(value) => updateNewTask("equipment", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hydraulic Press" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hydraulic-press">Hydraulic Press</SelectItem>
                <SelectItem value="conveyor-belt">Conveyor Belt</SelectItem>
                <SelectItem value="air-compressor">Air Compressor</SelectItem>
                <SelectItem value="cooling-system">Cooling System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              Team
            </Label>
            <Select
              value={newTask.team}
              onValueChange={(value) => updateNewTask("team", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Maintenance Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maintenance">Maintenance Team</SelectItem>
                <SelectItem value="Operational">Operational Team</SelectItem>
                <SelectItem value="Sanitation">Sanitation Team</SelectItem>
                <SelectItem value="Automation">Automation Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned Owner */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Assigned Owner
            </Label>
            <Select
              value={newTask.assignedOwner}
              onValueChange={(value) => updateNewTask("assignedOwner", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Savannah Nguyen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Savannah Nguyen">Savannah Nguyen</SelectItem>
                <SelectItem value="Phoenix Baker">Phoenix Baker</SelectItem>
                <SelectItem value="Olivia Rhye">Olivia Rhye</SelectItem>
                <SelectItem value="Lana Steiner">Lana Steiner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Due Date
            </Label>
            <Select
              value={newTask.dueDate}
              onValueChange={(value) => updateNewTask("dueDate", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="13/05/2025" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="May 24">May 24</SelectItem>
                <SelectItem value="May 25">May 25</SelectItem>
                <SelectItem value="May 26">May 26</SelectItem>
                <SelectItem value="May 27">May 27</SelectItem>
                <SelectItem value="May 28">May 28</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              Duration
            </Label>
            <Select
              value={newTask.duration}
              onValueChange={(value) => updateNewTask("duration", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="7hrs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1hr">1hr</SelectItem>
                <SelectItem value="2hrs">2hrs</SelectItem>
                <SelectItem value="3hrs">3hrs</SelectItem>
                <SelectItem value="4hrs">4hrs</SelectItem>
                <SelectItem value="5hrs">5hrs</SelectItem>
                <SelectItem value="6hrs">6hrs</SelectItem>
                <SelectItem value="7hrs">7hrs</SelectItem>
                <SelectItem value="8hrs">8hrs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create Task Button */}
          <Button
            onClick={handleCreateTask}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!newTask.title || !newTask.team || !newTask.assignedOwner}
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
