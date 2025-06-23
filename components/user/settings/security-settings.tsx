"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordValidation {
  hasUppercase: boolean;
  hasNumber: boolean;
  hasMinLength: boolean;
}

interface SecuritySettingsProps {
  onPasswordUpdate?: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
}

export function SecuritySettings({ onPasswordUpdate }: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation
  const validatePassword = (password: string): PasswordValidation => {
    return {
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasMinLength: password.length >= 8,
    };
  };

  const passwordValidation = validatePassword(newPassword);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword.length > 0;

  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    if (currentPasswordError) {
      setCurrentPasswordError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    if (!isPasswordValid) {
      return;
    }

    if (!passwordsMatch) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await onPasswordUpdate?.(currentPassword, newPassword);
      if (success === false) {
        setCurrentPasswordError(true);
      } else {
        // Reset form on success
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Password update failed:", error);
      setCurrentPasswordError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Security</h2>
        <p className="text-sm text-gray-500">
          Manage your account security and personal information
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-base font-medium text-gray-700 mb-6">
            Update Password
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-sm font-medium text-gray-700"
              >
                Verify it&apos;s you
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => handleCurrentPasswordChange(e.target.value)}
                  placeholder="Please enter current Password"
                  className={cn(
                    "pl-10 pr-10",
                    currentPasswordError &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {currentPasswordError && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600">Incorrect Password</span>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Forgot Password
                  </button>
                </div>
              )}
              {!currentPasswordError && (
                <p className="text-xs text-gray-500">
                  For security, re-enter your password to continue.
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700"
              >
                New Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Please enter current Password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>

              {newPassword && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    Weak password. Must contain at least:
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      {passwordValidation.hasUppercase ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-gray-400" />
                      )}
                      <span
                        className={
                          passwordValidation.hasUppercase
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        At least 1 uppercase
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordValidation.hasNumber ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-gray-400" />
                      )}
                      <span
                        className={
                          passwordValidation.hasNumber
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        At least 1 number
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordValidation.hasMinLength ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-gray-400" />
                      )}
                      <span
                        className={
                          passwordValidation.hasMinLength
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        At least 8 characters
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!newPassword && (
                <p className="text-xs text-gray-500">
                  For security, re-enter your password to continue.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Please enter current Password"
                  className={cn(
                    "pl-10 pr-10",
                    confirmPassword && !passwordsMatch && "border-red-500"
                  )}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-600">Passwords do not match</p>
              )}
              {!confirmPassword && (
                <p className="text-xs text-gray-500">
                  For security, re-enter your password to continue.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  !isPasswordValid ||
                  !passwordsMatch ||
                  isLoading
                }
                className="w-full sm:w-auto"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
