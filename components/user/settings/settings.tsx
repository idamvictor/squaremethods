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

  const handleSavePersonalInfo = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        first_name: personalInfo.firstName,
        last_name: personalInfo.lastName,
        phone: personalInfo.phone,
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
                      profileData?.data?.avatar_url ||
                      "/placeholder.svg?height=64&width=64"
                    }
                    isVerified={profileData?.data?.email_verified || false}
                    onEdit={handleEditProfile}
                  />
                )}
              </div>

              <PersonalInformationForm
                data={personalInfo}
                onEdit={handleEditPersonalInfo}
                onChange={setPersonalInfo}
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
