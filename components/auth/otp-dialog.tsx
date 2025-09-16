import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSendOtp, useVerifyOtp } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

interface OTPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess?: () => void;
}

export function OTPDialog({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
}: OTPDialogProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(270); // 4:30 minutes in seconds
  const router = useRouter();

  const { mutate: sendOtp, isPending: isSending } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();

  // Timer functionality
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Format time remaining
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Handle input changes
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(
        `input[name="otp-${index + 1}"]`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  // Handle verification
  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return;

    verifyOtp(
      { email, otp: otpString },
      {
        onSuccess: () => {
          onVerificationSuccess?.();
          onClose();
          router.push("/dashboard");
        },
      }
    );
  };

  // Handle resend
  const handleResend = () => {
    sendOtp({ email });
    setTimeLeft(270); // Reset timer
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            You are almost there!
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <p className="text-center text-gray-600">
            A 6-digit confirmation code has been sent to
            <br />
            <span className="text-blue-600">{email}</span> to complete your
            registration.
          </p>

          {/* OTP Input Fields */}
          <div className="flex gap-2 mt-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                name={`otp-${index}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-center text-2xl border rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                maxLength={1}
                pattern="\d*"
              />
            ))}
          </div>

          {/* Timer and Resend */}
          <div className="text-sm text-gray-600">
            Code expires in{" "}
            <span className="text-red-500">{formattedTime}</span>
          </div>

          {timeLeft === 0 && (
            <button
              onClick={handleResend}
              disabled={isSending}
              className="text-blue-600 hover:text-blue-800"
            >
              Resend Code
            </button>
          )}

          {/* Continue Button */}
          <Button
            onClick={handleVerify}
            disabled={otp.join("").length !== 6 || isVerifying}
            className="w-full"
          >
            {isVerifying ? "Verifying..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
