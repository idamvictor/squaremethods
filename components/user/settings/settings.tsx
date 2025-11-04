"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "./header";
import { Sidebar } from "./sidebar";
import { ProfileHeader } from "./profile-header";
import { PersonalInformationForm } from "./personal-information-form";
import { NotificationPreferences } from "./notification-preferences";
import { SecuritySettings } from "./security-settings";
import DeleteAccount from "./delete-account";
import { CompanySettings } from "./company-settings";
import { useProfile, useUpdateProfile } from "@/services/users/users-querries";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  // Fetch user profile data
  const { data: profileData, isLoading } = useProfile();

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    avatarUrl: "",
    hasAvatarChanges: false,
  });

  // Update personal info when profile data is loaded
  useEffect(() => {
    if (profileData?.data) {
      setPersonalInfo({
        firstName: profileData.data.first_name,
        lastName: profileData.data.last_name,
        email: profileData.data.email,
        phone: profileData.data.phone || "",
        department: profileData.data.role,
        avatarUrl: profileData.data.avatar_url || "",
        hasAvatarChanges: false,
      });
    }
  }, [profileData]);

  const [notificationSettings, setNotificationSettings] = useState({
    newTask: false,
    teamMemberAdded: true,
    sopCreated1: true,
    sopCreated2: true,
    desktopNotifications: false,
    emailNotifications: true,
  });

  const updateProfileMutation = useUpdateProfile();

  const handleEditProfile = () => {
    // This function can be used to trigger edit mode if needed
    console.log("Editing profile...");
  };

  const handleEditPersonalInfo = () => {
    // This function can be used to enable edit mode
    console.log("Enabling edit mode...");
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    setPersonalInfo((prev) => ({
      ...prev,
      avatarUrl: newAvatarUrl,
      hasAvatarChanges: true,
    }));
  };

  const handleSaveAvatar = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        avatar_url: personalInfo.avatarUrl,
      });
      setPersonalInfo((prev) => ({
        ...prev,
        hasAvatarChanges: false,
      }));
      // You might want to show a success toast here
      console.log("Avatar updated successfully");
    } catch (error) {
      // Handle error appropriately
      console.error("Failed to update avatar:", error);
    }
  };

  const handleSavePersonalInfo = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        first_name: personalInfo.firstName,
        last_name: personalInfo.lastName,
        phone: personalInfo.phone,
        avatar_url: personalInfo.avatarUrl,
      });
      // You might want to show a success toast here
      console.log("Profile updated successfully");
    } catch (error) {
      // Handle error appropriately
      console.error("Failed to update profile:", error);
    }
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <PageHeader title="Account Settings" />

      <div className="flex">
        <Sidebar activeItem={activeSection} onItemClick={handleSectionChange} />

        <main className="flex-1 p-6">
          {activeSection === "profile" && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-medium text-gray-500 mb-6">
                  My Profile
                </h2>

                {isLoading ? (
                  <div>Loading profile...</div>
                ) : (
                  <ProfileHeader
                    name={`${personalInfo.firstName} ${personalInfo.lastName}`}
                    role={personalInfo.department}
                    location={
                      profileData?.data?.company?.name || "Head quarters"
                    }
                    avatarUrl={
                      personalInfo.avatarUrl ||
                      "/placeholder.svg?height=64&width=64"
                    }
                    isVerified={profileData?.data?.email_verified || false}
                    onEdit={handleEditProfile}
                    onAvatarChange={handleAvatarChange}
                    onSave={handleSaveAvatar}
                    isSaving={updateProfileMutation.isPending}
                    hasChanges={personalInfo.hasAvatarChanges}
                  />
                )}
              </div>

              <PersonalInformationForm
                data={{
                  firstName: personalInfo.firstName,
                  lastName: personalInfo.lastName,
                  email: personalInfo.email,
                  phone: personalInfo.phone,
                  department: personalInfo.department,
                }}
                onEdit={handleEditPersonalInfo}
                onChange={(data) =>
                  setPersonalInfo((prev) => ({ ...prev, ...data }))
                }
                onSave={handleSavePersonalInfo}
                isSaving={updateProfileMutation.isPending}
              />
            </div>
          )}

          {activeSection === "security" && profileData?.data && (
            <SecuritySettings userId={profileData.data.id} />
          )}

          {activeSection === "notification" && (
            <NotificationPreferences
              settings={notificationSettings}
              onSettingsChange={setNotificationSettings}
            />
          )}

          {activeSection === "company" && <CompanySettings />}

          {activeSection === "delete" && <DeleteAccount />}
        </main>
      </div>
    </div>
  );
}
