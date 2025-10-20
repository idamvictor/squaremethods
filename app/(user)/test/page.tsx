"use client";

import React from "react";
import { emojis } from "@/components/user/job-aids/image-annotation/ui/emojis";
import Image from "next/image";

// Import general UI icons
import PointerIcon from "@/public/icons/pointer.svg";
import DeleteIcon from "@/public/icons/trash.svg";
import DownloadIcon from "@/public/icons/download.svg";
import UndoIcon from "@/public/icons/arrow-back-up.svg";
import RedoIcon from "@/public/icons/arrow-forward-up.svg";
import ZoomInIcon from "@/public/icons/plus.svg";
import ZoomOutIcon from "@/public/icons/minus.svg";
import ZoomResetIcon from "@/public/icons/relation-one-to-one.svg";
import SaveIcon from "@/public/icons/device-floppy.svg";
import ChevronDownIcon from "@/public/icons/chevron-down.svg";
import AddIcon from "@/public/icons/square-plus.svg";
import LoaderIcon from "@/public/icons/loader-2.svg";
import OpacityIcon from "@/public/icons/circle-half-2.svg";
import StrokeIcon from "@/public/icons/border-style-2.svg";
import FillIcon from "@/public/icons/droplet-half-2.svg";
import FontIcon from "@/public/icons/typography.svg";
import ArrowStartIcon from "@/public/icons/arrow-narrow-left.svg";
import ArrowEndIcon from "@/public/icons/arrow-narrow-right.svg";
import ArrowBothIcon from "@/public/icons/arrows-horizontal.svg";
import ArrowNoneIcon from "@/public/icons/minus.svg";
import NotesIcon from "@/public/icons/notes.svg";
import GitHubIcon from "@/public/icons/brand-github.svg";

// Import marker icons
import FrameIcon from "@/public/icons/markers/rectangle.svg";
import CoverIcon from "@/public/icons/markers/rectangle-filled.svg";
import EllipseFrameIcon from "@/public/icons/markers/oval-vertical.svg";
import EllipseIcon from "@/public/icons/markers/oval-vertical-filled.svg";
import HighlightIcon from "@/public/icons/markers/highlight.svg";
import ArrowIcon from "@/public/icons/markers/arrow-narrow-right.svg";
import LineIcon from "@/public/icons/markers/line.svg";
import MeasurementIcon from "@/public/icons/markers/ruler-measure.svg";
import CurveIcon from "@/public/icons/markers/vector-spline.svg";
import TextIcon from "@/public/icons/markers/text-size.svg";
import CalloutIcon from "@/public/icons/markers/bubble-text.svg";
import CaptionFrameIcon from "@/public/icons/markers/text-resize.svg";
import FreehandIcon from "@/public/icons/markers/scribble.svg";
import PolygonIcon from "@/public/icons/markers/polygon.svg";

const generalIcons = [
  { src: PointerIcon, name: "Pointer" },
  { src: DeleteIcon, name: "Delete" },
  { src: DownloadIcon, name: "Download" },
  { src: UndoIcon, name: "Undo" },
  { src: RedoIcon, name: "Redo" },
  { src: ZoomInIcon, name: "Zoom In" },
  { src: ZoomOutIcon, name: "Zoom Out" },
  { src: ZoomResetIcon, name: "Zoom Reset" },
  { src: SaveIcon, name: "Save" },
  { src: ChevronDownIcon, name: "Chevron Down" },
  { src: AddIcon, name: "Add" },
  { src: LoaderIcon, name: "Loader" },
  { src: OpacityIcon, name: "Opacity" },
  { src: StrokeIcon, name: "Stroke" },
  { src: FillIcon, name: "Fill" },
  { src: FontIcon, name: "Font" },
  { src: ArrowStartIcon, name: "Arrow Start" },
  { src: ArrowEndIcon, name: "Arrow End" },
  { src: ArrowBothIcon, name: "Arrow Both" },
  { src: ArrowNoneIcon, name: "Arrow None" },
  { src: NotesIcon, name: "Notes" },
  { src: GitHubIcon, name: "GitHub" },
];

const markerIcons = [
  { src: FrameIcon, name: "Frame" },
  { src: CoverIcon, name: "Cover" },
  { src: EllipseFrameIcon, name: "Ellipse Frame" },
  { src: EllipseIcon, name: "Ellipse" },
  { src: HighlightIcon, name: "Highlight" },
  { src: ArrowIcon, name: "Arrow" },
  { src: LineIcon, name: "Line" },
  { src: MeasurementIcon, name: "Measurement" },
  { src: CurveIcon, name: "Curve" },
  { src: TextIcon, name: "Text" },
  { src: CalloutIcon, name: "Callout" },
  { src: CaptionFrameIcon, name: "Caption Frame" },
  { src: FreehandIcon, name: "Freehand" },
  { src: PolygonIcon, name: "Polygon" },
];

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Icons and Emojis Display</h1>

      {/* Emojis Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Emojis</h2>
        <div className="grid grid-cols-6 gap-4">
          {emojis.map((emoji, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 border rounded-lg"
            >
              <Image src={emoji.icon} alt={emoji.name} width={32} height={32} />
              <span className="text-sm mt-2 text-center">{emoji.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* General UI Icons Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">General UI Icons</h2>
        <div className="grid grid-cols-6 gap-4">
          {generalIcons.map((icon, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 border rounded-lg"
            >
              <Image
                src={icon.src}
                alt={icon.name}
                width={24}
                height={24}
                className="text-gray-800"
              />
              <span className="text-sm mt-2 text-center">{icon.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Marker Icons Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Marker Icons</h2>
        <div className="grid grid-cols-6 gap-4">
          {markerIcons.map((icon, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 border rounded-lg"
            >
              <Image
                src={icon.src}
                alt={icon.name}
                width={24}
                height={24}
                className="text-gray-800"
              />
              <span className="text-sm mt-2 text-center">{icon.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
