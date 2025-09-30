"use client";

import { useState } from "react";
import { PageHeader } from "./header";
import { Sidebar } from "./sidebar";
import { ProfileHeader } from "./profile-header";
import { PersonalInformationForm } from "./personal-information-form";
import { NotificationPreferences } from "./notification-preferences";
import { SecuritySettings } from "./security-settings";
import DeleteAccount from "./delete-account";
import { CompanySettings } from "./company-settings";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Neme John",
    lastName: "Neme John",
    email: "Neme.John@gmail.com",
    phone: "07000000000000",
    department: "Team Manager",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newTask: false,
    teamMemberAdded: true,
    sopCreated1: true,
    sopCreated2: true,
    desktopNotifications: false,
    emailNotifications: true,
  });

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleEditProfile = () => {
    console.log("Editing profile...");
  };

  const handleEditPersonalInfo = () => {
    console.log("Editing personal information...");
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <PageHeader title="Account Settings" onLogout={handleLogout} />

      <div className="flex">
        <Sidebar activeItem={activeSection} onItemClick={handleSectionChange} />

        <main className="flex-1 p-6">
          {activeSection === "profile" && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-medium text-gray-500 mb-6">
                  My Profile
                </h2>

                <ProfileHeader
                  name="Neme John"
                  role="Team Manager"
                  location="Head quarters"
                  avatarUrl="/placeholder.svg?height=64&width=64"
                  isVerified={true}
                  onEdit={handleEditProfile}
                />
              </div>

              <PersonalInformationForm
                data={personalInfo}
                onEdit={handleEditPersonalInfo}
                onChange={setPersonalInfo}
              />
            </div>
          )}

          {activeSection === "security" && (
            <SecuritySettings
              onPasswordUpdate={async (currentPassword /*newPassword*/) => {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // Simulate incorrect password for demo (return false for "wrong" password)
                if (currentPassword === "wrong") {
                  return false;
                }
                console.log("Password updated successfully");
                return true;
              }}
            />
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
