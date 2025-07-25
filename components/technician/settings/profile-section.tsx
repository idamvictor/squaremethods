import { Check, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfileSection() {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-medium text-gray-600 mb-6">My Profile</h2>

      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Profile" />
          <AvatarFallback>NJ</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-medium text-gray-900">Neme John</span>
            <Check className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Team Manager</p>
          <p className="text-sm text-gray-500">Head quarters</p>
        </div>

        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Edit2 className="w-4 h-4" />
          Edit
        </Button>
      </div>
    </div>
  )
}
