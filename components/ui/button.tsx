import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Stoop buttons have a physical, stamped personality. The solid variants sit on
 * a colored "lip" (a hard offset shadow) so they read like a real, pressable
 * object: they lift on hover and seat down on click. A trailing arrow nudges
 * right on hover. Reduced-motion users keep the look but skip the motion (the
 * global transition guard in globals.css collapses the durations).
 */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-ui text-sm font-semibold tracking-tight transition-[transform,box-shadow,background-color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 [&_svg]:size-4 [&_svg]:shrink-0 [&>svg:last-child]:transition-transform [&>svg:last-child]:duration-150 hover:[&>svg:last-child]:translate-x-0.5",
  {
    variants: {
      variant: {
        default:
          "border-2 border-terracotta-800 bg-terracotta-600 text-cream-50 shadow-[0_4px_0_0_var(--color-terracotta-800)] hover:-translate-y-0.5 hover:bg-terracotta-500 hover:shadow-[0_6px_0_0_var(--color-terracotta-800)] active:translate-y-1 active:shadow-[0_1px_0_0_var(--color-terracotta-800)]",
        outline:
          "border-2 border-ink-900 bg-cream-50 text-ink-900 shadow-[0_4px_0_0_var(--color-ink-900)] hover:-translate-y-0.5 hover:bg-cream-100 hover:shadow-[0_6px_0_0_var(--color-ink-900)] active:translate-y-1 active:shadow-[0_1px_0_0_var(--color-ink-900)]",
        secondary:
          "border-2 border-ink-200 bg-cream-100 text-ink-900 shadow-[0_4px_0_0_var(--color-ink-200)] hover:-translate-y-0.5 hover:bg-cream-50 hover:shadow-[0_6px_0_0_var(--color-ink-200)] active:translate-y-1 active:shadow-[0_1px_0_0_var(--color-ink-200)]",
        ghost:
          "text-ink-700 hover:bg-cream-100 hover:text-ink-900 active:translate-y-px",
        link: "text-terracotta-700 underline-offset-4 hover:underline",
        destructive:
          "border-2 border-terracotta-950 bg-destructive text-destructive-foreground shadow-[0_4px_0_0_var(--color-terracotta-950)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--color-terracotta-950)] active:translate-y-1 active:shadow-[0_1px_0_0_var(--color-terracotta-950)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
