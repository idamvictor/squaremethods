import { create } from "zustand";
import type { Task, TaskFilters } from "@/types/task";

interface TaskStore {
  tasks: Task[];
  filters: TaskFilters;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  setFilter: (key: keyof TaskFilters, value: string) => void;
  resetFilters: () => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getFilteredTasks: () => Task[];
  getPaginatedTasks: () => Task[];
  getTotalPages: () => number;
}

const initialFilters: TaskFilters = {
  count: "50",
  category: "all",
};

// Generate comprehensive mock data for pagination testing
const generateMockTasks = (): Task[] => {
  const taskTypes = [
    "Inspect pressure gauge",
    "Check oil levels",
    "Test valve operation",
    "Calibrate sensors",
    "Replace filters",
    "Clean equipment",
    "Verify safety systems",
    "Update maintenance logs",
    "Check temperature readings",
    "Inspect electrical connections",
    "Test emergency shutoffs",
    "Lubricate moving parts",
    "Check fluid levels",
    "Inspect seals and gaskets",
    "Test alarm systems",
    "Review safety protocols",
    "Check ventilation systems",
    "Inspect piping",
    "Test backup systems",
    "Update documentation",
  ];

  const priorities = ["High", "Medium", "Low"];
  const statuses = ["Pending", "In Progress", "Completed", "Overdue"];
  const categories = ["Equipment", "Safety", "Maintenance", "Inspection"];

  return Array.from({ length: 150 }, (_, index) => ({
    id: `task-${index + 1}`,
    description: taskTypes[index % taskTypes.length],
    priority: priorities[index % priorities.length],
    status: statuses[index % statuses.length],
    category: categories[index % categories.length],
    assignedTo: `User ${Math.floor(index / 10) + 1}`,
    dueDate: new Date(
      Date.now() + index * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    createdAt: new Date(
      Date.now() - index * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
  }));
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: generateMockTasks(),
  filters: initialFilters,
  searchQuery: "",
  currentPage: 1,
  itemsPerPage: 10,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      currentPage: 1, // Reset to first page when filtering
    })),

  resetFilters: () =>
    set({
      filters: initialFilters,
      searchQuery: "",
      currentPage: 1,
    }),

  setSearchQuery: (query) =>
    set({
      searchQuery: query,
      currentPage: 1, // Reset to first page when searching
    }),

  setCurrentPage: (page) => set({ currentPage: page }),

  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  getFilteredTasks: () => {
    const { tasks, filters, searchQuery } = get();

    return tasks.filter((task) => {
      // Search filter
      if (
        searchQuery &&
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (filters.category !== "all") {
        if (filters.category === "equipment" && task.category !== "Equipment")
          return false;
        if (filters.category === "recent" && task.status !== "Pending")
          return false;
      }

      return true;
    });
  },

  getPaginatedTasks: () => {
    const { currentPage, itemsPerPage } = get();
    const filteredTasks = get().getFilteredTasks();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredTasks.slice(startIndex, endIndex);
  },

  getTotalPages: () => {
    const { itemsPerPage } = get();
    const filteredTasks = get().getFilteredTasks();
    return Math.ceil(filteredTasks.length / itemsPerPage);
  },
}));
