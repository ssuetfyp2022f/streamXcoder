// import React, { useState, useEffect } from 'react';

// const Loader = ({ duration = 3000, message = "Code Along With Videos" }) => {
//   const [exitAnimation, setExitAnimation] = useState(false);
//   const [show, setShow] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setExitAnimation(true);
//       setTimeout(() => {
//         setShow(false);
//       }, 1000);
//     }, duration);
    
//     return () => clearTimeout(timer);
//   }, [duration]);

//   if (!show) return null;

//   return (
//     <div className={`fixed inset-0 flex items-center justify-center z-9999 transition-all duration-1000 ${
//       exitAnimation ? 'opacity-0 backdrop-blur-0' : 'opacity-100 backdrop-blur-xl'
//     }`}>
//       {/* Blurry Overlay - Light Teal with Transparency */}
//       <div 
//         className={`absolute inset-0 transition-all duration-1000 backdrop-blur-2xl ${
//           exitAnimation ? 'opacity-0' : 'opacity-100'
//         }`}
//         style={{ 
//           backgroundColor: 'rgba(0, 173, 181, 0.15)', // Light teal with 15% opacity
//           backdropFilter: 'blur(20px)'
//         }}
//       ></div>
      
//       {/* Logo container */}
//       <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-1000 ${
//         exitAnimation ? 'opacity-0 -translate-y-20 scale-90' : 'opacity-100 translate-y-0 scale-100'
//       }`}>
//         {/* Animated GIF logo */}
//         <div className="w-40 h-40 mb-8 relative">
//           <div 
//             className="absolute inset-0 rounded-full animate-pulse"
//             style={{ 
//               backgroundColor: 'rgba(0, 173, 181, 0.3)',
//               filter: 'blur(20px)'
//             }}
//           ></div>
//           <img
//             src="https://media.lordicon.com/icons/wired/outline/743-web-code.gif"
//             alt="StreamXCoder logo"
//             className="w-full h-full object-contain rounded-full shadow-2xl relative z-10"
//           />
//         </div>
        
//        <h2 className="text-5xl font-bold mb-4 relative">
//   {/* Blurred background text */}
//   <span 
//     className="absolute inset-0 blur-xl opacity-60 z-0"
//     style={{ color: '#00ADB5' }}
//   >
//     StreamXCoder
//   </span>
//   {/* Main text */}
//   <span 
//     className="relative z-10"
//     style={{ 
//       color: '#FFFFFF',
//       textShadow: '0 0 20px rgba(0, 173, 181, 0.8)'
//     }}
//   >
//     StreamXCoder
//   </span>
// </h2>

//         {/* Floating particles in background */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute rounded-full animate-pulse"
//               style={{
//                 width: Math.random() * 40 + 10,
//                 height: Math.random() * 40 + 10,
//                 backgroundColor: 'rgba(0, 173, 181, 0.2)',
//                 filter: 'blur(10px)',
//                 top: `${Math.random() * 100}%`,
//                 left: `${Math.random() * 100}%`,
//                 animationDuration: `${Math.random() * 3 + 2}s`,
//                 animationDelay: `${i * 0.3}s`
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Subtle grid pattern in background */}
//       <div 
//         className="absolute inset-0 opacity-10"
//         style={{
//           backgroundImage: `linear-gradient(rgba(57, 62, 70, 0.2) 1px, transparent 1px),
//                            linear-gradient(90deg, rgba(57, 62, 70, 0.2) 1px, transparent 1px)`,
//           backgroundSize: '40px 40px'
//         }}
//       ></div>
//     </div>
//   );
// };

// export default Loader;