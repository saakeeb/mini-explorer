import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "secondary",
      size = "md",
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-[8px] select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0F5C4B] focus-visible:outline-offset-2";

    const variantStyles = {
      primary:
        "bg-[#0F5C4B] text-white hover:bg-[#0B4A3C] active:opacity-95 shadow-sm",
      secondary:
        "bg-[#FFFFFF] text-[#1C1D1A] border border-[#DFE2DB] hover:bg-[#F2F3F1] hover:border-[#C9CEC4] active:bg-[#DFE2DB]",
      danger:
        "bg-[#C24134] text-white hover:opacity-90 active:opacity-95 shadow-sm",
      ghost:
        "bg-transparent text-[#5C5F58] hover:text-[#1C1D1A] hover:bg-[#F2F3F1] active:bg-[#DFE2DB]",
    };

    const sizeStyles = {
      sm: "h-7 px-2.5 text-xs gap-1.5",
      md: "h-8 px-3 text-sm gap-2",
      lg: "h-10 px-4 text-sm gap-2.5",
      icon: "h-8 w-8 p-0 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`cursor-pointer ${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
