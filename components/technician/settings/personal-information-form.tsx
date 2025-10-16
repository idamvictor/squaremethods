import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/services/users/users-querries";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  type?: string;
}

function FormField({ id, label, value, type = "text" }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        defaultValue={value}
        className="bg-gray-50"
        readOnly
      />
    </div>
  );
}

export function PersonalInformationForm() {
  const { data: profileData, isLoading } = useProfile();
  const user = profileData?.data;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formFields = [
    { id: "firstName", label: "First Name", value: user?.first_name || "" },
    { id: "lastName", label: "Last Name", value: user?.last_name || "" },
    {
      id: "email",
      label: "Email Address",
      value: user?.email || "",
      type: "email",
    },
    { id: "phone", label: "Phone Number", value: user?.phone || "" },
    { id: "role", label: "Role", value: user?.role || "" },
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-600">
          Personal Information
        </h3>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Edit2 className="w-4 h-4" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map((field, index) => (
          <div key={field.id} className={index === 4 ? "md:col-span-1" : ""}>
            <FormField {...field} />
          </div>
        ))}
      </div>
    </div>
  );
}
