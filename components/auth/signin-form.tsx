"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Globe, Lock } from "lucide-react";
import { useLogin } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const router = useRouter();
  const { mutate: login, isPending: isLoading } = useLogin();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    login(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <Image
            src="https://res.cloudinary.com/dyp8gtllq/image/upload/v1749653962/image-removebg-preview_p37kee.png"
            alt="Squaremethods Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
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
              Welcome back to squaremethods
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-sm font-medium text-foreground">
                        Password *
                      </FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
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
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal text-muted-foreground">
                        Keep me logged in
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="text-sm text-muted-foreground">
                By clicking continue, you agree to accept Texture&apos;s{" "}
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
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Continue"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-6 text-sm text-muted-foreground">
        <span>© 2025 Squaremethods - All Rights Reserved</span>
        <Link
          href="#"
          className="hover:text-foreground flex items-center gap-1"
        >
          <span>Help Center</span>
        </Link>
      </div>
    </div>
  );
}
