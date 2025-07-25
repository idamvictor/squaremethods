"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

interface NotificationItemProps {
  title: string
  description: string
  checked: boolean
  onToggle: () => void
  showBorder?: boolean
}

function NotificationItem({ title, description, checked, onToggle, showBorder = true }: NotificationItemProps) {
  return (
    <div className={`flex items-center justify-between py-4 ${showBorder ? "border-b border-gray-100" : ""}`}>
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} aria-label={`Toggle ${title.toLowerCase()}`} />
    </div>
  )
}

export function NotificationPreferences() {
  const [notifications, setNotifications] = useState({
    newTask: false,
    desktop: false,
    email: true,
  })

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const notificationItems = [
    {
      key: "newTask" as const,
      title: "New task is added",
      description: "Notify me when a new task is added",
    },
    {
      key: "desktop" as const,
      title: "Desktop Notification",
      description: "Receive Desktop notification every time, you're tagged.",
    },
    {
      key: "email" as const,
      title: "Email Notifications",
      description: "Receive all notifications via your email address",
    },
  ]

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Notification Preferences</h2>
        <p className="text-sm text-gray-500">Choose where and how you receive alerts. Changes save automatically</p>
      </div>

      <div className="space-y-6">
        {notificationItems.map((item, index) => (
          <NotificationItem
            key={item.key}
            title={item.title}
            description={item.description}
            checked={notifications[item.key]}
            onToggle={() => handleNotificationChange(item.key)}
            showBorder={index < notificationItems.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
