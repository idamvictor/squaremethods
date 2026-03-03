"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Camera, X, RotateCcw } from "lucide-react";

interface PhotoCaptureProps {
  onCapture: (file: File) => void;
}

export function PhotoCapture({ onCapture }: PhotoCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );

  const startCamera = () => {
    try {
      setError(null);
      setIsCameraActive(true);
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      try {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setCapturedImage(imageSrc);
        }
      } catch (err) {
        setError("Failed to capture photo. Please try again.");
        console.error("Capture error:", err);
      }
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const uploadPhoto = () => {
    if (capturedImage) {
      // Convert data URL to blob
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const timestamp = new Date().getTime();
          const file = new File([blob], `photo-${timestamp}.jpg`, {
            type: "image/jpeg",
          });
          onCapture(file);
          stopCamera();
        })
        .catch((err) => {
          setError("Failed to process photo. Please try again.");
          console.error("Upload error:", err);
        });
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button
          onClick={() => {
            setError(null);
            setCapturedImage(null);
            setIsCameraActive(false);
          }}
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!isCameraActive && !capturedImage) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
        <Button onClick={startCamera} variant="outline" className="w-full">
          <>
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </>
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Tap to open your device camera
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isCameraActive && !capturedImage && (
        <div className="relative space-y-4">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: facingMode,
            }}
            className="h-96 w-full rounded-lg border border-border object-cover"
          />
          <div className="flex gap-2">
            <Button onClick={capturePhoto} className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Capture Photo
            </Button>
            <Button
              onClick={toggleFacingMode}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Switch Camera
            </Button>
            <Button onClick={stopCamera} variant="outline" className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="space-y-4">
          <div className="relative h-80 w-full overflow-hidden rounded-lg border border-border">
            <Image
              src={capturedImage}
              alt="Captured photo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={uploadPhoto} className="flex-1">
              Upload Photo
            </Button>
            <Button
              onClick={() => setCapturedImage(null)}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button onClick={stopCamera} variant="outline" className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
