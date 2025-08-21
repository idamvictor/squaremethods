import { avatarImage } from "@/constants/images";

// import type { Task } from "./types";
export type JobStatus = "pending" | "completed" | "declined";

export type Team = "Operational" | "Sanitation" | "Maintenance" | "Automation";

export interface AssignedOwner {
  name: string;
  avatar: string;
}

export interface Job {
  id: string;
  title: string;
  status: JobStatus;
  team: Team;
  assignedOwner: AssignedOwner;
  dueDate: string;
  duration: string;
  isNew?: boolean;
}

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Inspect pressure gauge",
    status: "pending",
    team: "Operational",
    assignedOwner: {
      name: "Olivia Rhye",
      avatar: avatarImage.image1,
    },
    dueDate: "May 24",
    duration: "2hrs",
    isNew: true,
  },
  {
    id: "2",
    title: "Check oil levels",
    status: "completed",
    team: "Sanitation",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: avatarImage.image2,
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "3",
    title: "Test valve operation",
    status: "pending",
    team: "Maintenance",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: avatarImage.image3,
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "4",
    title: "Inspect pressure gauge",
    status: "completed",
    team: "Maintenance",
    assignedOwner: {
      name: "Lana Steiner",
      avatar: avatarImage.image4,
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "5",
    title: "Check oil levels",
    status: "pending",
    team: "Maintenance",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: avatarImage.image1,
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "6",
    title: "Test valve operation",
    status: "pending",
    team: "Automation",
    assignedOwner: {
      name: "Olivia Rhye",
      avatar: avatarImage.image2,
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "7",
    title: "Inspect pressure gauge",
    status: "declined",
    team: "Automation",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: avatarImage.image3,
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "8",
    title: "Check oil levels",
    status: "pending",
    team: "Maintenance",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: avatarImage.image4,
    },
    dueDate: "May 24",
    duration: "2hrs",
  },
  {
    id: "9",
    title: "Calibrate sensors",
    status: "completed",
    team: "Automation",
    assignedOwner: {
      name: "Lana Steiner",
      avatar: avatarImage.image1,
    },
    dueDate: "May 25",
    duration: "3hrs",
  },
  {
    id: "10",
    title: "Replace filters",
    status: "pending",
    team: "Sanitation",
    assignedOwner: {
      name: "Olivia Rhye",
      avatar: avatarImage.image2,
    },
    dueDate: "May 25",
    duration: "1hr",
  },
  {
    id: "11",
    title: "System backup",
    status: "completed",
    team: "Operational",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: avatarImage.image3,
    },
    dueDate: "May 25",
    duration: "4hrs",
  },
  {
    id: "12",
    title: "Equipment inspection",
    status: "declined",
    team: "Maintenance",
    assignedOwner: {
      name: "Lana Steiner",
      avatar: avatarImage.image4,
    },
    dueDate: "May 26",
    duration: "2hrs",
  },
  {
    id: "13",
    title: "Safety protocol review",
    status: "pending",
    team: "Operational",
    assignedOwner: {
      name: "Olivia Rhye",
      avatar: avatarImage.image1,
    },
    dueDate: "May 26",
    duration: "1hr",
  },
  {
    id: "14",
    title: "Temperature monitoring",
    status: "completed",
    team: "Automation",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: avatarImage.image2,
    },
    dueDate: "May 26",
    duration: "2hrs",
  },
  {
    id: "15",
    title: "Clean work area",
    status: "pending",
    team: "Sanitation",
    assignedOwner: {
      name: "Lana Steiner",
      avatar: avatarImage.image3,
    },
    dueDate: "May 27",
    duration: "1hr",
  },
  {
    id: "16",
    title: "Update documentation",
    status: "completed",
    team: "Operational",
    assignedOwner: {
      name: "Olivia Rhye",
      avatar: avatarImage.image4,
    },
    dueDate: "May 27",
    duration: "3hrs",
  },
  {
    id: "17",
    title: "Pump maintenance",
    status: "pending",
    team: "Maintenance",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: avatarImage.image1,
    },
    dueDate: "May 27",
    duration: "4hrs",
  },
  {
    id: "18",
    title: "Quality control check",
    status: "declined",
    team: "Operational",
    assignedOwner: {
      name: "Lana Steiner",
      avatar: avatarImage.image2,
    },
    dueDate: "May 28",
    duration: "2hrs",
  },
  {
    id: "19",
    title: "Network diagnostics",
    status: "completed",
    team: "Automation",
    assignedOwner: {
      name: "Olivia Rhye",
      avatar: avatarImage.image3,
    },
    dueDate: "May 28",
    duration: "3hrs",
  },
  {
    id: "20",
    title: "Waste disposal",
    status: "pending",
    team: "Sanitation",
    assignedOwner: {
      name: "Phoenix Baker",
      avatar: avatarImage.image4,
    },
    dueDate: "May 28",
    duration: "1hr",
  },
];
