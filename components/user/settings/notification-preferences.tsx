"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationSettings {
  newTask: boolean;
  teamMemberAdded: boolean;
  sopCreated1: boolean;
  sopCreated2: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
}

interface NotificationPreferencesProps {
  settings?: NotificationSettings;
  onSettingsChange?: (settings: NotificationSettings) => void;
}

const defaultSettings: NotificationSettings = {
  newTask: false,
  teamMemberAdded: true,
  sopCreated1: true,
  sopCreated2: true,
  desktopNotifications: false,
  emailNotifications: true,
};

export function NotificationPreferences({
  settings = defaultSettings,
  onSettingsChange,
}: NotificationPreferencesProps) {
  const [localSettings, setLocalSettings] =
    useState<NotificationSettings>(settings);

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Notification Preferences
        </h2>
        <p className="text-sm text-gray-500">
          Choose where and how you receive alerts. Changes save automatically
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-base font-medium text-gray-700 mb-4">
            Notify me when
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="newTask"
                checked={localSettings.newTask}
                onCheckedChange={(checked) =>
                  updateSetting("newTask", checked as boolean)
                }
              />
              <Label
                htmlFor="newTask"
                className="text-sm text-gray-700 cursor-pointer"
              >
                New task is added
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="teamMemberAdded"
                checked={localSettings.teamMemberAdded}
                onCheckedChange={(checked) =>
                  updateSetting("teamMemberAdded", checked as boolean)
                }
              />
              <Label
                htmlFor="teamMemberAdded"
                className="text-sm text-gray-700 cursor-pointer"
              >
                A team member is added
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="sopCreated1"
                checked={localSettings.sopCreated1}
                onCheckedChange={(checked) =>
                  updateSetting("sopCreated1", checked as boolean)
                }
              />
              <Label
                htmlFor="sopCreated1"
                className="text-sm text-gray-700 cursor-pointer"
              >
                An SOP is created
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="sopCreated2"
                checked={localSettings.sopCreated2}
                onCheckedChange={(checked) =>
                  updateSetting("sopCreated2", checked as boolean)
                }
              />
              <Label
                htmlFor="sopCreated2"
                className="text-sm text-gray-700 cursor-pointer"
              >
                An SOP is created
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="space-y-1">
              <Label
                htmlFor="desktopNotifications"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                Desktop Notification
              </Label>
              <p className="text-sm text-gray-500">
                Receive Desktop notification every time, you&apos;re tagged.
              </p>
            </div>
            <Switch
              id="desktopNotifications"
              checked={localSettings.desktopNotifications}
              onCheckedChange={(checked) =>
                updateSetting("desktopNotifications", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="space-y-1">
              <Label
                htmlFor="emailNotifications"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                Email Notifications
              </Label>
              <p className="text-sm text-gray-500">
                Receive all notifications via your email address
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={localSettings.emailNotifications}
              onCheckedChange={(checked) =>
                updateSetting("emailNotifications", checked)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
