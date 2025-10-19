import SmileyEmoji from "@/public/icons/emojis/fluent-emoji--slightly-smiling-face.svg";
import DisappointedEmoji from "@/public/icons/emojis/fluent-emoji--disappointed-face.svg";
import CryingEmoji from "@/public/icons/emojis/fluent-emoji--crying-face.svg";
import AngryEmoji from "@/public/icons/emojis/fluent-emoji--angry-face.svg";
import ExclamationMarkEmoji from "@/public/icons/emojis/fluent-emoji--double-exclamation-mark.svg";
import QuestionMarkEmoji from "@/public/icons/emojis/fluent-emoji--red-question-mark.svg";
import CheckMarkEmoji from "@/public/icons/emojis/fluent-emoji--check-mark-button.svg";
import CrossMarkEmoji from "@/public/icons/emojis/fluent-emoji--cross-mark.svg";
import HeartEmoji from "@/public/icons/emojis/fluent-emoji--heart-suit.svg";
import ThumbsUpEmoji from "@/public/icons/emojis/fluent-emoji--thumbs-up.svg";
import ThumbsDownEmoji from "@/public/icons/emojis/fluent-emoji--thumbs-down.svg";
import { MarkerTypeItem } from "@/models/toolbar";
import { CustomImageMarker } from "@markerjs/markerjs3";

export const emojis: MarkerTypeItem[] = [
  {
    name: "Smiley",
    markerType: CustomImageMarker,
    icon: SmileyEmoji,
  },
  {
    name: "Disappointed face",
    markerType: CustomImageMarker,
    icon: DisappointedEmoji,
  },
  {
    name: "Crying face",
    markerType: CustomImageMarker,
    icon: CryingEmoji,
  },
  {
    name: "Angry face",
    markerType: CustomImageMarker,
    icon: AngryEmoji,
  },
  {
    name: "Exclamation mark",
    markerType: CustomImageMarker,
    icon: ExclamationMarkEmoji,
  },
  {
    name: "Question mark",
    markerType: CustomImageMarker,
    icon: QuestionMarkEmoji,
  },
  {
    name: "Check mark",
    markerType: CustomImageMarker,
    icon: CheckMarkEmoji,
  },
  {
    name: "Cross mark",
    markerType: CustomImageMarker,
    icon: CrossMarkEmoji,
  },
  {
    name: "Heart",
    markerType: CustomImageMarker,
    icon: HeartEmoji,
  },
  {
    name: "Thumbs up",
    markerType: CustomImageMarker,
    icon: ThumbsUpEmoji,
  },
  {
    name: "Thumbs down",
    markerType: CustomImageMarker,
    icon: ThumbsDownEmoji,
  },
];
