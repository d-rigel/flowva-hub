import React from "react";

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      <p className="text-white mt-4 text-lg">Loading...</p>
    </div>
  </div>
);

export default LoadingScreen;