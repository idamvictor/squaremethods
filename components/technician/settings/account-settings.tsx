"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabNavigation } from "./tab-navigation";
import { ProfileSection } from "./profile-section";
import { PersonalInformationForm } from "./personal-information-form";
import { NotificationPreferences } from "./notification-preferences";
import { useLogout } from "@/lib/api/auth";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="  p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Account Settings
          </h1>
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="w-4 h-4" />
            {logout.isPending ? "Logging out..." : "Log out"}
          </Button>
        </div>

        {/* Navigation Tabs */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            <ProfileSection />
            <PersonalInformationForm />
          </div>
        )}
        {activeTab === "notification" && <NotificationPreferences />}
      </div>
    </div>
  );
}
