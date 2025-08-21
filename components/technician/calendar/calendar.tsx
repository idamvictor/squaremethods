"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";

interface Task {
  id: string;
  title: string;
  type: "pending" | "management" | "due-soon" | "due-later";
  dueText?: string;
}

// interface CalendarDay {
//   date: Date;
//   tasks: Task[];
// }

const sampleTasks: Record<string, Task[]> = {
  "2024-02-06": [
    { id: "1", title: "Pending Task", type: "pending" },
    { id: "2", title: "Management team", type: "management" },
    {
      id: "3",
      title: "Due in 2days",
      type: "due-soon",
      dueText: "Due in 2days",
    },
  ],
  "2024-02-12": [
    { id: "4", title: "Pending Task", type: "pending" },
    { id: "5", title: "Management team", type: "management" },
    {
      id: "6",
      title: "Due in 2days",
      type: "due-soon",
      dueText: "Due in 2days",
    },
  ],
  "2024-02-20": [
    { id: "7", title: "Pending Task", type: "pending" },
    { id: "8", title: "Management team", type: "management" },
    {
      id: "9",
      title: "Due in 14 days",
      type: "due-later",
      dueText: "Due in 14 days",
    },
  ],
  "2024-02-21": [
    { id: "10", title: "Pending Task", type: "pending" },
    { id: "11", title: "Management team", type: "management" },
    { id: "12", title: "2+ more", type: "management", dueText: "2+ more" },
    {
      id: "13",
      title: "Due in 14 days",
      type: "due-later",
      dueText: "Due in 14 days",
    },
  ],
};

const taskStyles = {
  pending: "bg-green-100 text-green-800 border-green-200",
  management: "bg-gray-100 text-gray-700 border-gray-200",
  "due-soon": "bg-red-100 text-red-800 border-red-200",
  "due-later": "bg-blue-100 text-blue-800 border-blue-200",
};

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 22)); // February 22, 2024
  const [viewMode, setViewMode] = useState("Month");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Get all days to display (including previous/next month days to fill the grid)
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - getDay(monthStart));

  const endDate = new Date(monthEnd);
  const daysToAdd = 6 - getDay(monthEnd);
  endDate.setDate(endDate.getDate() + daysToAdd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDayTasks = (date: Date): Task[] => {
    const dateKey = format(date, "yyyy-MM-dd");
    return sampleTasks[dateKey] || [];
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Month">Month</SelectItem>
              <SelectItem value="Week">Week</SelectItem>
              <SelectItem value="Day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-medium text-foreground">
            {format(currentDate, "MMMM, yyyy")}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {/* Week Day Headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-muted p-3 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          const tasks = getDayTasks(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay =
            isToday(day) && format(day, "yyyy-MM-dd") === "2024-02-22";

          return (
            <Card
              key={index}
              className={`min-h-32 p-2 border-0 rounded-none bg-background hover:bg-accent/50 transition-colors ${
                !isCurrentMonth ? "opacity-50" : ""
              }`}
            >
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <span
                    className={`text-sm font-medium ${
                      isCurrentDay
                        ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        : !isCurrentMonth
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {format(day, "d") === "1" && (
                    <span className="text-xs text-muted-foreground">
                      {format(day, "MMM")} {format(day, "d")}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {tasks.slice(0, 3).map((task) => (
                    <Badge
                      key={task.id}
                      variant="outline"
                      className={`text-xs px-1.5 py-0.5 font-normal block truncate ${
                        taskStyles[task.type]
                      }`}
                    >
                      {task.dueText || task.title}
                    </Badge>
                  ))}
                  {tasks.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1.5 py-0.5 font-normal bg-gray-100 text-gray-600 border-gray-200"
                    >
                      +{tasks.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
