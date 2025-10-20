"use client";

import React, { useState } from "react";
import Editor from "./editor";
import { AnnotationState } from "@markerjs/markerjs3";
import sampleImage from "@/public/sample-images/phone-modules.jpg";
import Viewer from "./viewer";
import Renderer from "./renderer";

export default function ImageAnnotationManager() {
  const [annotation, setAnnotation] = useState<AnnotationState | null>(null);
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 text-xl font-semibold">Image Annotation Demo</div>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <Editor
          targetImageSrc={sampleImage.src}
          annotation={annotation}
          onSave={(newAnnotation) => {
            setAnnotation(newAnnotation);
            console.log("Annotation saved:", newAnnotation);
          }}
        />

        <Viewer targetImageSrc={sampleImage.src} annotation={annotation} />

        <Renderer targetImageSrc={sampleImage.src} annotation={annotation} />
      </div>
    </div>
  );
}
