import { create } from "zustand";
import type { Task, TaskStatus, Team } from "@/lib/mock-data";
import { mockTasks } from "@/lib/mock-data";

interface TaskStore {
  // State
  tasks: Task[];
  filteredTasks: Task[];
  currentTasks: Task[];
  searchQuery: string;
  statusFilter: TaskStatus | "all";
  teamFilter: Team | "all";
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;

  // Modal state
  isAddModalOpen: boolean;
  newTask: {
    title: string;
    taskList: string[];
    team: Team | "";
    assignedOwner: string;
    dueDate: string;
    duration: string;
  };

  // Actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: TaskStatus | "all") => void;
  setTeamFilter: (team: Team | "all") => void;
  setCurrentPage: (page: number) => void;
  applyFilters: () => void;
  updatePagination: () => void;
  deleteTask: (id: string) => void;
  resetFilters: () => void;

  // Modal actions
  openAddModal: () => void;
  closeAddModal: () => void;
  updateNewTask: (field: string, value: any) => void;
  addTaskToList: (task: string) => void;
  removeTaskFromList: (index: number) => void;
  createTask: () => void;
  resetNewTask: () => void;
}

const initialNewTask = {
  title: "",
  taskList: [],
  team: "" as Team | "",
  assignedOwner: "",
  dueDate: "",
  duration: "",
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: mockTasks,
  filteredTasks: mockTasks,
  currentTasks: mockTasks.slice(0, 8),
  searchQuery: "",
  statusFilter: "all",
  teamFilter: "all",
  currentPage: 1,
  itemsPerPage: 8,
  totalPages: Math.ceil(mockTasks.length / 8),

  // Modal state
  isAddModalOpen: false,
  newTask: initialNewTask,

  // Actions
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setStatusFilter: (status: TaskStatus | "all") => {
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
    const { tasks, searchQuery, statusFilter, teamFilter } = get();
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.assignedOwner.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Apply team filter
    if (teamFilter !== "all") {
      filtered = filtered.filter((task) => task.team === teamFilter);
    }

    const totalPages = Math.ceil(filtered.length / get().itemsPerPage);
    const currentPage = 1; // Reset to first page when filters change
    const startIndex = (currentPage - 1) * get().itemsPerPage;
    const endIndex = startIndex + get().itemsPerPage;
    const currentTasks = filtered.slice(startIndex, endIndex);

    set({
      filteredTasks: filtered,
      currentPage,
      totalPages,
      currentTasks,
    });
  },

  updatePagination: () => {
    const { filteredTasks, currentPage, itemsPerPage } = get();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTasks = filteredTasks.slice(startIndex, endIndex);

    set({ currentTasks });
  },

  deleteTask: (id: string) => {
    const { tasks } = get();
    const updatedTasks = tasks.filter((task) => task.id !== id);
    set({ tasks: updatedTasks });
    get().applyFilters();
  },

  resetFilters: () => {
    const { tasks, itemsPerPage } = get();
    const totalPages = Math.ceil(tasks.length / itemsPerPage);
    const currentTasks = tasks.slice(0, itemsPerPage);

    set({
      searchQuery: "",
      statusFilter: "all",
      teamFilter: "all",
      currentPage: 1,
      filteredTasks: tasks,
      currentTasks,
      totalPages,
    });
  },

  // Modal actions
  openAddModal: () => {
    set({ isAddModalOpen: true });
  },

  closeAddModal: () => {
    set({ isAddModalOpen: false });
    get().resetNewTask();
  },

  updateNewTask: (field: string, value: any) => {
    set((state) => ({
      newTask: { ...state.newTask, [field]: value },
    }));
  },

  addTaskToList: (task: string) => {
    if (task.trim()) {
      set((state) => ({
        newTask: {
          ...state.newTask,
          taskList: [...state.newTask.taskList, task.trim()],
        },
      }));
    }
  },

  removeTaskFromList: (index: number) => {
    set((state) => ({
      newTask: {
        ...state.newTask,
        taskList: state.newTask.taskList.filter((_, i) => i !== index),
      },
    }));
  },

  createTask: () => {
    const { newTask, tasks } = get();
    if (newTask.title && newTask.team && newTask.assignedOwner) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        status: "pending",
        team: newTask.team as Team,
        assignedOwner: {
          name: newTask.assignedOwner,
          avatar: "/placeholder.svg?height=32&width=32",
        },
        dueDate: newTask.dueDate || "TBD",
        duration: newTask.duration || "TBD",
        isNew: true,
      };

      set({ tasks: [task, ...tasks] });
      get().applyFilters();
      get().closeAddModal();
    }
  },

  resetNewTask: () => {
    set({ newTask: initialNewTask });
  },
}));
