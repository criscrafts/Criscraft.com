import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "rose" | "blue" | "neutral" | "soft";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "gold",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase font-sans";

  const variantStyles = {
    gold: "bg-soft-gold/10 text-soft-gold border border-soft-gold/20",
    rose: "bg-muted-rose/10 text-muted-rose border border-muted-rose/20",
    blue: "bg-sky-blue/10 text-sky-blue border border-sky-blue/20",
    neutral: "bg-deep-slate/10 text-deep-slate border border-deep-slate/20",
    soft: "bg-warm-beige text-charcoal",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
