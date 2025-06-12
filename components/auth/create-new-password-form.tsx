"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Eye, EyeOff, Globe, Lock, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .regex(/\d/, "Password must contain at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof formSchema>

export function CreateNewPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [language, setLanguage] = useState("en-US")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const password = form.watch("password")

  const passwordRequirements = [
    { text: "At least 1 uppercase", met: /[A-Z]/.test(password) },
    { text: "At least 1 number", met: /\d/.test(password) },
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "At least 1 special character", met: /[^A-Za-z0-9]/.test(password) },
  ]

  const passwordStrength = useMemo(() => {
    const metCriteria = passwordRequirements.filter((req) => req.met).length

    if (metCriteria === 0) return { strength: 0, color: "" }
    if (metCriteria === 1) return { strength: 1, color: "bg-red-500" }
    if (metCriteria === 2) return { strength: 2, color: "bg-red-500" }
    if (metCriteria === 3) return { strength: 3, color: "bg-yellow-500" }
    return { strength: 4, color: "bg-green-500" }
  }, [password])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Password updated successfully:", data)
      // Redirect or show success message
    } catch (error) {
      console.error("Error updating password:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-sm font-medium text-gray-600">SQUAREMETHODS</span>
        </div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-auto border-none shadow-none">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English (US)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create new password</h1>
            <p className="text-gray-600">
              Create a new password with at least 8 characters, different from your previous one.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Password *</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Squaremethod"
                            className={`pl-10 pr-12 h-12 border-2 rounded-xl ${
                              fieldState.error
                                ? "border-red-500 focus:border-red-500"
                                : "border-blue-200 focus:border-blue-500"
                            }`}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>

                        {/* Password Strength Progress Bar */}
                        {field.value && (
                          <div className="space-y-2">
                            <div className="flex space-x-1">
                              {Array.from({ length: 4 }, (_, index) => (
                                <div
                                  key={index}
                                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                    index < passwordStrength.strength ? passwordStrength.color : "bg-gray-200"
                                  }`}
                                  role="progressbar"
                                  aria-valuenow={passwordStrength.strength}
                                  aria-valuemin={0}
                                  aria-valuemax={4}
                                />
                              ))}
                            </div>

                            <div
                              className={`text-sm font-medium ${
                                passwordStrength.strength === 4
                                  ? "text-green-600"
                                  : passwordStrength.strength >= 3
                                    ? "text-yellow-600"
                                    : passwordStrength.strength > 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                              }`}
                            >
                              {passwordStrength.strength === 4
                                ? "Strong password"
                                : passwordStrength.strength >= 3
                                  ? "Medium password"
                                  : passwordStrength.strength > 0
                                    ? "Weak password"
                                    : "Enter password"}
                            </div>
                          </div>
                        )}

                        {/* Password Criteria Checklist */}
                        {field.value && (
                          <div className="space-y-2">
                            {passwordRequirements.map((req, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                {req.met ? (
                                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-300">
                                    <X className="h-3 w-3 text-gray-500" />
                                  </div>
                                )}
                                <span className={`text-sm ${req.met ? "text-green-600" : "text-gray-500"}`}>
                                  {req.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <FormMessage className="text-red-500 text-sm" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Confirm Password *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          className={`pl-10 pr-12 h-12 border-2 rounded-xl ${
                            fieldState.error
                              ? "border-red-500 focus:border-red-500"
                              : "border-blue-200 focus:border-blue-500"
                          }`}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Continue"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-6 text-sm text-gray-500">
        <span>© 2025 Squaremethods - All Rights Reserved</span>
        <Link href="#" className="hover:text-gray-700 flex items-center gap-1">
          <span>Help Center</span>
        </Link>
      </div>
    </div>
  )
}
