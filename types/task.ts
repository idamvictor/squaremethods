export interface Task {
  id: string
  description: string
  priority: string
  status: string
  category: string
  assignedTo: string
  dueDate: string
  createdAt: string
}

export interface TaskFilters {
  count: string
  category: string
}
