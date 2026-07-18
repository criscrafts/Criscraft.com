"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  // Luxury variants
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-medium tracking-wide transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-soft-gold/40 disabled:opacity-50 disabled:pointer-events-none rounded-full";

  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs font-semibold uppercase",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  const variantStyles = {
    primary:
      "bg-deep-slate text-warm-ivory hover:bg-charcoal shadow-luxury hover:shadow-luxury-lg hover:-translate-y-[2px]",
    secondary:
      "bg-warm-beige text-charcoal hover:bg-warm-beige/80 shadow-luxury-sm hover:shadow-luxury hover:-translate-y-[1px]",
    outline:
      "bg-transparent border border-soft-gold/30 text-charcoal hover:border-soft-gold hover:bg-soft-cream/30 hover:-translate-y-[1px]",
    gold:
      "bg-soft-gold text-warm-ivory hover:bg-soft-gold/90 shadow-luxury hover:shadow-luxury-lg hover:-translate-y-[2px]",
    ghost:
      "bg-transparent text-charcoal hover:bg-soft-cream/50 hover:text-deep-slate",
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />}
      {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
    </motion.button>
  );
};
