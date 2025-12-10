"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, Send, User, Edit, Shield } from "lucide-react";
import { toast } from "sonner";
import { InvitationsList } from "./invitations-list";

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteSuccess?: (emails: string[], role: string) => void;
}

interface AccessLevel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const accessLevels: AccessLevel[] = [
  {
    id: "view",
    name: "Viewer",
    description: "Any one with this link can access as a viewer",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: "editor",
    name: "Editor",
    description: "Any one with this link can access as a editor",
    icon: <Edit className="h-4 w-4" />,
  },
  {
    id: "admin",
    name: "Admin",
    description: "Any one with this link can access as a Admin",
    icon: <Shield className="h-4 w-4" />,
  },
];

export function InviteUserModal({
  open,
  onOpenChange,
  onInviteSuccess,
}: InviteUserModalProps) {
  const [emails, setEmails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInvites = async () => {
    if (!emails.trim()) {
      toast("Please enter at least one email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const emailList = emails
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    toast(
      `Successfully sent ${emailList.length} invitation${
        emailList.length > 1 ? "s" : ""
      }`
    );

    onInviteSuccess?.(emailList, "viewer");
    setEmails("");
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleCopyLink = async (accessLevel: string) => {
    const link = `${window.location.origin}/invite?role=${accessLevel}&token=abc123`;

    try {
      await navigator.clipboard.writeText(link);
      toast(`${accessLevel} access link copied to clipboard`);
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast("Failed to copy link to clipboard");
    }
  };

  const handleDone = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Share to Selection &apos;Profile&apos;
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Email Invitation Section */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Emails, Comma for separation"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={handleSendInvites} disabled={isLoading}>
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Grant Access Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Grant access as
            </Label>

            <div className="space-y-3">
              {accessLevels.map((level) => (
                <div
                  key={level.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      {level.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{level.name}</div>
                      <div className="text-xs text-gray-500">
                        {level.description}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(level.id)}
                    className="text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy link
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Invitations List Section */}
          <Separator />
          <div className="max-h-64 overflow-y-auto">
            <InvitationsList />
          </div>

          {/* Done Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleDone}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
