import { create } from "zustand";
import { CreateJobInput, JobPriority } from "@/services/jobs/jobs-types";
import { useCreateJob as useCreateJobMutation } from "@/services/jobs/jobs-queries";

type NewJobData = {
  title: string;
  description: string;
  team: string;
  assignedOwner: string;
  dueDate: string;
  duration: string;
  equipment: string;
  equipmentName: string;
  priority: JobPriority;
  safety_notes: string;
  job_aid_ids: string[];
};

interface JobStore {
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Modal state
  isAddModalOpen: boolean;
  newJob: NewJobData;

  // Modal actions
  openAddModal: () => void;
  closeAddModal: () => void;
  updateNewJob: <K extends keyof NewJobData>(
    field: K,
    value: NewJobData[K]
  ) => void;

  createJob: () => Promise<NewJobData>;
  resetNewJob: () => void;
}

const initialNewJob: NewJobData = {
  title: "",
  description: "",
  team: "",
  assignedOwner: "",
  dueDate: "",
  duration: "",
  equipment: "",
  equipmentName: "",
  priority: "medium" as JobPriority,
  safety_notes: "",
  job_aid_ids: [],
};

export const useJobStore = create<JobStore>((set, get) => ({
  // Search state
  searchQuery: "",
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  // Modal state
  isAddModalOpen: false,
  newJob: initialNewJob,

  // Modal actions
  openAddModal: () => {
    set({ isAddModalOpen: true });
  },

  closeAddModal: () => {
    set({ isAddModalOpen: false });
    get().resetNewJob();
  },

  updateNewJob: <K extends keyof NewJobData>(
    field: K,
    value: NewJobData[K]
  ) => {
    set((state) => ({
      newJob: { ...state.newJob, [field]: value },
    }));
  },

  createJob: async () => {
    const { newJob } = get();
    return newJob;
  },

  resetNewJob: () => {
    set({ newJob: initialNewJob });
  },
}));
