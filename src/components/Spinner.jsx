import React from 'react';

const Spinner = ({ size = "md", color = "#213555" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-t-transparent rounded-full animate-spin`}
        style={{ 
          borderColor: color,
          borderTopColor: 'transparent'
        }}
      ></div>
    </div>
  );
};

export default Spinner;