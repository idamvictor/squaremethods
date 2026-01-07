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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Copy } from "lucide-react";
import { toast } from "sonner";
import { InvitationsList } from "./invitations-list";
import {
  useSendInvitations,
  useGenerateInvitationLink,
} from "@/services/invitations/invitation-queries";

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteSuccess?: (emails: string[], role: string) => void;
}

export function InviteUserModal({
  open,
  onOpenChange,
  onInviteSuccess,
}: InviteUserModalProps) {
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState<
    "owner" | "admin" | "editor" | "viewer" | "technician"
  >("viewer");
  const [expiresInDays, setExpiresInDays] = useState(7);

  const sendInvitationsMutation = useSendInvitations();
  const generateLinkMutation = useGenerateInvitationLink();

  const handleSendInvites = async () => {
    if (!emails.trim()) {
      toast("Please enter at least one email address");
      return;
    }

    const emailList = emails
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    try {
      await sendInvitationsMutation.mutateAsync({
        emails: emailList,
        role,
        expires_in_days: expiresInDays,
      });

      toast(
        `Successfully sent ${emailList.length} invitation${
          emailList.length > 1 ? "s" : ""
        }`
      );

      onInviteSuccess?.(emailList, role);
      setEmails("");
    } catch (err) {
      console.error("Failed to send invitations:", err);
      toast("Failed to send invitations");
    }
  };

  const handleGenerateLink = async () => {
    const emailList = emails
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    try {
      const result = await generateLinkMutation.mutateAsync({
        emails: emailList,
        role,
        expires_in_days: expiresInDays,
      });

      await navigator.clipboard.writeText(result.data.link);
      toast("Invitation link copied to clipboard");
    } catch (err) {
      console.error("Failed to generate link:", err);
      toast("Failed to generate invitation link");
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
          {/* Role Selection and Expiration - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Select Role
              </Label>
              <Select
                value={role}
                onValueChange={(
                  value: "owner" | "admin" | "editor" | "viewer" | "technician"
                ) => setRole(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Expires in (days)
              </Label>
              <Input
                type="number"
                min="1"
                value={expiresInDays}
                onChange={(e) =>
                  setExpiresInDays(parseInt(e.target.value) || 7)
                }
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Email Invitation Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Emails (Comma separated)
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Emails, Comma for separation"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleSendInvites}
                disabled={sendInvitationsMutation.isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                {sendInvitationsMutation.isPending ? "Sending..." : "Send"}
              </Button>
              <Button
                onClick={handleGenerateLink}
                disabled={generateLinkMutation.isPending}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Invitations List Section */}
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
