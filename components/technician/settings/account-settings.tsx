"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabNavigation } from "./tab-navigation";
import { ProfileSection } from "./profile-section";
import { PersonalInformationForm } from "./personal-information-form";
import { NotificationPreferences } from "./notification-preferences";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl  p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Account Settings
          </h1>
          <Button variant="outline" className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Log out
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
