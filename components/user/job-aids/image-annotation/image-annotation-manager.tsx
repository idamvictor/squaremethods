"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Editor from "./editor";
import { AnnotationState, Renderer, MarkerArea } from "@markerjs/markerjs3";
import sampleImage from "@/public/sample-images/phone-modules.jpg";
import StepsGrid from "./steps-grid";
import { FileManagerModal } from "@/components/shared/file-manager/file-manager-modal";
import { Button } from "@/components/ui/button";
import { Upload, Plus, Trash2 } from "lucide-react";
import { useJobAidStore } from "@/store/job-aid-store";
import { toast } from "sonner";
import {
  useProceduresByJobAidId,
  useDeleteJobAidProcedure,
  useCreateJobAidProcedure,
  useUpdateJobAidProcedure,
} from "@/services/job-aid/job-aid-queries";
import { useUploadFile } from "@/services/upload/upload-queries";
import {
  ProcedurePrecaution,
  UpdateJobAidProcedureInput,
} from "@/services/job-aid/job-aid-types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImageAnnotationManagerProps {
  /* Procedures with optional nested precautions manager */
}

interface Step {
  instruction: string;
  imageUrl: string;
  description: string;
  precautions?: ProcedurePrecaution[];
}

interface EditorRefType {
  getEditor: () => MarkerArea | null;
}

interface EditingStep {
  index: number;
  id: string;
}

export default function ImageAnnotationManager({}: ImageAnnotationManagerProps) {
  const editorRef = useRef<EditorRefType>(null);
  const { currentJobAid } = useJobAidStore();
  const queryClient = useQueryClient();
  const [annotation, setAnnotation] = useState<AnnotationState | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [savedSteps, setSavedSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingStep, setEditingStep] = useState<EditingStep | null>(null);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(
    sampleImage.src,
  );

  // Fetch procedures with nested precautions
  const { data: proceduresData } = useProceduresByJobAidId(
    currentJobAid?.id || "",
  );

  // Delete/Create/Update mutations
  const deleteProc = useDeleteJobAidProcedure(currentJobAid?.id || "");
  const createProc = useCreateJobAidProcedure(currentJobAid?.id || "");
  const updateProc = useUpdateJobAidProcedure(currentJobAid?.id || "");

  // Upload mutation
  const uploadFile = useUploadFile();

  // Load procedures with their nested precautions
  useEffect(() => {
    if (!currentJobAid) {
      setIsLoading(false);
      setSavedSteps([]);
      return;
    }

    try {
      let existingSteps: Step[] = [];

      if (proceduresData?.data && proceduresData.data.length > 0) {
        existingSteps = proceduresData.data.map((proc) => {
          // Parse precautions if they're stringified
          let parsedPrecautions: ProcedurePrecaution[] = [];
          if (proc.precautions && proc.precautions.length > 0) {
            parsedPrecautions = proc.precautions.map((prec) => {
              // If precaution is a string, parse it
              if (typeof prec === "string") {
                try {
                  return JSON.parse(prec) as ProcedurePrecaution;
                } catch (e) {
                  console.error("Failed to parse precaution:", prec, e);
                  return { id: "", instruction: "" };
                }
              }
              // Otherwise it's already an object
              return prec as ProcedurePrecaution;
            });
          }

          return {
            instruction: proc.instruction,
            imageUrl: proc.image,
            description: proc.instruction,
            precautions: parsedPrecautions,
          };
        });
        console.log(
          `Loaded ${existingSteps.length} procedures with precautions for job aid ${currentJobAid.id}:`,
          existingSteps,
        );
      } else {
        console.log(
          `No procedures found for job aid ${currentJobAid.id}`,
          proceduresData,
        );
      }

      setSavedSteps(existingSteps);
    } catch (error) {
      console.error("Error loading existing procedures:", error);
      setSavedSteps([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentJobAid, proceduresData]);

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

  const addPrecautionToStep = (stepIndex: number) => {
    const newSteps = [...steps];
    if (!newSteps[stepIndex].precautions) {
      newSteps[stepIndex].precautions = [];
    }
    newSteps[stepIndex].precautions!.push({
      id: "",
      instruction: "",
    });
    setSteps(newSteps);
  };

  const updatePrecautionInstruction = (
    stepIndex: number,
    precautionIndex: number,
    instruction: string,
  ) => {
    const newSteps = [...steps];
    if (newSteps[stepIndex].precautions) {
      newSteps[stepIndex].precautions![precautionIndex].instruction =
        instruction;
    }
    setSteps(newSteps);
  };

  const removePrecautionFromStep = (
    stepIndex: number,
    precautionIndex: number,
  ) => {
    const newSteps = [...steps];
    if (newSteps[stepIndex].precautions) {
      newSteps[stepIndex].precautions!.splice(precautionIndex, 1);
    }
    setSteps(newSteps);
  };

  const handleSaveDraft = async () => {
    if (steps.length === 0) {
      console.warn("No steps to save");
      toast.error("Please add at least one step before saving");
      return;
    }

    if (!currentJobAid) {
      console.error("No job aid selected");
      toast.error("No job aid selected");
      return;
    }

    // Prevent duplicate submissions
    if (isSaving) {
      toast.error("Already saving, please wait...");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading(
      `Saving ${editingStep ? "updated procedure" : "procedures"}...`,
    );

    try {
      // Get the annotated image from the editor
      console.log("Starting save... selectedImageUrl:", selectedImageUrl);
      let annotatedImageUrl = selectedImageUrl;
      let isBase64Image = false;

      // Try to get the current annotation state from the editor
      let currentAnnotation = annotation;
      if (editorRef.current) {
        const editor = editorRef.current.getEditor?.();
        if (editor) {
          currentAnnotation = editor.getState();
          console.log(
            "Got current annotation from editor:",
            !!currentAnnotation,
          );
        }
      }

      // Render the annotation if we have one
      if (editorRef.current && currentAnnotation) {
        const editor = editorRef.current.getEditor?.();
        if (editor) {
          console.log("Editor found, rendering annotated image");
          const renderer = new Renderer();
          renderer.targetImage = editor.targetImage;
          renderer.naturalSize = true;
          renderer.imageType = "image/png";

          try {
            annotatedImageUrl = await renderer.rasterize(currentAnnotation);
            isBase64Image = annotatedImageUrl?.startsWith("data:image");
            console.log("Annotated image rendered, isBase64:", isBase64Image);

            if (!annotatedImageUrl || annotatedImageUrl.length === 0) {
              console.warn(
                "Rendered image is empty, falling back to selected image",
              );
              annotatedImageUrl = selectedImageUrl;
              isBase64Image = false;
            }
          } catch (renderError) {
            console.warn(
              "Failed to render annotated image, falling back to selected image:",
              renderError,
            );
            annotatedImageUrl = selectedImageUrl;
            isBase64Image = false;
          }
        }
      } else {
        console.warn(
          "No annotation found, using selected image:",
          selectedImageUrl,
        );
      }

      // Validate that we have a valid image URL before proceeding
      if (!annotatedImageUrl || annotatedImageUrl.length === 0) {
        console.error("No valid image URL to save with steps");
        toast.error("Failed to process image. Please try again.");
        return;
      }

      // Upload base64 image if needed to get a URL
      if (isBase64Image) {
        console.log("Converting and uploading base64 image to server...");
        const file = base64ToFile(
          annotatedImageUrl,
          `annotation-${Date.now()}.png`,
        );
        const uploadResponse = await uploadFile.mutateAsync({
          file,
          folder: "job-aids",
        });
        annotatedImageUrl = uploadResponse.data?.url || annotatedImageUrl;
        console.log("Image uploaded successfully, URL:", annotatedImageUrl);
      } else {
        console.log("Image is not base64, URL is:", annotatedImageUrl);
      }

      // Save each step with its nested precautions to API
      for (let index = 0; index < steps.length; index++) {
        const step = steps[index];
        try {
          // Filter out empty precautions and prepare them
          const filteredPrecautions = (step.precautions || [])
            .filter(
              (prec) => prec.instruction && prec.instruction.trim().length > 0,
            )
            .map((prec) => {
              // Ensure we send plain objects, not stringified
              const precObj =
                typeof prec === "string" ? JSON.parse(prec) : prec;
              return {
                id: precObj.id || "",
                instruction: precObj.instruction,
              };
            });

          const procedureInput = {
            job_aid_id: currentJobAid.id,
            title: step.instruction || `Step ${savedSteps.length + index + 1}`,
            step: savedSteps.length + index + 1,
            instruction: step.instruction,
            image: annotatedImageUrl,
            precautions: filteredPrecautions,
          };

          if (editingStep) {
            // Update existing procedure
            const updateData: UpdateJobAidProcedureInput = {
              instruction: step.instruction,
              step: editingStep.index + 1,
              title: step.instruction || `Step ${editingStep.index + 1}`,
              image: annotatedImageUrl,
              precautions: filteredPrecautions,
            };
            await updateProc.mutateAsync({
              id: editingStep.id,
              data: updateData,
            });
            console.log(
              `Procedure ${editingStep.id} updated with precautions:`,
              updateData,
            );
          } else {
            // Create new procedure
            await createProc.mutateAsync(procedureInput);
            console.log(
              `Procedure saved to API for job aid ${currentJobAid.id}:`,
              procedureInput,
            );
          }
        } catch (error) {
          console.error(`Error saving procedure to API:`, error);
          toast.error(`Failed to save procedure. Please try again.`);
          return;
        }
      }

      // Reset the editor for new steps
      setSteps([]);
      setAnnotation(null);
      setEditingStep(null);

      // Invalidate and refetch the queries to update the steps grid
      if (currentJobAid?.id) {
        await queryClient.invalidateQueries({
          queryKey: ["procedures-by-job-aid", currentJobAid.id],
        });
      }

      toast.success(
        editingStep
          ? "Procedure updated successfully!"
          : "Procedures saved successfully!",
      );

      console.log(
        `All procedures with precautions saved successfully for job aid ${currentJobAid.id}`,
      );
    } catch (error) {
      console.error("Error saving procedures:", error);
      toast.error(`Failed to save procedures. Please try again.`);
    } finally {
      setIsSaving(false);
      toast.dismiss(loadingToast);
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

    stepId = proceduresData?.data?.[index]?.id || null;

    if (!stepId) {
      console.error("Step ID not found");
      return;
    }

    console.log(`Editing procedure at index ${index}:`, stepToEdit);
    console.log(`Precautions to load:`, stepToEdit.precautions);

    // Populate the form with existing data including precautions
    setSteps([
      {
        instruction: stepToEdit.instruction,
        imageUrl: stepToEdit.imageUrl,
        description: stepToEdit.description,
        precautions:
          stepToEdit.precautions && stepToEdit.precautions.length > 0
            ? stepToEdit.precautions
            : [],
      },
    ]);

    // Set the selected image URL to the step's image
    setSelectedImageUrl(stepToEdit.imageUrl);

    // Set editing mode
    setEditingStep({
      index,
      id: stepId,
    });

    console.log(
      "Editing step:",
      index,
      stepId,
      "with precautions:",
      stepToEdit.precautions,
    );
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

      // Find the corresponding procedure in the API data
      let stepId: string | null = null;

      const procedureData = proceduresData?.data?.[index];
      stepId = procedureData?.id || null;

      if (!stepId) {
        console.error("Step ID not found, cannot delete");
        return;
      }

      // Call the delete mutation
      await deleteProc.mutateAsync(stepId);
      console.log(`Procedure ${stepId} deleted successfully`);

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
            Please select a job aid first before creating procedures.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading procedures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingStep ? "Edit Procedure" : "Create New Procedure"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Add annotations to your image and optional precautions to create clear
          visual instructions
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
                  {editingStep ? "Edit Procedure" : "Create New"}
                </h3>
                <p className="text-sm text-gray-500">
                  {editingStep
                    ? "Update your procedure and precautions below"
                    : "Add procedures with optional precautions"}
                </p>
              </div>

              <div className="space-y-4">
                {/* Procedures */}
                {steps.map((step, index) => (
                  <div key={index} className="">
                    <div>
                      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900 font-medium">
                          Step{" "}
                          {editingStep
                            ? editingStep.index + 1
                            : savedSteps.length + index + 1}
                        </p>
                      </div>
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

                      {/* Precautions Section */}
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-amber-900">
                            Optional Precautions
                          </label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addPrecautionToStep(index)}
                            className="gap-1 text-amber-700 border-amber-300 hover:bg-amber-100"
                          >
                            <Plus className="w-4 h-4" />
                            Add Precaution
                          </Button>
                        </div>

                        {step.precautions && step.precautions.length > 0 ? (
                          <div className="space-y-3">
                            {step.precautions.map((precaution, precIdx) => (
                              <div
                                key={precIdx}
                                className="p-3 bg-white rounded border border-amber-100"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <p className="text-xs font-medium text-amber-900">
                                    Precaution {precIdx + 1}
                                  </p>
                                  <button
                                    onClick={() =>
                                      removePrecautionFromStep(index, precIdx)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <textarea
                                  value={precaution.instruction}
                                  onChange={(e) =>
                                    updatePrecautionInstruction(
                                      index,
                                      precIdx,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full min-h-[60px] p-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                  placeholder="Enter precaution instruction"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-amber-700">
                            No precautions added. Click &quot;Add
                            Precaution&quot; to add safety warnings.
                          </p>
                        )}
                      </div>
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
                    disabled={isSaving}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isSaving
                      ? editingStep
                        ? "Updating Procedure..."
                        : "Saving Procedures..."
                      : editingStep
                        ? "Update Procedure"
                        : "Save Procedures"}
                  </button>
                  {editingStep && (
                    <button
                      onClick={cancelEdit}
                      disabled={isSaving}
                      className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              <h3 className="text-lg font-semibold text-gray-900">
                All Procedures
              </h3>
              <p className="text-sm text-gray-500">
                View and manage all created procedures with their precautions
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
