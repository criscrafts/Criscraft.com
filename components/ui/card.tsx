import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  glass = true,
  hoverEffect = true,
  ...props
}) => {
  const baseStyles = "rounded-3xl overflow-hidden transition-all duration-500";
  
  const appearanceStyles = glass
    ? "glassmorphism shadow-luxury-sm hover:shadow-luxury"
    : "bg-soft-cream border border-warm-beige/30 shadow-sm";

  const hoverStyles = hoverEffect
    ? "hover:-translate-y-1"
    : "";

  return (
    <div
      className={`${baseStyles} ${appearanceStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
