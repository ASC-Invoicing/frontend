import React from "react";
import { LoadingOutlined } from "@ant-design/icons";

interface LoadingSpinnerProps {
  size?: string | number; 
  color?: string;          
  className?: string;       
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "2xl",
  color = "#00786F",
  className = "",
}) => {

  const sizeClass =
    typeof size === "string" ? `text-${size}` : `text-[${size}px]`;

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <LoadingOutlined
        className={`${sizeClass} animate-spin`}
        style={{ color }}
      />
    </div>
  );
};
