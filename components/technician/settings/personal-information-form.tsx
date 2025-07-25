import { Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  id: string
  label: string
  value: string
  type?: string
}

function FormField({ id, label, value, type = "text" }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input id={id} type={type} defaultValue={value} className="bg-gray-50" readOnly />
    </div>
  )
}

export function PersonalInformationForm() {
  const formFields = [
    { id: "firstName", label: "First Name", value: "Neme John" },
    { id: "lastName", label: "Last Name", value: "Neme John" },
    { id: "email", label: "Email Address", value: "NemeJohn@gmail.com", type: "email" },
    { id: "phone", label: "Phone Number", value: "0700000000000" },
    { id: "department", label: "Department", value: "Team Manager" },
  ]

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-600">Personal Information</h3>
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
  )
}
