import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
  icon?: ReactNode;
  external?: boolean;
}

export default function CTAButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  icon,
  external = false,
}: CTAButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-bold rounded-md transition-all";

  const variantClasses = {
    primary:
      "bg-primary text-background-dark hover:bg-[#d8ff6a] shadow-[3px_3px_0_var(--color-primary-dark)] hover:shadow-[2px_2px_0_var(--color-primary-dark)]",
    secondary:
      "border border-white/20 bg-transparent text-white hover:border-white/50 hover:bg-white/5",
  };

  const sizeClasses = {
    md: "h-10 px-6 text-sm gap-2",
    lg: "h-12 px-8 text-base gap-2",
  };

  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const content = (
    <>
      {children}
      {icon && <span className="transition-transform group-hover:translate-x-1">{icon}</span>}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={cn("group", combinedClasses)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cn("group", combinedClasses)}>
      {content}
    </Link>
  );
}
