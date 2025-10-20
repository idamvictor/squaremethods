import { Button } from "@/components/ui/button";
import { ToolbarAction } from "@/models/toolbar";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import Image from "next/image";
import LoaderIcon from "@/public/icons/loader-2.svg";

type Props = {
  icon: string;
  title: string;
  buttonType?: "button" | "toggle";
  variant?: "ghost" | "outline";
  toggled?: boolean;
  disabled?: boolean;
  loading?: boolean;
  action: ToolbarAction;
  className?: string;
  onAction: (action: ToolbarAction) => void;
};

const ToolbarActionButton = ({
  icon,
  title,
  buttonType,
  variant = "ghost",
  toggled,
  disabled,
  loading = false,
  action,
  className,
  onAction,
}: Props) => {
  return (
    <>
      {(buttonType === undefined || buttonType === "button") && (
        <Button
          variant={variant}
          className={cn("bg-transparent", className)}
          size="icon"
          title={title}
          disabled={disabled}
          onClick={() => onAction(action)}
        >
          {loading ? (
            <Image
              src={LoaderIcon}
              alt="Loading"
              width={20}
              height={20}
              className="animate-spin opacity-70"
            />
          ) : (
            <Image
              src={icon}
              alt={title}
              width={20}
              height={20}
              className="opacity-70"
            />
          )}
        </Button>
      )}
      {buttonType === "toggle" && (
        <Toggle
          variant={variant === "ghost" ? "default" : "outline"}
          className={cn("bg-transparent", className)}
          title={title}
          pressed={toggled ? true : false}
          disabled={disabled}
          onClick={() => onAction(action)}
        >
          <Image
            src={icon}
            alt={title}
            width={20}
            height={20}
            className="opacity-70"
          />
        </Toggle>
      )}
    </>
  );
};

export default ToolbarActionButton;
