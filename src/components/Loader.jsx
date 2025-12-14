// src/components/Loader.jsx
import React, { useState, useEffect } from 'react';

const Loader = ({ duration = 3000, message = "Code Along With Videos" }) => {
  const [exitAnimation, setExitAnimation] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExitAnimation(true);
      setTimeout(() => {
        setShow(false);
      }, 1000);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-[9999] transition-all duration-1000 ${
      exitAnimation ? 'opacity-0 backdrop-blur-0' : 'opacity-100 backdrop-blur-lg'
    }`}>
      {/* Overlay - Primary color (#213555) */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ${
          exitAnimation ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundColor: '#213555' }}
      ></div>
      
      {/* Logo container */}
      <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-1000 ${
        exitAnimation ? 'opacity-0 -translate-y-20 scale-90' : 'opacity-100 translate-y-0 scale-100'
      }`}>
        {/* Animated GIF logo */}
        <div className="w-36 h-36 mb-6">
          <img
            src="https://media.lordicon.com/icons/wired/outline/743-web-code.gif"
            alt="StreamXCoder logo"
            className="w-full h-full object-contain rounded-full shadow-2xl"
          />
        </div>
        
        <div className="text-center">
          {/* Title - Accent color (#D8C4B6) */}
          <h2 className="text-4xl font-bold mb-2" style={{ color: '#D8C4B6' }}>
            StreamXCoder
          </h2>
          
          {/* Subtitle - White color */}
          <p className="text-lg mb-6 text-white">
            {message}
          </p>
          
          {/* Loading dots - Secondary color (#3E5879) */}
          {!exitAnimation && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ backgroundColor: '#3E5879' }}></div>
              <div className="w-3 h-3 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ backgroundColor: '#3E5879' }}></div>
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: '#3E5879' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loader;