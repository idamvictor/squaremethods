"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff, Check, X, Globe, Lock } from "lucide-react";
import { useRegister } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyUserName: z.string().min(1, "Company's User Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please ensure that this is a complete email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/\d/, "Password must contain at least 1 number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character"
    ),
});

type FormData = z.infer<typeof formSchema>;

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const router = useRouter();

  const { mutate: register, isPending: isRegistering } = useRegister();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      companyUserName: "",
      email: "",
      password: "",
    },
  });

  const password = form.watch("password");

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "1 uppercase", met: /[A-Z]/.test(password) },
    { text: "1 lowercase", met: /[a-z]/.test(password) },
    { text: "1 number", met: /\d/.test(password) },
    { text: "1 special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  // Debug form state
  console.log("Form State:", {
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
    values: form.getValues(),
  });

  const onSubmit = async (data: FormData) => {
    try {
      register(
        {
          first_name: data.firstName,
          last_name: data.lastName,
          company_name: data.companyUserName,
          company_email: data.email,
          company_address: "Not provided", // You might want to add this to the form
          email: data.email,
          password: data.password,
          phone: "Not provided", // You might want to add this to the form
        },
        {
          onSuccess: () => {
            toast.success("Registration successful!");
            router.push("/dashboard");
          },
          onError: (
            error: Error & { response?: { data?: { message?: string } } }
          ) => {
            const message =
              error?.response?.data?.message ||
              "Registration failed. Please try again.";
            toast.error(message);
          },
        }
      );
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
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
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Turn Tribal Knowledge into Digital Standard Work
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        First name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Square"
                          className={`border-input focus:border-ring focus:ring-ring ${
                            fieldState.error
                              ? "border-destructive focus:border-destructive focus:ring-destructive"
                              : ""
                          }`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">
                        Last Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Method"
                          className={`border-input focus:border-ring focus:ring-ring ${
                            fieldState.error
                              ? "border-destructive focus:border-destructive focus:ring-destructive"
                              : ""
                          }`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="companyUserName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Company&apos;s User Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="square.acme"
                        className={`border-input focus:border-ring focus:ring-ring ${
                          fieldState.error
                            ? "border-destructive focus:border-destructive focus:ring-destructive"
                            : ""
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Email Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="s.m@gmail.com"
                        className={`border-input focus:border-ring focus:ring-ring ${
                          fieldState.error
                            ? "border-destructive focus:border-destructive focus:ring-destructive"
                            : ""
                        }`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Password *
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Squaremethod"
                            className={`pl-10 pr-12 h-12 border-2 rounded-xl ${
                              fieldState.error
                                ? "border-destructive focus:border-destructive"
                                : "border-input focus:border-ring"
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
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>

                        {/* Password Strength Progress Bar */}
                        {field.value && (
                          <div className="space-y-2">
                            <div className="flex space-x-1">
                              {Array.from({ length: 6 }, (_, index) => {
                                const metCriteria = passwordRequirements.filter(
                                  (req) => req.met
                                ).length;
                                const progressSegments = Math.ceil(
                                  (metCriteria / passwordRequirements.length) *
                                    6
                                );

                                let segmentColor = "bg-input";
                                if (index < progressSegments) {
                                  if (metCriteria >= 4) {
                                    segmentColor = "bg-primary";
                                  } else if (metCriteria >= 2) {
                                    segmentColor = "bg-warning";
                                  } else {
                                    segmentColor = "bg-destructive";
                                  }
                                }

                                return (
                                  <div
                                    key={index}
                                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${segmentColor}`}
                                    role="progressbar"
                                    aria-valuenow={metCriteria}
                                    aria-valuemin={0}
                                    aria-valuemax={passwordRequirements.length}
                                  />
                                );
                              })}
                            </div>

                            <div className="text-sm font-medium text-muted-foreground">
                              {passwordRequirements.filter((req) => req.met)
                                .length >= 4
                                ? "Strong password"
                                : passwordRequirements.filter((req) => req.met)
                                    .length >= 2
                                ? "Medium password"
                                : "Weak password"}
                              . Must contain at least:
                            </div>
                          </div>
                        )}

                        {/* Password Criteria Checklist */}
                        {field.value && (
                          <div className="space-y-2">
                            {passwordRequirements.map((req, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                {req.met ? (
                                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-primary">
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-input">
                                    <X className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                )}
                                <span
                                  className={`text-sm ${
                                    req.met
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {req.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {fieldState.error && (
                          <p className="text-sm text-destructive" role="alert">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="text-sm text-muted-foreground">
                By clicking continue, you agree to accept Squaremethods{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and the{" "}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium"
                disabled={isRegistering || !form.formState.isValid}
              >
                {isRegistering ? "Creating account..." : "Continue"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-6 text-sm text-muted-foreground">
        <span>© 2025 Squaremethods - All Rights Reserved</span>
        <Link href="#" className="hover:text-foreground">
          Help Center
        </Link>
      </div>
    </div>
  );
}
