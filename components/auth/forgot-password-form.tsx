"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const [language, setLanguage] = useState("en-US");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate server validation error (for demo purposes)
      // In a real app, you would check if the email exists in your database
      if (data.email === "test@example.com") {
        setServerError(
          "This email isn't associated with an account, try another email"
        );
        return;
      }

      // Handle successful submission
      console.log("Password reset email sent to:", data.email);
      // Redirect or show success message
    } catch (error) {
      setServerError("An error occurred. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-sm font-medium text-gray-600">
            SQUAREMETHODS
          </span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot password
            </h1>
            <p className="text-gray-600">
              A 6-digit code would be sent to your email to confirm this is you
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="s.m@gmail.com"
                        className={`border-2 rounded-xl h-12 ${
                          fieldState.error || serverError
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-blue-500"
                        }`}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (serverError) setServerError(null);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                    {serverError && (
                      <div className="flex items-start mt-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                        <p className="text-red-500 text-sm">{serverError}</p>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Continue"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                  Sign In
                </Link>
              </div>
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
  );
}
