import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number; 
  type?: "success" | "error" | "info";
}

export default function Toast({ 
  message, 
  onClose, 
  duration = 5000, 
  type = "success" 
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const icon =
    type === "success" ? (
      <CheckCircle className="w-6 h-6 text-green-500" />
    ) : type === "error" ? (
      <XCircle className="w-6 h-6 text-red-500" />
    ) : (
      <Info className="w-6 h-6 text-blue-500" />
    );

  const containerClasses =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-800"
      : type === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-blue-50 border-blue-200 text-blue-800";

  return (
    <div
      className={`
        fixed top-40 cursor-pointer right-5 z-50 flex items-center gap-3 cursor-pointer
        px-6 py-4 rounded-lg shadow-lg border text-base font-medium
        animate-slide-in-right
        ${containerClasses}
      `}
    >
      {icon}
      <span>{message}</span>
      <button onClick={onClose} className="ml-3 text-gray-500 hover:text-gray-700">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
