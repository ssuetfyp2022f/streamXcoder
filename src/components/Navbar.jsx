// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Home, 
//   Video, 
//   Code, 
//   User, 
//   LogIn, 
//   Menu, 
//   X, 
//   LogOut, 
//   Upload, 
//   Search,
//   Sparkles,
//   Bell,
//   Zap,
//   Flame,
//   ChevronDown,
//   Command,
//   Moon,
//   Sun,
//   Sparkle,
//   BookOpen,
//   TrendingUp
// } from 'lucide-react';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [user, setUser] = useState(null);
//   const [notifications, setNotifications] = useState(3);
//   const [darkMode, setDarkMode] = useState(true);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Search handler
//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery('');
//     }
//   };

//   // Mock user data
//   const userData = {
//     name: "Alex Coder",
//     avatar: "A",
//     role: "Premium Member"
//   };

//   // Navigation items
//   const navItems = [
//     { path: '/', label: 'Home', icon: Home, color: '#00ADB5' },
//     { path: '/editor', label: 'Editor', icon: Code, color: '#61DAFB' },
//     { path: '/courses', label: 'Courses', icon: BookOpen, color: '#8CC84B' },
    
//   ];

//   return (
//     <>
//       {/* Blur overlay for mobile menu */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
//             onClick={() => setIsMenuOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* Main Navbar */}
//       <nav 
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//           isScrolled 
//             ? 'backdrop-blur-xl bg-[#393E46]/90 shadow-2xl shadow-black/20'
//             : 'backdrop-blur-md bg-[#393E46]/80'
//         }`}
//         style={{ 
//           borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : 'none'
//         }}
//       >
//         {/* Animated particles in background */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(3)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute rounded-full opacity-10"
//               style={{ 
//                 backgroundColor: '#00ADB5',
//                 width: 20 + i * 30,
//                 height: 20 + i * 30,
//                 top: '20%',
//                 left: `${20 + i * 20}%`,
//               }}
//               animate={{
//                 y: [0, -30, 0],
//                 x: [0, Math.random() * 20 - 10, 0],
//               }}
//               transition={{
//                 duration: 4 + i,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             />
//           ))}
//         </div>

//         <div className="container mx-auto px-4 py-3 relative z-10">
//           <div className="flex items-center justify-between">
            
//             {/* Logo with Animation */}
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="flex items-center gap-2"
//             >
//               <Link to="/" className="flex items-center gap-3 group">
//                 <motion.div 
//                   className="relative"
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <div className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:shadow-lg group-hover:shadow-[#00ADB5]/30 transition-all duration-300"
//                     style={{ 
//                       background: 'linear-gradient(135deg, #00ADB5 0%, #393E46 100%)',
//                     }}
//                   >
//                     <Code className="text-white" size={24} />
                    
//                     {/* Glow effect */}
//                     <motion.div 
//                       className="absolute inset-0 rounded-xl"
//                       style={{ backgroundColor: '#00ADB5' }}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: [0, 0.3, 0] }}
//                       transition={{ duration: 2, repeat: Infinity }}
//                     />
//                   </div>
                  
//                   {/* Floating sparkles */}
//                   <motion.div
//                     animate={{ 
//                       rotate: 360,
//                       scale: [1, 1.2, 1]
//                     }}
//                     transition={{ 
//                       rotate: { duration: 20, repeat: Infinity, ease: "linear" },
//                       scale: { duration: 2, repeat: Infinity }
//                     }}
//                     className="absolute -top-1 -right-1"
//                   >
//                     <Sparkles size={12} className="text-[#00ADB5]" />
//                   </motion.div>
//                 </motion.div>
                
//                 <div className="flex flex-col">
//                   <motion.span 
//                     className="text-2xl font-bold bg-gradient-to-r from-[#00ADB5] to-[#61DAFB] bg-clip-text text-transparent"
//                     whileHover={{ scale: 1.02 }}
//                   >
//                     StreamXCoder
//                   </motion.span>
//                   <span className="text-xs text-gray-300 flex items-center gap-1">
//                     <Zap size={10} className="text-[#00ADB5]" />
//                     Code Along With Videos
//                   </span>
//                 </div>
//               </Link>
//             </motion.div>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center gap-1">
//               {navItems.map((item, index) => (
//                 <motion.div
//                   key={item.path}
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <Link
//                     to={item.path}
//                     className={`relative group px-4 py-2 rounded-lg mx-1 transition-all duration-300 ${
//                       location.pathname === item.path
//                         ? 'text-white'
//                         : 'text-gray-300 hover:text-white'
//                     }`}
//                     onMouseEnter={() => setActiveDropdown(item.label)}
//                     onMouseLeave={() => setActiveDropdown(null)}
//                   >
//                     <div className="flex items-center gap-2">
//                       <item.icon size={18} style={{ color: item.color }} />
//                       <span className="font-medium">{item.label}</span>
//                     </div>
                    
//                     {/* Active indicator */}
//                     {location.pathname === item.path && (
//                       <motion.div
//                         layoutId="navbar-indicator"
//                         className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
//                         style={{ backgroundColor: item.color }}
//                         initial={{ scaleX: 0 }}
//                         animate={{ scaleX: 1 }}
//                         transition={{ type: "spring", stiffness: 200 }}
//                       />
//                     )}
                    
//                     {/* Hover effect */}
//                     <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                       style={{ 
//                         backgroundColor: `${item.color}20`,
//                         boxShadow: `0 0 20px ${item.color}40`
//                       }}
//                     />
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Right Section */}
//             <div className="flex items-center gap-3">
//               {/* Search Bar */}
              

//               {/* Theme Toggle */}
//               <motion.button
//                 whileHover={{ scale: 1.1, rotate: 15 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setDarkMode(!darkMode)}
//                 className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm hover:shadow-lg transition-all"
//                 style={{ 
//                   backgroundColor: 'rgba(34, 40, 49, 0.8)',
//                   border: '1px solid rgba(255, 255, 255, 0.1)'
//                 }}
//               >
//                 {darkMode ? (
//                   <Sun size={20} className="text-yellow-300" />
//                 ) : (
//                   <Moon size={20} className="text-blue-400" />
//                 )}
//               </motion.button>

//               {/* Notifications */}
//               {user ? (
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   className="relative w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
//                   style={{ 
//                     backgroundColor: 'rgba(34, 40, 49, 0.8)',
//                     border: '1px solid rgba(255, 255, 255, 0.1)'
//                   }}
//                 >
//                   <Bell size={20} className="text-gray-300" />
//                   {notifications > 0 && (
//                     <motion.span 
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
//                       style={{ backgroundColor: '#FF4081', color: '#FFFFFF' }}
//                     >
//                       {notifications}
//                     </motion.span>
//                   )}
//                 </motion.button>
//               ) : null}

//               {/* User Profile / Auth */}
//               {user ? (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="relative"
//                   onMouseEnter={() => setActiveDropdown('user')}
//                   onMouseLeave={() => setActiveDropdown(null)}
//                 >
//                   <button className="flex items-center gap-2 p-1 rounded-xl backdrop-blur-sm hover:shadow-lg transition-all group"
//                     style={{ 
//                       backgroundColor: 'rgba(34, 40, 49, 0.8)',
//                       border: '1px solid rgba(0, 173, 181, 0.3)'
//                     }}
//                   >
//                     <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold relative overflow-hidden"
//                       style={{ 
//                         background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
//                         color: '#FFFFFF'
//                       }}
//                     >
//                       {userData.avatar}
//                       {/* Glow effect */}
//                       <motion.div 
//                         className="absolute inset-0 rounded-full"
//                         style={{ backgroundColor: '#00ADB5' }}
//                         animate={{ 
//                           scale: [1, 1.5, 1],
//                           opacity: [0.3, 0, 0.3]
//                         }}
//                         transition={{ duration: 2, repeat: Infinity }}
//                       />
//                     </div>
//                     <div className="hidden lg:block text-left mr-2">
//                       <div className="text-sm font-semibold text-white">
//                         {userData.name}
//                       </div>
//                       <div className="text-xs text-gray-300 flex items-center gap-1">
//                         <Sparkle size={10} className="text-yellow-400" />
//                         {userData.role}
//                       </div>
//                     </div>
//                     <ChevronDown size={16} className="text-gray-400 group-hover:rotate-180 transition-transform" />
//                   </button>

//                   {/* Dropdown Menu */}
//                   <AnimatePresence>
//                     {activeDropdown === 'user' && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
//                         className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50"
//                         style={{ 
//                           backgroundColor: 'rgba(57, 62, 70, 0.95)',
//                           border: '1px solid rgba(255, 255, 255, 0.1)'
//                         }}
//                       >
//                         <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
//                           <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
//                               style={{ 
//                                 background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
//                                 color: '#FFFFFF'
//                               }}
//                             >
//                               {userData.avatar}
//                             </div>
//                             <div>
//                               <div className="font-bold text-white">{userData.name}</div>
//                               <div className="text-sm text-gray-300">{userData.role}</div>
//                             </div>
//                           </div>
//                         </div>
                        
//                         <div className="py-2">
//                           {[
//                             { icon: User, label: 'Profile', color: '#00ADB5' },
//                             { icon: Video, label: 'My Videos', color: '#FF6B35' },
//                             { icon: Upload, label: 'Upload', color: '#61DAFB' },
//                             { icon: BookOpen, label: 'My Courses', color: '#8CC84B' },
//                           ].map((item) => (
//                             <button
//                               key={item.label}
//                               className="w-full px-4 py-3 flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all"
//                             >
//                               <item.icon size={18} style={{ color: item.color }} />
//                               <span>{item.label}</span>
//                             </button>
//                           ))}
//                         </div>
                        
//                         <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
//                           <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all"
//                             style={{ 
//                               backgroundColor: '#FF4081',
//                               color: '#FFFFFF'
//                             }}
//                           >
//                             <LogOut size={18} />
//                             <span>Logout</span>
//                           </button>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               ) : (
//                 <div className="hidden lg:flex items-center gap-3">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => navigate('/login')}
//                     className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 backdrop-blur-sm hover:shadow-lg transition-all"
//                     style={{ 
//                       backgroundColor: 'rgba(34, 40, 49, 0.8)',
//                       border: '1px solid rgba(255, 255, 255, 0.1)',
//                       color: '#FFFFFF'
//                     }}
//                   >
//                     <LogIn size={18} />
//                     <span>Login</span>
//                   </motion.button>
                  
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => navigate('/signup')}
//                     className="px-6 py-2.5 rounded-lg font-bold relative overflow-hidden group"
//                     style={{ 
//                       background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
//                       color: '#FFFFFF'
//                     }}
//                   >
//                     <span className="relative z-10 flex items-center gap-2">
//                       <Flame size={18} />
//                       Get Started
//                     </span>
//                     <motion.div
//                       className="absolute inset-0"
//                       style={{ backgroundColor: '#393E46' }}
//                       initial={{ x: '-100%' }}
//                       whileHover={{ x: 0 }}
//                       transition={{ duration: 0.3 }}
//                     />
//                   </motion.button>
//                 </div>
//               )}

//               {/* Mobile Menu Button */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm"
//                 style={{ 
//                   backgroundColor: 'rgba(34, 40, 49, 0.8)',
//                   border: '1px solid rgba(255, 255, 255, 0.1)'
//                 }}
//               >
//                 {isMenuOpen ? (
//                   <X size={24} className="text-white" />
//                 ) : (
//                   <Menu size={24} className="text-white" />
//                 )}
//               </motion.button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {isMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="lg:hidden absolute top-full left-0 right-0 mt-1 mx-4 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-40"
//               style={{ 
//                 backgroundColor: 'rgba(57, 62, 70, 0.98)',
//                 border: '1px solid rgba(255, 255, 255, 0.1)'
//               }}
//             >
//               {/* Mobile Search */}
//               <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
//                 <form onSubmit={handleSearch} className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                   <input 
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search tutorials..."
//                     className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 text-white placeholder-gray-400 outline-none"
//                     style={{ border: '1px solid rgba(255,255,255,0.1)' }}
//                   />
//                 </form>
//               </div>

//               {/* Mobile Navigation */}
//               <div className="py-2">
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     onClick={() => setIsMenuOpen(false)}
//                     className={`flex items-center gap-3 px-6 py-4 mx-2 rounded-xl transition-all ${
//                       location.pathname === item.path
//                         ? 'bg-white/10 text-white'
//                         : 'text-gray-300 hover:bg-white/5 hover:text-white'
//                     }`}
//                   >
//                     <item.icon size={20} style={{ color: item.color }} />
//                     <span className="font-medium">{item.label}</span>
//                     {location.pathname === item.path && (
//                       <motion.div
//                         layoutId="mobile-indicator"
//                         className="ml-auto w-2 h-2 rounded-full"
//                         style={{ backgroundColor: item.color }}
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                       />
//                     )}
//                   </Link>
//                 ))}
//               </div>

//               {/* Mobile Auth Buttons */}
//               <div className="p-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
//                 {user ? (
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3 mb-4">
//                       <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
//                         style={{ 
//                           background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
//                           color: '#FFFFFF'
//                         }}
//                       >
//                         {userData.avatar}
//                       </div>
//                       <div>
//                         <div className="font-bold text-white">{userData.name}</div>
//                         <div className="text-sm text-gray-300">{userData.role}</div>
//                       </div>
//                     </div>
                    
//                     <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium"
//                       style={{ 
//                         backgroundColor: '#FF4081',
//                         color: '#FFFFFF'
//                       }}
//                     >
//                       <LogOut size={20} />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     <button
//                       onClick={() => {
//                         navigate('/login');
//                         setIsMenuOpen(false);
//                       }}
//                       className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium"
//                       style={{ 
//                         backgroundColor: 'rgba(34, 40, 49, 0.8)',
//                         border: '1px solid rgba(255, 255, 255, 0.1)',
//                         color: '#FFFFFF'
//                       }}
//                     >
//                       <LogIn size={20} />
//                       <span>Login</span>
//                     </button>
                    
//                     <button
//                       onClick={() => {
//                         navigate('/signup');
//                         setIsMenuOpen(false);
//                       }}
//                       className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold"
//                       style={{ 
//                         background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
//                         color: '#FFFFFF'
//                       }}
//                     >
//                       <Flame size={20} />
//                       <span>Get Started Free</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </nav>

//       {/* Spacer for fixed navbar */}
//       <div className="h-20" />
//     </>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Video, Code, User, LogIn, Menu, X, LogOut, Upload, Search,
  Sparkles, Bell, Zap, Flame, ChevronDown, Command, Moon, Sun,
  Sparkle, BookOpen, TrendingUp
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [darkMode, setDarkMode] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Mock user data
  const userData = {
    name: "Alex Coder",
    avatar: "A",
    role: "Premium Member"
  };

  // Navigation items with custom colors
  const navItems = [
    { path: '/', label: 'Home', icon: Home, color: '#00ADB5' },
    { path: '/editor', label: 'Editor', icon: Code, color: '#61DAFB' },
    { path: '/courses', label: 'Courses', icon: BookOpen, color: '#8CC84B' },
  ];

  // Check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Blur overlay for mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'backdrop-blur-xl bg-[#393E46]/90 shadow-2xl shadow-black/20'
            : 'backdrop-blur-md bg-[#393E46]/80'
        }`}
        style={{ 
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : 'none'
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{ 
                backgroundColor: '#00ADB5',
                width: 20 + i * 30,
                height: 20 + i * 30,
                top: '20%',
                left: `${20 + i * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-3 relative z-10">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <Link to="/" className="flex items-center gap-3 group">
                <motion.div 
                  className="relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:shadow-lg group-hover:shadow-[#00ADB5]/30 transition-all duration-300"
                    style={{ 
                      background: 'linear-gradient(135deg, #00ADB5 0%, #393E46 100%)',
                    }}
                  >
                    <Code className="text-white" size={24} />
                    
                    {/* Glow effect */}
                    <motion.div 
                      className="absolute inset-0 rounded-xl"
                      style={{ backgroundColor: '#00ADB5' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  {/* Floating sparkles */}
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles size={12} className="text-[#00ADB5]" />
                  </motion.div>
                </motion.div>
                
                <div className="flex flex-col">
                  <motion.span 
                    className="text-2xl font-bold bg-gradient-to-r from-[#00ADB5] to-[#61DAFB] bg-clip-text text-transparent"
                    whileHover={{ scale: 1.02 }}
                  >
                    StreamXCoder
                  </motion.span>
                  <span className="text-xs text-gray-300 flex items-center gap-1">
                    <Zap size={10} className="text-[#00ADB5]" />
                    Code Along With Videos
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="relative group px-4 py-2 rounded-lg mx-1 transition-all duration-300"
                    style={{
                      color: isActive(item.path) ? item.color : '#D1D5DB', // gray-300
                      backgroundColor: isActive(item.path) ? `${item.color}10` : 'transparent',
                      textShadow: isActive(item.path) ? `0 0 8px ${item.color}` : 'none',
                    }}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon size={18} style={{ color: item.color }} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    
                    {/* Active indicator underline with pulse animation */}
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1, opacity: [0.5, 1, 0.5] }}
                        transition={{ 
                          scaleX: { type: "spring", stiffness: 200 },
                          opacity: { duration: 1.5, repeat: Infinity }
                        }}
                      />
                    )}
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        backgroundColor: `${item.color}20`,
                        boxShadow: `0 0 20px ${item.color}40`
                      }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm hover:shadow-lg transition-all"
                style={{ 
                  backgroundColor: 'rgba(34, 40, 49, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {darkMode ? (
                  <Sun size={20} className="text-yellow-300" />
                ) : (
                  <Moon size={20} className="text-blue-400" />
                )}
              </motion.button>

              {/* Notifications */}
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                  style={{ 
                    backgroundColor: 'rgba(34, 40, 49, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Bell size={20} className="text-gray-300" />
                  {notifications > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: '#FF4081', color: '#FFFFFF' }}
                    >
                      {notifications}
                    </motion.span>
                  )}
                </motion.button>
              ) : null}

              {/* User Profile / Auth */}
              {user ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown('user')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-2 p-1 rounded-xl backdrop-blur-sm hover:shadow-lg transition-all group"
                    style={{ 
                      backgroundColor: 'rgba(34, 40, 49, 0.8)',
                      border: '1px solid rgba(0, 173, 181, 0.3)'
                    }}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold relative overflow-hidden"
                      style={{ 
                        background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                        color: '#FFFFFF'
                      }}
                    >
                      {userData.avatar}
                      <motion.div 
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: '#00ADB5' }}
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0, 0.3]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div className="hidden lg:block text-left mr-2">
                      <div className="text-sm font-semibold text-white">
                        {userData.name}
                      </div>
                      <div className="text-xs text-gray-300 flex items-center gap-1">
                        <Sparkle size={10} className="text-yellow-400" />
                        {userData.role}
                      </div>
                    </div>
                    <ChevronDown size={16} className="text-gray-400 group-hover:rotate-180 transition-transform" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {activeDropdown === 'user' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50"
                        style={{ 
                          backgroundColor: 'rgba(57, 62, 70, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                              style={{ 
                                background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                                color: '#FFFFFF'
                              }}
                            >
                              {userData.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-white">{userData.name}</div>
                              <div className="text-sm text-gray-300">{userData.role}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          {[
                            { icon: User, label: 'Profile', color: '#00ADB5' },
                            { icon: Video, label: 'My Videos', color: '#FF6B35' },
                            { icon: Upload, label: 'Upload', color: '#61DAFB' },
                            { icon: BookOpen, label: 'My Courses', color: '#8CC84B' },
                          ].map((item) => (
                            <button
                              key={item.label}
                              className="w-full px-4 py-3 flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <item.icon size={18} style={{ color: item.color }} />
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                        
                        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all"
                            style={{ 
                              backgroundColor: '#FF4081',
                              color: '#FFFFFF'
                            }}
                          >
                            <LogOut size={18} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/login')}
                    className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 backdrop-blur-sm hover:shadow-lg transition-all"
                    style={{ 
                      backgroundColor: 'rgba(34, 40, 49, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF'
                    }}
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/signup')}
                    className="px-6 py-2.5 rounded-lg font-bold relative overflow-hidden group"
                    style={{ 
                      background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                      color: '#FFFFFF'
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Flame size={18} />
                      Get Started
                    </span>
                    <motion.div
                      className="absolute inset-0"
                      style={{ backgroundColor: '#393E46' }}
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'rgba(34, 40, 49, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {isMenuOpen ? (
                  <X size={24} className="text-white" />
                ) : (
                  <Menu size={24} className="text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 mt-1 mx-4 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-40"
              style={{ 
                backgroundColor: 'rgba(57, 62, 70, 0.98)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Mobile Search */}
              <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tutorials..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 text-white placeholder-gray-400 outline-none"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </form>
              </div>

              {/* Mobile Navigation */}
              <div className="py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-6 py-4 mx-2 rounded-xl transition-all ${
                      isActive(item.path)
                        ? 'bg-white/10'  // subtle background for active
                        : 'hover:bg-white/5'
                    }`}
                    style={{
                      color: isActive(item.path) ? item.color : '#D1D5DB',
                    }}
                  >
                    <item.icon size={20} style={{ color: item.color }} />
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="mobile-indicator"
                        className="ml-auto w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    )}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="p-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                        style={{ 
                          background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                          color: '#FFFFFF'
                        }}
                      >
                        {userData.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-white">{userData.name}</div>
                        <div className="text-sm text-gray-300">{userData.role}</div>
                      </div>
                    </div>
                    
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium"
                      style={{ 
                        backgroundColor: '#FF4081',
                        color: '#FFFFFF'
                      }}
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium"
                      style={{ 
                        backgroundColor: 'rgba(34, 40, 49, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF'
                      }}
                    >
                      <LogIn size={20} />
                      <span>Login</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/signup');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold"
                      style={{ 
                        background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                        color: '#FFFFFF'
                      }}
                    >
                      <Flame size={20} />
                      <span>Get Started Free</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;