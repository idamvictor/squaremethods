import { Check, Edit2 } from "lucide-react";
import { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile, useUpdateProfile } from "@/services/users/users-querries";
import { FileManagerModal } from "@/components/shared/file-manager/file-manager-modal";
import { useAuthStore } from "@/store/auth-store";

export function ProfileSection() {
  const { data: profileData, isLoading, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const setUser = useAuthStore((state) => state.setUser);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

  const handleFileSelect = async (fileUrl: string) => {
    setAvatarUrl(fileUrl);
    try {
      await updateProfileMutation.mutateAsync({
        avatar_url: fileUrl,
      });
      // Update auth store
      setUser({ avatar_url: fileUrl });
      refetch();
    } catch (error) {
      console.error("Failed to update avatar:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-medium text-gray-600 mb-6">My Profile</h2>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={avatarUrl || user?.avatar_url || ""}
              alt="Profile"
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <button
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
            onClick={() => setIsFileManagerOpen(true)}
            type="button"
          >
            <Edit2 className="w-5 h-5 text-white" />
          </button>
        </div>

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

        {/* <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Edit2 className="w-4 h-4" />
          Edit
        </Button> */}
      </div>

      <FileManagerModal
        open={isFileManagerOpen}
        onOpenChange={setIsFileManagerOpen}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}
