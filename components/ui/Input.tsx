import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-neutral-100 placeholder:text-neutral-500",
      "focus:outline-none focus:border-orange-500 transition-colors",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";