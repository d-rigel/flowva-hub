import React from "react";
import { X, CheckCircle } from "lucide-react";

const ClaimPointsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-purple-600 mb-2">
          Level Up! 🎉
        </h2>
        <p className="text-4xl font-bold text-purple-600 mb-4">+5 Points</p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-2xl">👑</span>
          <span className="text-2xl">💎</span>
          <span className="text-2xl">🎯</span>
        </div>

        <p className="text-gray-600 mb-6">
          You've claimed your daily points! Come back tomorrow for more!
        </p>

        <button
          onClick={onClose}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};

export default ClaimPointsModal;