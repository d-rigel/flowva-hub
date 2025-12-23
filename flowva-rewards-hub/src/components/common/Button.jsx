import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  icon: Icon,
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2";

  const variantClasses = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50",
    outline:
      "border border-purple-600 text-purple-600 hover:bg-purple-50 disabled:opacity-50",
    danger: "bg-red-600 hover:bg-red-700 text-white disabled:opacity-50",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;