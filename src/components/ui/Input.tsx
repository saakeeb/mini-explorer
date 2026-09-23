import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full h-8 px-3 text-sm bg-[#FFFFFF] text-[#1C1D1A] placeholder:text-[#8B8F86] border ${
          error
            ? "border-[#C24134] focus-visible:outline-[#C24134]"
            : "border-[#DFE2DB] focus-visible:outline-[#0F5C4B]"
        } rounded-[8px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
