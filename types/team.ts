export interface TeamMember {
  id: string
  name: string
  avatar: string
  role: string
  email: string
  contact: string
  dateEntered: string
}

export interface Team {
  id: string
  name: string
  memberCount: number
  lastActivity: string
  members: TeamMember[]
}

export interface TeamFilters {
  count: string
  category: string
}
