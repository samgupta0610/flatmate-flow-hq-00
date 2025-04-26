
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface QuickActionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "primary" | "secondary" | "accent";
}

export function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
  variant = "default"
}: QuickActionProps) {
  const variants = {
    default: "bg-white hover:bg-gray-50",
    primary: "bg-maideasy-primary/10 hover:bg-maideasy-primary/20 text-maideasy-primary",
    secondary: "bg-maideasy-secondary/10 hover:bg-maideasy-secondary/20 text-maideasy-secondary",
    accent: "bg-maideasy-accent/10 hover:bg-maideasy-accent/20 text-maideasy-accent",
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "h-auto w-full p-6 flex flex-col items-start gap-2 rounded-2xl shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
        variants[variant]
      )}
      onClick={onClick}
    >
      <Icon className="w-8 h-8" />
      <div className="text-left">
        <h3 className="font-semibold text-maideasy-text-primary">{title}</h3>
        <p className="text-sm text-maideasy-text-secondary">{description}</p>
      </div>
    </Button>
  );
}
