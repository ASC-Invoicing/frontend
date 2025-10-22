import React from "react";
import clsx from "clsx";
import { LoadingOutlined } from "@ant-design/icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: "solid" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  loadingText,
  variant = "solid",
  size = "md",
  fullWidth = false,
  disabled,
  icon,
  iconPosition = "left",
  className,
  ...props
}) => {
  const base = clsx(

    "relative select-none cursor-pointer items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none",
    "gap-2 leading-none",
    {
      // variants
      "bg-[#1d4ed8] text-white hover:bg-[#1e40af] focus:ring-[#1d4ed8]":
        variant === "solid",
      "border border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#1d4ed8]/10 focus:ring-[#1d4ed8]":
        variant === "outline",
      "text-[#1d4ed8] hover:bg-[#1d4ed8]/5 focus:ring-[#1d4ed8]":
        variant === "ghost",
      "bg-[#1E293B] text-white hover:bg-[#3F4C5F] focus:ring-[#1d4ed8]":
        variant === "dark",

      "h-8 px-3 text-sm": size === "sm",
      "h-10 px-4 text-base": size === "md",
      "h-12 px-5 text-lg": size === "lg",


      "w-full": fullWidth,
      "opacity-60 cursor-not-allowed": disabled || loading,
    },
    className
  );

  return (
    <button {...props} disabled={disabled || loading} className={base}>
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingOutlined className="animate-spin text-current text-base" />
          {loadingText && <span>{loadingText}</span>}
        </div>
      ) : (
        <div
          className={clsx("flex items-center justify-center gap-2", {
            "flex-row": iconPosition === "left",
            "flex-row-reverse": iconPosition === "right",
          })}
        >
          {icon && (
            <span className="flex gap-2 items-center justify-center">
              {icon}
            </span>
          )}
          {children && <span className="flex gap-2 items-center leading-none">{children}</span>}
        </div>
      )}
    </button>
  );
};
