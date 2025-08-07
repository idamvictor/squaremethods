import { create } from "zustand"
import type { User, UserFilters } from "@/types/user"

interface UserStore {
  users: User[]
  filters: UserFilters
  setFilter: (key: keyof UserFilters, value: string) => void
  resetFilters: () => void
  addUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
}

const initialFilters: UserFilters = {
  count: "50",
  category: "all",
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Olivia Rhye",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Admin",
    team: "Operational",
    dateEntered: "05 / 12 / 2025",
    isVerified: false,
  },
  {
    id: "2",
    name: "Phoenix Baker",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Super Admin",
    team: "Sanitation",
    dateEntered: "05 / 12 / 2025",
    isVerified: true,
  },
  {
    id: "3",
    name: "Phoenix Baker",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Viewer",
    team: "Maintenance",
    dateEntered: "05 / 12 / 2025",
    isVerified: false,
  },
  {
    id: "4",
    name: "Lana Steiner",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Editor",
    team: "Maintenance",
    dateEntered: "05 / 12 / 2025",
    isVerified: false,
  },
  {
    id: "5",
    name: "Phoenix Baker",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Admin",
    team: "Maintenance",
    dateEntered: "05 / 12 / 2025",
    isVerified: false,
  },
  {
    id: "6",
    name: "Phoenix Baker",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Viewer",
    team: "Automation",
    dateEntered: "05 / 12 / 2025",
    isVerified: false,
  },
]

export const useUserStore = create<UserStore>((set) => ({
  users: mockUsers,
  filters: initialFilters,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () => set({ filters: initialFilters }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, ...updates } : user)),
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}))
