import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full h-8 px-3 text-sm bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border ${
          error
            ? "border-[var(--danger)] focus-visible:outline-[var(--danger)]"
            : "border-[var(--border)] focus-visible:outline-[var(--primary)]"
        } rounded-[var(--radius-md)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
