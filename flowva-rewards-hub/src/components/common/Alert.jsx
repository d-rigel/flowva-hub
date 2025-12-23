import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

const Alert = ({ type = "info", message, className = "" }) => {
  const config = {
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      icon: CheckCircle,
    },
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      icon: AlertCircle,
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      icon: AlertTriangle,
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      icon: Info,
    },
  };

  const { bgColor, borderColor, textColor, icon: Icon } = config[type];

  return (
    <div
      className={`p-3 ${bgColor} border ${borderColor} rounded-lg flex items-center gap-2 ${textColor} text-sm ${className}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default Alert;