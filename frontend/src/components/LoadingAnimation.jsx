import React from "react";

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Blinking Dots */}
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-blink"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-blink delay-200"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-blink delay-400"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
