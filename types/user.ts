export interface User {
  id: string
  name: string
  avatar: string
  role: string
  team: string
  dateEntered: string
  isVerified: boolean
}

export interface UserFilters {
  count: string
  category: string
}
