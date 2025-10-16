import { Check, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/services/users/users-querries";

export function ProfileSection() {
  const { data: profileData, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const user = profileData?.data;
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}` : "";

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-medium text-gray-600 mb-6">My Profile</h2>

      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user?.avatar_url || ""} alt="Profile" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-medium text-gray-900">
              {user ? `${user.first_name} ${user.last_name}` : ""}
            </span>
            {user?.email_verified && (
              <Check className="w-5 h-5 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">{user?.role}</p>
          <p className="text-sm text-gray-500">
            {user?.teams?.length ? user.teams[0].name : "No team assigned"}
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Edit2 className="w-4 h-4" />
          Edit
        </Button>
      </div>
    </div>
  );
}
