import { create } from "zustand";
import { mockJobs } from "@/lib/job-mock-data";
import { Job, Team, JobStatus } from "@/lib/job-mock-data";

interface JobStore {
  // State
  jobs: Job[];
  filteredJobs: Job[];
  currentJobs: Job[];
  searchQuery: string;
  statusFilter: JobStatus | "all";
  teamFilter: Team | "all";
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;

  // Modal state
  isAddModalOpen: boolean;
  newJob: {
    title: string;
    taskList: string[];
    team: Team | "";
    assignedOwner: string;
    dueDate: string;
    duration: string;
  };

  // Actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: JobStatus | "all") => void;
  setTeamFilter: (team: Team | "all") => void;
  setCurrentPage: (page: number) => void;
  applyFilters: () => void;
  updatePagination: () => void;
  deleteJob: (id: string) => void;
  resetFilters: () => void;

  // Modal actions
  openAddModal: () => void;
  closeAddModal: () => void;
  updateNewJob: (field: string, value: any) => void;
  addTaskToList: (task: string) => void;
  removeTaskFromList: (index: number) => void;
  createJob: () => void;
  resetNewJob: () => void;
}

const initialNewJob = {
  title: "",
  taskList: [],
  team: "" as Team | "",
  assignedOwner: "",
  dueDate: "",
  duration: "",
};

export const useJobStore = create<JobStore>((set, get) => ({
  // Initial state
  jobs: mockJobs,
  filteredJobs: mockJobs,
  currentJobs: mockJobs.slice(0, 8),
  searchQuery: "",
  statusFilter: "all",
  teamFilter: "all",
  currentPage: 1,
  itemsPerPage: 8,
  totalPages: Math.ceil(mockJobs.length / 8),

  // Modal state
  isAddModalOpen: false,
  newJob: initialNewJob,

  // Actions
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setStatusFilter: (status: JobStatus | "all") => {
    set({ statusFilter: status });
    get().applyFilters();
  },

  setTeamFilter: (team: Team | "all") => {
    set({ teamFilter: team });
    get().applyFilters();
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    get().updatePagination();
  },

  applyFilters: () => {
    const { jobs, searchQuery, statusFilter, teamFilter } = get();
    let filtered = [...jobs];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.assignedOwner.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Apply team filter
    if (teamFilter !== "all") {
      filtered = filtered.filter((job) => job.team === teamFilter);
    }

    const totalPages = Math.ceil(filtered.length / get().itemsPerPage);
    const currentPage = 1; // Reset to first page when filters change
    const startIndex = (currentPage - 1) * get().itemsPerPage;
    const endIndex = startIndex + get().itemsPerPage;
    const currentJobs = filtered.slice(startIndex, endIndex);

    set({
      filteredJobs: filtered,
      currentPage,
      totalPages,
      currentJobs,
    });
  },

  updatePagination: () => {
    const { filteredJobs, currentPage, itemsPerPage } = get();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentJobs = filteredJobs.slice(startIndex, endIndex);

    set({ currentJobs });
  },

  deleteJob: (id: string) => {
    const { jobs } = get();
    const updatedJobs = jobs.filter((job) => job.id !== id);
    set({ jobs: updatedJobs });
    get().applyFilters();
  },

  resetFilters: () => {
    const { jobs, itemsPerPage } = get();
    const totalPages = Math.ceil(jobs.length / itemsPerPage);
    const currentJobs = jobs.slice(0, itemsPerPage);

    set({
      searchQuery: "",
      statusFilter: "all",
      teamFilter: "all",
      currentPage: 1,
      filteredJobs: jobs,
      currentJobs,
      totalPages,
    });
  },

  // Modal actions
  openAddModal: () => {
    set({ isAddModalOpen: true });
  },

  closeAddModal: () => {
    set({ isAddModalOpen: false });
    get().resetNewJob();
  },

  updateNewJob: (field: string, value: any) => {
    set((state) => ({
      newJob: { ...state.newJob, [field]: value },
    }));
  },

  addTaskToList: (task: string) => {
    if (task.trim()) {
      set((state) => ({
        newJob: {
          ...state.newJob,
          taskList: [...state.newJob.taskList, task.trim()],
        },
      }));
    }
  },

  removeTaskFromList: (index: number) => {
    set((state) => ({
      newJob: {
        ...state.newJob,
        taskList: state.newJob.taskList.filter((_, i) => i !== index),
      },
    }));
  },

  createJob: () => {
    const { newJob, jobs } = get();
    if (newJob.title && newJob.team && newJob.assignedOwner) {
      const newJobEntry = {
        id: (jobs.length + 1).toString(),
        title: newJob.title,
        status: "pending" as JobStatus,
        team: newJob.team as Team,
        assignedOwner: {
          name: newJob.assignedOwner,
          avatar: "/placeholder.svg?height=32&width=32",
        },
        dueDate: newJob.dueDate,
        duration: newJob.duration,
        isNew: true,
      };
      set((state) => ({
        jobs: [newJobEntry, ...state.jobs],
      }));
      get().applyFilters();
      get().closeAddModal();
    }
  },

  resetNewJob: () => {
    set({ newJob: initialNewJob });
  },
}));
