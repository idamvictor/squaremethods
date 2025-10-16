import { Edit2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile, useUpdateProfile } from "@/services/users/users-querries";
import { toast } from "sonner";

interface FormField {
  id: string;
  name: string;
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;
}

export function PersonalInformationForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: profileData, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const user = profileData?.data;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || "",
      });
    }
  };

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

  const formFields: FormField[] = [
    {
      id: "first_name",
      name: "first_name",
      label: "First Name",
      value: isEditing ? formData.first_name : user?.first_name || "",
    },
    {
      id: "last_name",
      name: "last_name",
      label: "Last Name",
      value: isEditing ? formData.last_name : user?.last_name || "",
    },
    {
      id: "email",
      name: "email",
      label: "Email Address",
      value: user?.email || "",
      type: "email",
      disabled: true,
    },
    {
      id: "phone",
      name: "phone",
      label: "Phone Number",
      value: isEditing ? formData.phone : user?.phone || "",
    },
    {
      id: "role",
      name: "role",
      label: "Role",
      value: user?.role || "",
      disabled: true,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-600">
            Personal Information
          </h3>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="gap-2"
                  disabled={updateProfileMutation.isPending}
                >
                  <Save className="w-4 h-4" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((field, index) => (
            <div key={field.id} className={index === 4 ? "md:col-span-1" : ""}>
              <div className="space-y-2">
                <Label
                  htmlFor={field.id}
                  className="text-sm font-medium text-gray-700"
                >
                  {field.label}
                </Label>
                <Input
                  id={field.id}
                  name={field.name}
                  type={field.type || "text"}
                  value={field.value}
                  onChange={handleInputChange}
                  className={field.disabled ? "bg-gray-50" : "bg-white"}
                  disabled={!isEditing || field.disabled}
                  readOnly={!isEditing || field.disabled}
                />
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
