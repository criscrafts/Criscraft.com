import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, type = "text", id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 font-sans">
        {label && (
          <label
            htmlFor={id}
            className="text-xs uppercase tracking-widest font-semibold text-charcoal/80 pl-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            id={id}
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl bg-warm-ivory border ${
              error
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-soft-gold/25 focus:border-soft-gold focus:ring-soft-gold/10"
            } text-deep-slate placeholder:text-dark-gray/40 text-sm transition-all duration-300 outline-none focus:ring-4`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500 pl-1 font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-dark-gray/60 pl-1">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
