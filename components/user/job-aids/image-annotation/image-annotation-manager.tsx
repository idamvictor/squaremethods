"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Editor from "./editor";
import { AnnotationState, Renderer, MarkerArea } from "@markerjs/markerjs3";
import sampleImage from "@/public/sample-images/phone-modules.jpg";
import StepsGrid from "./steps-grid";
import { FileManagerModal } from "@/components/shared/file-manager/file-manager-modal";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useJobAidStore } from "@/store/job-aid-store";
import {
  useProceduresByJobAidId,
  usePrecautionsByJobAidId,
  useDeleteJobAidProcedure,
  useDeleteJobAidPrecaution,
  useCreateJobAidProcedure,
  useCreateJobAidPrecaution,
  useUpdateJobAidProcedure,
  useUpdateJobAidPrecaution,
} from "@/services/job-aid/job-aid-queries";
import { useUploadFile } from "@/services/upload/upload-queries";

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

interface EditingStep {
  index: number;
  id: string;
  type: "procedure" | "precaution";
}

export default function ImageAnnotationManager({
  type,
}: ImageAnnotationManagerProps) {
  const editorRef = useRef<EditorRefType>(null);
  const { currentJobAid } = useJobAidStore();
  const queryClient = useQueryClient();
  const [annotation, setAnnotation] = useState<AnnotationState | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [savedSteps, setSavedSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStep, setEditingStep] = useState<EditingStep | null>(null);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(
    sampleImage.src
  );

  // Only fetch the data we need based on type
  const { data: proceduresData } = useProceduresByJobAidId(
    type === "procedure" && currentJobAid?.id ? currentJobAid.id : ""
  );

  const { data: precautionsData } = usePrecautionsByJobAidId(
    type === "precaution" && currentJobAid?.id ? currentJobAid.id : ""
  );

  // Delete mutations
  const deleteProc = useDeleteJobAidProcedure(currentJobAid?.id || "");
  const deletePrec = useDeleteJobAidPrecaution(currentJobAid?.id || "");

  // Create mutations
  const createProc = useCreateJobAidProcedure(currentJobAid?.id || "");
  const createPrec = useCreateJobAidPrecaution(currentJobAid?.id || "");

  // Update mutations
  const updateProc = useUpdateJobAidProcedure(currentJobAid?.id || "");
  const updatePrec = useUpdateJobAidPrecaution(currentJobAid?.id || "");

  // Upload mutation
  const uploadFile = useUploadFile();

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
        imageUrl: selectedImageUrl,
        description: "",
      },
    ]);
  };

  // Helper function to convert base64 string to File
  const base64ToFile = (base64String: string, fileName: string): File => {
    const arr = base64String.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], fileName, { type: mime });
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
      console.log("Starting save... selectedImageUrl:", selectedImageUrl);
      let annotatedImageUrl = selectedImageUrl; // Use the selected image as default, not sample image
      let isBase64Image = false;

      // Try to get the current annotation state from the editor
      let currentAnnotation = annotation;
      if (editorRef.current) {
        const editor = editorRef.current.getEditor?.();
        if (editor) {
          // Get the current state directly from the editor instead of relying on state variable
          currentAnnotation = editor.getState();
          console.log(
            "Got current annotation from editor:",
            !!currentAnnotation
          );
        }
      }

      // Render the annotation if we have one
      if (editorRef.current && currentAnnotation) {
        const editor = editorRef.current.getEditor?.();
        if (editor) {
          console.log("Editor found, rendering annotated image");
          console.log("Editor targetImage:", editor.targetImage);
          const renderer = new Renderer();
          renderer.targetImage = editor.targetImage;
          renderer.naturalSize = true;
          renderer.imageType = "image/png";

          try {
            annotatedImageUrl = await renderer.rasterize(currentAnnotation);
            isBase64Image = annotatedImageUrl?.startsWith("data:image");
            console.log(
              "Annotated image rendered, isBase64:",
              isBase64Image,
              "URL preview:",
              annotatedImageUrl?.substring(0, 50)
            );

            // If rasterize returns empty string (CORS/canvas taint issue), fall back to selected image
            if (!annotatedImageUrl || annotatedImageUrl.length === 0) {
              console.warn(
                "Rendered image is empty (likely CORS/canvas taint issue), falling back to selected image"
              );
              annotatedImageUrl = selectedImageUrl;
              isBase64Image = false;
            }
          } catch (renderError) {
            console.warn(
              "Failed to render annotated image (CORS issue likely), falling back to selected image:",
              renderError
            );
            annotatedImageUrl = selectedImageUrl;
            isBase64Image = false;
          }
        }
      } else {
        console.warn(
          "No annotation found, using selected image:",
          selectedImageUrl
        );
      }

      console.log(
        "Final annotatedImageUrl before upload:",
        annotatedImageUrl?.substring(0, 100)
      );

      // Validate that we have a valid image URL before proceeding
      if (!annotatedImageUrl || annotatedImageUrl.length === 0) {
        console.error("No valid image URL to save with steps");
        return;
      }

      // Upload base64 image if needed to get a URL
      if (isBase64Image) {
        console.log("Converting and uploading base64 image to server...");
        const file = base64ToFile(
          annotatedImageUrl,
          `annotation-${Date.now()}.png`
        );
        const uploadResponse = await uploadFile.mutateAsync({
          file,
          folder: "job-aids",
        });
        // Extract the image URL from the upload response
        annotatedImageUrl = uploadResponse.data?.url || annotatedImageUrl;
        console.log("Image uploaded successfully, URL:", annotatedImageUrl);
      } else {
        console.log("Image is not base64, URL is:", annotatedImageUrl);
      }

      // Save each step to API
      for (let index = 0; index < steps.length; index++) {
        const step = steps[index];
        try {
          if (editingStep) {
            // EDIT MODE - Update existing step
            if (type === "procedure") {
              const procedureInput = {
                instruction: step.instruction,
                step: editingStep.index + 1,
                title: step.instruction || `Step ${editingStep.index + 1}`,
                image: annotatedImageUrl,
              };
              await updateProc.mutateAsync({
                id: editingStep.id,
                data: procedureInput,
              });
              console.log(
                `Procedure ${editingStep.id} updated:`,
                procedureInput
              );
            } else if (type === "precaution") {
              const precautionInput = {
                instruction: step.instruction,
                image: annotatedImageUrl,
              };
              await updatePrec.mutateAsync({
                id: editingStep.id,
                data: precautionInput,
              });
              console.log(
                `Precaution ${editingStep.id} updated:`,
                precautionInput
              );
            }
          } else {
            // CREATE MODE - Add new step
            if (type === "procedure") {
              const procedureInput = {
                job_aid_id: currentJobAid.id,
                title:
                  step.instruction || `Step ${savedSteps.length + index + 1}`,
                step: savedSteps.length + index + 1,
                instruction: step.instruction,
                image: annotatedImageUrl,
              };
              await createProc.mutateAsync(procedureInput);
              console.log(
                `Procedure saved to API for job aid ${currentJobAid.id}:`,
                procedureInput
              );
            } else if (type === "precaution") {
              const precautionInput = {
                job_aid_id: currentJobAid.id,
                instruction: step.instruction,
                image: annotatedImageUrl,
              };
              console.log("Precaution payload being sent:", precautionInput);
              await createPrec.mutateAsync(precautionInput);
              console.log(
                `Precaution saved to API for job aid ${currentJobAid.id}:`,
                precautionInput
              );
            }
          }
        } catch (error) {
          console.error(`Error saving ${type} to API:`, error);
        }
      }

      // Reset the editor for new steps
      setSteps([]);
      setAnnotation(null);
      setEditingStep(null);

      // Invalidate and refetch the queries to update the steps grid
      if (type === "procedure" && currentJobAid?.id) {
        await queryClient.invalidateQueries({
          queryKey: ["procedures-by-job-aid", currentJobAid.id],
        });
      } else if (type === "precaution" && currentJobAid?.id) {
        await queryClient.invalidateQueries({
          queryKey: ["precautions-by-job-aid", currentJobAid.id],
        });
      }

      console.log(
        `All ${type}s saved successfully for job aid ${currentJobAid.id}`
      );
    } catch (error) {
      console.error("Error saving steps:", error);
    }
  };

  // const handlePublish = () => {
  //   console.log("Publishing:", {
  //     steps,
  //     annotation,
  //   });
  // };

  const handleEditStep = (index: number) => {
    const stepToEdit = savedSteps[index];
    let stepId: string | null = null;

    if (type === "procedure") {
      stepId = proceduresData?.data?.[index]?.id || null;
    } else if (type === "precaution") {
      stepId = precautionsData?.data?.[index]?.id || null;
    }

    if (!stepId) {
      console.error("Step ID not found");
      return;
    }

    // Populate the form with existing data
    setSteps([
      {
        instruction: stepToEdit.instruction,
        imageUrl: stepToEdit.imageUrl,
        description: stepToEdit.description,
      },
    ]);

    // Set editing mode
    setEditingStep({
      index,
      id: stepId,
      type,
    });

    console.log("Editing step:", index, stepId);
  };

  const cancelEdit = () => {
    setSteps([]);
    setAnnotation(null);
    setEditingStep(null);
  };

  const handleRemoveStep = async (index: number) => {
    try {
      // Get the step ID to delete
      const stepToDelete = savedSteps[index];

      if (!stepToDelete) {
        console.error("Step not found");
        return;
      }

      // Find the corresponding procedure or precaution in the API data
      let stepId: string | null = null;

      if (type === "procedure") {
        const procedureData = proceduresData?.data?.[index];
        stepId = procedureData?.id || null;
      } else if (type === "precaution") {
        const precautionData = precautionsData?.data?.[index];
        stepId = precautionData?.id || null;
      }

      if (!stepId) {
        console.error("Step ID not found, cannot delete");
        return;
      }

      // Call the appropriate delete mutation
      if (type === "procedure") {
        await deleteProc.mutateAsync(stepId);
        console.log(`Procedure ${stepId} deleted successfully`);
      } else if (type === "precaution") {
        await deletePrec.mutateAsync(stepId);
        console.log(`Precaution ${stepId} deleted successfully`);
      }

      // Update local state
      const newSteps = savedSteps.filter((_, i) => i !== index);
      setSavedSteps(newSteps);
    } catch (error) {
      console.error("Error deleting step:", error);
    }
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
          {editingStep
            ? `Edit ${type === "precaution" ? "Instruction" : "Step"}`
            : type === "precaution"
            ? "Create New Instruction"
            : "Create New Step"}
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
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Editor</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsFileManagerOpen(true)}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Change Image
                  </Button>
                </div>
                <div className="h-[600px] w-full rounded-lg border border-gray-200 overflow-hidden">
                  <Editor
                    key={selectedImageUrl}
                    ref={editorRef}
                    targetImageSrc={selectedImageUrl}
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
                  {editingStep ? `Edit ${type}` : "Create New"}
                </h3>
                <p className="text-sm text-gray-500">
                  {editingStep
                    ? "Update your step details below"
                    : "Write your steps below, please stick to order"}
                </p>
              </div>

              <div className="space-y-4">
                {/* Steps */}
                {steps.map((step, index) => (
                  <div key={index} className="">
                    <div>
                      {type === "procedure" && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-900 font-medium">
                            Step{" "}
                            {editingStep
                              ? editingStep.index + 1
                              : savedSteps.length + index + 1}
                          </p>
                        </div>
                      )}
                      {type === "precaution" && (
                        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-900 font-medium">
                            Precaution{" "}
                            {editingStep
                              ? editingStep.index + 1
                              : savedSteps.length + index + 1}
                          </p>
                        </div>
                      )}
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {type === "procedure"
                          ? "Step Instruction"
                          : "Instruction"}
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

                {/* Add Step Button - Only show when not editing */}
                {!editingStep && (
                  <button
                    onClick={addStep}
                    className="w-full py-2 px-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
                  >
                    + Add Another Step
                  </button>
                )}

                {/* Save/Update Button */}
                <div className="pt-4 mt-6 border-t border-gray-200 space-y-2">
                  <button
                    onClick={handleSaveDraft}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingStep ? "Update Step" : "Save Instructions"}
                  </button>
                  {editingStep && (
                    <button
                      onClick={cancelEdit}
                      className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
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
        {/* <div className="fixed bottom-8 right-8 flex items-center gap-3 z-10">
          <Button onClick={handleSaveDraft} size="lg" variant="outline">
            Save as draft
          </Button>
          <Button onClick={handlePublish} size="lg">
            Publish
          </Button>
        </div> */}
      </div>

      {/* File Manager Modal */}
      <FileManagerModal
        open={isFileManagerOpen}
        onOpenChange={setIsFileManagerOpen}
        onFileSelect={(fileUrl) => {
          console.log("New image selected:", fileUrl);
          setSelectedImageUrl(fileUrl);
          setAnnotation(null); // Reset annotation when changing image
          setSteps([]); // Clear any unsaved steps
          setEditingStep(null); // Clear editing mode
        }}
      />
    </div>
  );
}
