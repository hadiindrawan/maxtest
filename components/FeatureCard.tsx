import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor?: "cyan" | "purple" | "blue";
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  accentColor = "cyan",
  className,
}: FeatureCardProps) {
  const accentClasses = {
    cyan: "bg-neon-cyan shadow-[0_0_20px_2px_rgba(34,211,238,0.6)]",
    purple: "bg-neon-purple shadow-[0_0_20px_2px_rgba(168,85,247,0.6)]",
    blue: "bg-neon-blue shadow-[0_0_20px_2px_rgba(59,130,246,0.6)]",
  };

  const hoverBorderClasses = {
    cyan: "group-hover:border-neon-cyan/50",
    purple: "group-hover:border-neon-purple/50",
    blue: "group-hover:border-neon-blue/50",
  };

  const iconColorClasses = {
    cyan: "text-neon-cyan",
    purple: "text-neon-purple",
    blue: "text-neon-blue",
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col h-full bg-card-dark rounded-xl border border-white/5 overflow-hidden card-hover-effect",
        className
      )}
    >
      {/* Accent Border */}
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-[2px] z-10",
          accentClasses[accentColor]
        )}
      />

      <div className="p-8 flex flex-col flex-1">
        {/* Icon */}
        <div
          className={cn(
            "mb-6 inline-flex items-center justify-center size-14 rounded-lg bg-background-dark border border-white/10 transition-colors",
            hoverBorderClasses[accentColor]
          )}
        >
          <div className={cn("text-3xl", iconColorClasses[accentColor])}>
            {icon}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
          {description}
        </p>
      </div>
    </div>
  );
}
