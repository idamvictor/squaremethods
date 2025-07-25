"use client"

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "profile", label: "My Profile" },
    { id: "notification", label: "Notification" },
  ]

  return (
    <div className="flex mb-8">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 text-sm font-medium border-t border-b ${
            index === 0 ? "rounded-l-lg border-l" : "rounded-r-lg border-r"
          } ${
            activeTab === tab.id
              ? "bg-gray-200 text-gray-900 border-gray-300"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
