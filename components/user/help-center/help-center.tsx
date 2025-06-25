import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Sparkles,
  FileText,
  Building,
  Network,
  ClipboardList,
  Tag,
} from "lucide-react";

export default function HelpCenter() {
  const helpCategories = [
    {
      icon: FileText,
      title: "Accessing/ creating account?",
      description:
        "Billing, security, access control, and more account management features.",
    },
    {
      icon: Building,
      title: "Company Account",
      description:
        "Billing, security, access control, and more account management features.",
    },
    {
      icon: Network,
      title: "Equipment Hierarchy",
      description:
        "Billing, security, access control, and more account management features.",
    },
    {
      icon: ClipboardList,
      title: "Task",
      description:
        "Billing, security, access control, and more account management features.",
    },
    {
      icon: Tag,
      title: "Subscription",
      description:
        "Learn how to subscribe properly and which plan is suitable for your business scale",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Help Centers</h1>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-blue-600" />
              </div>
              <Sparkles className="w-4 h-4 text-blue-600 absolute -top-1 -right-1" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Help for every step, everyday
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Access guided assistance, browse the help center, watch tutorial
                videos, and connect with the CRM community. Get all the
                resources you need right here
              </p>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            What is your category of difficulty
          </h3>
          <p className="text-gray-600 mb-8">
            Find a solution for each category of difficulties you have
            encountered
          </p>
        </div>

        {/* Help Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={index}
                className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-gray-600" />
                  </div>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {category.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    View detail
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
