"use client";

import React, { useState } from "react";
import Editor from "./editor";
import { AnnotationState } from "@markerjs/markerjs3";

const sampleImage = "/sample-images/phone-modules.jpg";

export default function ImageAnnotationManager() {
  const [annotation, setAnnotation] = useState<AnnotationState | null>(null);
  return (
    <>
      <div>image-annotation-manager</div>
      <div>
        <Editor
          targetImageSrc={sampleImage}
          annotation={annotation}
          onSave={(newAnnotation) => {
            setAnnotation(newAnnotation);
          }}
        />
      </div>
    </>
  );
}
