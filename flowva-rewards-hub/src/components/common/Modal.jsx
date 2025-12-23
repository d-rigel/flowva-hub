import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl p-8 max-w-md w-full relative animate-fadeIn ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {title && (
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;