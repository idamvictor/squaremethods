"use client";

import React, { useState, useRef, useEffect } from "react";
import Editor from "./editor";
import { AnnotationState, Renderer, MarkerArea } from "@markerjs/markerjs3";
import sampleImage from "@/public/sample-images/phone-modules.jpg";
import StepsGrid from "./steps-grid";
import { Button } from "@/components/ui/button";
import { useJobAidStore } from "@/store/job-aid-store";
import {
  useProceduresByJobAidId,
  usePrecautionsByJobAidId,
} from "@/services/job-aid/job-aid-queries";

interface ImageAnnotationManagerProps {
  type: "precaution" | "procedure";
}

interface Step {
  instruction: string;
  imageUrl: string;
  description: string;
}

interface EditorRefType {
  getEditor: () => MarkerArea | null;
}

export default function ImageAnnotationManager({
  type,
}: ImageAnnotationManagerProps) {
  const editorRef = useRef<EditorRefType>(null);
  const { currentJobAid } = useJobAidStore();
  const [annotation, setAnnotation] = useState<AnnotationState | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [savedSteps, setSavedSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Only fetch the data we need based on type
  const { data: proceduresData } = useProceduresByJobAidId(
    type === "procedure" && currentJobAid?.id ? currentJobAid.id : ""
  );

  const { data: precautionsData } = usePrecautionsByJobAidId(
    type === "precaution" && currentJobAid?.id ? currentJobAid.id : ""
  );

  // Load procedures/precautions based on type from API endpoints
  useEffect(() => {
    if (!currentJobAid) {
      setIsLoading(false);
      setSavedSteps([]);
      return;
    }

    try {
      let existingSteps: Step[] = [];

      if (type === "procedure") {
        // Load procedures from API endpoint
        console.log(
          "Loading procedures for type:",
          type,
          "Data:",
          proceduresData
        );
        if (proceduresData?.data && proceduresData.data.length > 0) {
          existingSteps = proceduresData.data.map((proc) => ({
            instruction: proc.instruction,
            imageUrl: proc.image,
            description: proc.instruction,
          }));
          console.log(
            `Loaded ${existingSteps.length} procedures for job aid ${currentJobAid.id}:`,
            existingSteps
          );
        } else {
          console.log(
            `No procedures found for job aid ${currentJobAid.id}`,
            proceduresData
          );
        }
      } else if (type === "precaution") {
        // Load precautions from API endpoint
        console.log(
          "Loading precautions for type:",
          type,
          "Data:",
          precautionsData
        );
        if (precautionsData?.data && precautionsData.data.length > 0) {
          existingSteps = precautionsData.data.map((prec) => ({
            instruction: prec.instruction,
            imageUrl: prec.image,
            description: prec.instruction,
          }));
          console.log(
            `Loaded ${existingSteps.length} precautions for job aid ${currentJobAid.id}:`,
            existingSteps
          );
        } else {
          console.log(
            `No precautions found for job aid ${currentJobAid.id}`,
            precautionsData
          );
        }
      }

      setSavedSteps(existingSteps);
    } catch (error) {
      console.error("Error loading existing steps:", error);
      setSavedSteps([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentJobAid, type, proceduresData, precautionsData]);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        instruction: "",
        imageUrl: sampleImage.src,
        description: "",
      },
    ]);
  };

  const updateStepInstruction = (index: number, instruction: string) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      instruction,
    };
    setSteps(newSteps);
  };

  const handleSaveDraft = async () => {
    if (steps.length === 0) {
      console.warn("No steps to save");
      return;
    }

    if (!currentJobAid) {
      console.error("No job aid selected");
      return;
    }

    try {
      // Get the annotated image from the editor
      let annotatedImageUrl = sampleImage.src;

      if (editorRef.current && annotation) {
        const editor = editorRef.current.getEditor?.();
        if (editor) {
          console.log("Editor found, rendering annotated image");
          const renderer = new Renderer();
          renderer.targetImage = editor.targetImage;
          renderer.naturalSize = true;
          renderer.imageType = "image/png";

          annotatedImageUrl = await renderer.rasterize(annotation);
          console.log(
            "Annotated image rendered:",
            annotatedImageUrl?.substring(0, 50)
          );
        }
      } else {
        console.warn("No editor or annotation found, using original image");
      }

      // Add all current steps to the saved steps list with annotated image and instruction as description
      const stepsWithAnnotation = steps.map((step) => ({
        ...step,
        imageUrl: annotatedImageUrl,
        description: step.instruction, // Use instruction as description for display
      }));

      setSavedSteps([...savedSteps, ...stepsWithAnnotation]);

      // TODO: Save to API when mutation hooks are implemented
      // For now, just update local state
      console.log(
        `Steps would be saved to ${type} endpoint for job aid ${currentJobAid.id}:`,
        stepsWithAnnotation
      );

      // Reset the editor for new steps
      setSteps([]);
      setAnnotation(null);

      console.log("Steps saved with annotated image:", stepsWithAnnotation);
    } catch (error) {
      console.error("Error saving steps:", error);
    }
  };

  const handlePublish = () => {
    console.log("Publishing:", {
      steps,
      annotation,
    });
  };

  const handleEditStep = (index: number) => {
    console.log("Editing step:", index);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = savedSteps.filter((_, i) => i !== index);
    setSavedSteps(newSteps);
  };

  // Show loading or error state if no job aid is selected
  if (!currentJobAid) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            Please select a job aid first before creating {type}s.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading {type}s...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {type === "precaution" ? "Create New Instruction" : "Create New Step"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Add annotations to your image to create clear visual instructions
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Image Annotation - 50% */}
          <div className="w-full lg:w-[60%] bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col gap-6 p-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Editor</h3>
                <div className="h-[600px] w-full rounded-lg border border-gray-200 overflow-hidden">
                  <Editor
                    ref={editorRef}
                    targetImageSrc={sampleImage.src}
                    annotation={annotation}
                    onSave={(newAnnotation) => {
                      setAnnotation(newAnnotation);
                      console.log("Annotation saved:", newAnnotation);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Instructions Form - 50% */}
          <div className="w-full lg:w-[40%] bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Procedures
                </h3>
                <p className="text-sm text-gray-500">
                  Write your steps below, please stick to order
                </p>
              </div>

              <div className="space-y-4">
                {/* Steps */}
                {steps.map((step, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-2 flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Step Instruction
                      </label>
                      <textarea
                        value={step.instruction}
                        onChange={(e) =>
                          updateStepInstruction(index, e.target.value)
                        }
                        className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Please Enter"
                      />
                    </div>
                  </div>
                ))}

                {/* Add Step Button */}
                <button
                  onClick={addStep}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
                >
                  + Add Another Step
                </button>

                {/* Save Button */}
                <div className="pt-4 mt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveDraft}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Instructions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Grid showing all steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">All Steps</h3>
              <p className="text-sm text-gray-500">
                View and manage all created steps
              </p>
            </div>
          </div>

          <StepsGrid
            steps={savedSteps}
            onEdit={handleEditStep}
            onRemove={handleRemoveStep}
          />
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-8 right-8 flex items-center gap-3 z-10">
          <Button onClick={handleSaveDraft} size="lg" variant="outline">
            Save as draft
          </Button>
          <Button onClick={handlePublish} size="lg">
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
