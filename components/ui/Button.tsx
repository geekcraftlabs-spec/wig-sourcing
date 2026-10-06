"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-50",
        variant === "primary" && "bg-orange-500 text-white hover:bg-orange-600",
        variant === "secondary" &&
          "border border-white/20 text-neutral-100 hover:bg-white/5",
        variant === "ghost" &&
          "text-neutral-400 hover:text-neutral-100 hover:bg-white/5",
        variant === "danger" && "text-red-400 hover:bg-red-500/10",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-7 py-3.5 text-base",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}