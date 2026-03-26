// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Play, 
//   X, 
//   Clock, 
//   ListVideo, 
//   Search,
//   Code,
//   Sparkles,
//   TrendingUp,
//   BookOpen,
//   ChevronRight,
//   Star,
//   Users,
//   Zap
// } from "lucide-react";

// const API_KEY = "AIzaSyDmeQc7z165tiV0ZOQz_2W5tkXZMLvR-Kc";

// const Coursespage = () => {
//   const navigate = useNavigate();

//   const [selectedPlaylist, setSelectedPlaylist] = useState(null);
//   const [playlistVideos, setPlaylistVideos] = useState([]);
//   const [playlistThumbnails, setPlaylistThumbnails] = useState({});
//   const [playlistCounts, setPlaylistCounts] = useState({});
//   const [loading, setLoading] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isHovered, setIsHovered] = useState(false);

//   const videos = [
//     { id: "W6NZfCO5SIk", title: "JavaScript Basics", category: "JavaScript", duration: "2.5 hrs" },
//     { id: "ESnrn1kAD4E", title: "CSS Tutorial for Beginners", category: "CSS", duration: "3 hrs" },
//     { id: "ajdRvxDWH4w", title: "JavaScript Full Course", category: "JavaScript", duration: "8 hrs" },
//     { id: "HcOc7P5BMi4", title: "HTML Tutorial for Beginners", category: "HTML", duration: "2 hrs" },
//     { id: "e7sAf4SbS_g", title: "Complete C++ Tutorial", category: "C++", duration: "10 hrs" },
//   ];

//   const playlists = [
//     {
//       id: "html01",
//       title: "HTML Complete Course",
//       description: "Learn HTML from scratch",
//       playlistId: "PLu71SKxNbfoDBNF5s-WH6aLbthSEIMhMI",
//       level: "Beginner",
//     },
//     {
//       id: "css01",
//       title: "CSS Introduction",
//       description: "Master CSS styling",
//       playlistId: "PLhzIaPMgkbxBk9-drEC0MBPqEOXpVlwY4",
//       level: "Beginner",
//     },
//     {
//       id: "js01",
//       title: "JavaScript for beginners",
//       description: "Complete JS course",
//       playlistId: "PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37",
//       level: "Intermediate",
//     },
//     {
//       id: "py01",
//       title: "Introduction to Python",
//       description: "Python programming basics",
//       playlistId: "PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
//       level: "Beginner",
//     },
//     {
//       id: "cpp01",
//       title: "Introduction to C++",
//       description: "C++ programming fundamentals",
//       playlistId: "PLxCzCOWd7aiF6yRNI5OHQsnUJQfl7Geqj",
//       level: "Intermediate",
//     },
//     {
//       id: "react01",
//       title: "React.js Complete Guide",
//       description: "Build modern UIs with React",
//       playlistId: "PLu71SKxNbfoDq-9KtMmy-4kF2HtE2F3zL",
//       level: "Advanced",
//     },
//   ];

//   // Filter playlists based on search
//   const filteredPlaylists = playlists.filter(playlist =>
//     playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     playlist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     playlist.level.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredVideos = videos.filter(video =>
//     video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     video.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Fetch playlist videos
//   const fetchPlaylistVideos = async (playlistId) => {
//     setLoading((prev) => ({ ...prev, [playlistId]: true }));
//     let videos = [];
//     let nextPageToken = "";

//     try {
//       do {
//         const response = await fetch(
//           `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}&pageToken=${nextPageToken}`
//         );
//         const data = await response.json();

//         const newVideos = data.items.map((item) => ({
//           videoId: item.snippet.resourceId.videoId,
//           title: item.snippet.title,
//           thumbnail: item.snippet.thumbnails.medium.url,
//         }));

//         videos = [...videos, ...newVideos];
//         nextPageToken = data.nextPageToken;
//       } while (nextPageToken);
//       setPlaylistVideos(videos);
//     } catch (error) {
//       console.error("Error fetching playlist videos:", error);
//     } finally {
//       setLoading((prev) => ({ ...prev, [playlistId]: false }));
//     }
//   };

//   // Fetch playlist count
//   const fetchPlaylistCount = async (playlistId) => {
//     try {
//       const response = await fetch(
//         `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${playlistId}&key=${API_KEY}`
//       );
//       const data = await response.json();

//       if (data.items && data.items.length > 0) {
//         const count = data.items[0].contentDetails.itemCount;
//         setPlaylistCounts((prev) => ({
//           ...prev,
//           [playlistId]: count,
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching playlist count:", error);
//     }
//   };

//   // Fetch playlist thumbnail
//   const fetchPlaylistThumbnail = async (playlistId) => {
//     try {
//       const response = await fetch(
//         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${API_KEY}`
//       );
//       const data = await response.json();

//       if (data.items && data.items.length > 0) {
//         const thumbnail = data.items[0].snippet.thumbnails.high.url;
//         setPlaylistThumbnails((prev) => ({
//           ...prev,
//           [playlistId]: thumbnail,
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching playlist thumbnail:", error);
//     }
//   };

//   useEffect(() => {
//     playlists.forEach((playlist) => {
//       fetchPlaylistThumbnail(playlist.playlistId);
//       fetchPlaylistCount(playlist.playlistId);
//     });
//   }, []);

//   const handlePlaylistClick = async (playlist) => {
//     setSelectedPlaylist(playlist);
//     await fetchPlaylistVideos(playlist.playlistId);
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 260, damping: 20 },
//     },
//   };

//   const heroVariants = {
//     hidden: { opacity: 0, y: -30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   // Floating elements for background
//   const floatingElements = [...Array(6)].map((_, i) => (
//     <motion.div
//       key={i}
//       className="absolute rounded-full opacity-10"
//       style={{
//         backgroundColor: i % 2 === 0 ? "#00ADB5" : "#61DAFB",
//         width: 100 + i * 40,
//         height: 100 + i * 40,
//         top: `${Math.random() * 100}%`,
//         left: `${Math.random() * 100}%`,
//         filter: "blur(60px)",
//       }}
//       animate={{
//         y: [0, -50, 0],
//         x: [0, Math.random() * 30 - 15, 0],
//         scale: [1, 1.2, 1],
//       }}
//       transition={{
//         duration: 10 + i * 2,
//         repeat: Infinity,
//         ease: "easeInOut",
//       }}
//     />
//   ));

//   return (
//     <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#0A0F1C" }}>
//       {/* Animated Background */}
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Grid Pattern */}
//         <div
//           className="absolute inset-0 opacity-5"
//           style={{
//             backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
//                              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
//             backgroundSize: "50px 50px",
//           }}
//         />
        
//         {/* Floating Elements */}
//         {floatingElements}
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 container mx-auto px-4 py-8">
//         {/* Hero Section - Exactly like Home Page */}
//         <motion.div
//           variants={heroVariants}
//           initial="hidden"
//           animate="visible"
//           className="text-center mb-16 pt-8"
//         >
//           <motion.div
//             animate={{
//               rotate: 360,
//               scale: [1, 1.1, 1],
//             }}
//             transition={{
//               rotate: { duration: 20, repeat: Infinity, ease: "linear" },
//               scale: { duration: 2, repeat: Infinity },
//             }}
//             className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
//             style={{
//               background: "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
//               boxShadow: "0 20px 60px rgba(0, 173, 181, 0.4)",
//             }}
//           >
//             <Code className="text-white" size={40} />
//           </motion.div>

//           <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
//             Code Along With{" "}
//             <span className="bg-gradient-to-r from-[#00ADB5] via-[#61DAFB] to-[#00ADB5] bg-clip-text text-transparent">
//               Videos
//             </span>
//           </h1>

//           <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8">
//             Watch, code, and master modern technologies with our interactive video platform.
//             Real-time coding environment, instant feedback, and expert-led tutorials.
//           </p>

//           {/* Stats - Like Home Page */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="flex justify-center gap-8 mb-10"
//           >
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white mb-1">10,000+</div>
//               <div className="text-sm text-gray-400">Developers Learning Daily</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white mb-1">500+</div>
//               <div className="text-sm text-gray-400">Video Tutorials</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white mb-1">4.9★</div>
//               <div className="text-sm text-gray-400">User Rating</div>
//             </div>
//           </motion.div>

//           {/* Search Bar - Enhanced */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="max-w-2xl mx-auto relative"
//           >
//             <div className="relative group">
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search tutorials, courses, or topics..."
//                 className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300 text-lg"
//                 style={{ backgroundColor: "rgba(57, 62, 70, 0.4)" }}
//               />
//               <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]" size={22} />
              
//               {/* Search Button */}
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-xl font-medium flex items-center gap-2"
//                 style={{
//                   background: "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
//                   color: "#FFFFFF",
//                 }}
//               >
//                 <Zap size={18} />
//                 <span>Search</span>
//               </motion.button>
//             </div>

//             {/* Popular Searches */}
//             <div className="flex flex-wrap justify-center gap-2 mt-4">
//               {["JavaScript", "React", "Python", "HTML", "CSS"].map((tag, idx) => (
//                 <motion.button
//                   key={idx}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setSearchTerm(tag)}
//                   className="px-3 py-1 rounded-full text-xs font-medium"
//                   style={{
//                     backgroundColor: "rgba(0, 173, 181, 0.1)",
//                     border: "1px solid rgba(0, 173, 181, 0.3)",
//                     color: "#00ADB5",
//                   }}
//                 >
//                   {tag}
//                 </motion.button>
//               ))}
//             </div>
//           </motion.div>

//           {/* CTA Buttons - Like Home Page */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="flex flex-wrap justify-center gap-4 mt-10"
//           >
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onHoverStart={() => setIsHovered(true)}
//               onHoverEnd={() => setIsHovered(false)}
//               className="px-8 py-4 rounded-xl font-bold flex items-center gap-2 relative overflow-hidden group"
//               style={{
//                 background: "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
//                 color: "#FFFFFF",
//               }}
//             >
//               <Sparkles size={20} />
//               <span>Start Free Journey</span>
//               <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
//               <motion.div
//                 className="absolute inset-0"
//                 style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
//                 initial={{ x: "-100%" }}
//                 animate={{ x: isHovered ? 0 : "-100%" }}
//                 transition={{ duration: 0.3 }}
//               />
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="px-8 py-4 rounded-xl font-bold flex items-center gap-2 border-2"
//               style={{
//                 borderColor: "#00ADB5",
//                 color: "#FFFFFF",
//               }}
//             >
//               <Code size={20} />
//               <span>Try Code Editor</span>
//             </motion.button>
//           </motion.div>
//         </motion.div>

//         {/* Categories Section */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="mb-12"
//         >
//           <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
//             <TrendingUp className="text-[#00ADB5]" size={24} />
//             Popular Categories
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//             {["JavaScript", "Python", "React", "HTML/CSS", "C++", "Database"].map((cat, idx) => (
//               <motion.div
//                 key={idx}
//                 variants={itemVariants}
//                 whileHover={{ y: -5, scale: 1.02 }}
//                 className="p-4 rounded-xl text-center cursor-pointer"
//                 style={{
//                   backgroundColor: "rgba(57, 62, 70, 0.4)",
//                   border: "1px solid rgba(255, 255, 255, 0.1)",
//                   backdropFilter: "blur(10px)",
//                 }}
//                 onClick={() => setSearchTerm(cat)}
//               >
//                 <BookOpen className="mx-auto mb-2 text-[#00ADB5]" size={24} />
//                 <h3 className="text-white text-sm font-medium">{cat}</h3>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* ONE SHOT VIDEOS SECTION */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="mb-16"
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//               <Zap className="text-[#00ADB5]" size={24} />
//               One Shot Videos
//               <span className="text-sm font-normal text-gray-400 ml-2">
//                 ({filteredVideos.length} videos)
//               </span>
//             </h2>
//             <motion.button
//               whileHover={{ x: 5 }}
//               className="text-[#00ADB5] flex items-center gap-1 text-sm"
//             >
//               View All <ChevronRight size={16} />
//             </motion.button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredVideos.map((video, index) => (
//               <motion.div
//                 key={video.id}
//                 variants={itemVariants}
//                 custom={index}
//                 whileHover={{ y: -8, scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => navigate(`/editor/${video.id}`)}
//                 className="group relative cursor-pointer rounded-xl overflow-hidden"
//                 style={{
//                   backgroundColor: "#393E46",
//                   border: "1px solid rgba(255,255,255,0.1)",
//                   boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 <div className="relative aspect-video overflow-hidden">
//                   <img
//                     src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
//                     alt={video.title}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
//                   {/* Play Button Overlay */}
//                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <motion.div
//                       whileHover={{ scale: 1.1 }}
//                       className="w-14 h-14 rounded-full flex items-center justify-center"
//                       style={{ backgroundColor: "#00ADB5" }}
//                     >
//                       <Play className="text-white" size={24} fill="white" />
//                     </motion.div>
//                   </div>

//                   {/* Duration Badge */}
//                   <span
//                     className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
//                     style={{ backgroundColor: "#222831", color: "#EEEEEE" }}
//                   >
//                     <Clock size={12} />
//                     {video.duration}
//                   </span>
//                 </div>

//                 <div className="p-4">
//                   <h3 className="font-medium text-sm line-clamp-2 mb-1" style={{ color: "#EEEEEE" }}>
//                     {video.title}
//                   </h3>
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs" style={{ color: "#00ADB5" }}>
//                       {video.category}
//                     </span>
//                     <div className="flex items-center gap-1">
//                       <Star size={12} className="text-yellow-500 fill-yellow-500" />
//                       <span className="text-xs text-gray-400">4.8</span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* PLAYLISTS SECTION */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="mb-16"
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//               <ListVideo className="text-[#00ADB5]" size={24} />
//               Learning Playlists
//               <span className="text-sm font-normal text-gray-400 ml-2">
//                 ({filteredPlaylists.length} playlists)
//               </span>
//             </h2>
//             <motion.button
//               whileHover={{ x: 5 }}
//               className="text-[#00ADB5] flex items-center gap-1 text-sm"
//             >
//               Browse All <ChevronRight size={16} />
//             </motion.button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredPlaylists.map((playlist, index) => (
//               <motion.div
//                 key={playlist.id}
//                 variants={itemVariants}
//                 custom={index}
//                 whileHover={{ y: -8, scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => handlePlaylistClick(playlist)}
//                 className="group relative cursor-pointer rounded-xl overflow-hidden"
//                 style={{
//                   backgroundColor: "#393E46",
//                   border: "1px solid rgba(255,255,255,0.1)",
//                   boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 <div className="relative aspect-video overflow-hidden">
//                   {playlistThumbnails[playlist.playlistId] ? (
//                     <img
//                       src={playlistThumbnails[playlist.playlistId]}
//                       alt={playlist.title}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <div className="w-8 h-8 border-2 border-[#00ADB5] border-t-transparent rounded-full animate-spin" />
//                     </div>
//                   )}
                  
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
//                   {/* Playlist Overlay */}
//                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <motion.div
//                       whileHover={{ scale: 1.1 }}
//                       className="w-14 h-14 rounded-full flex items-center justify-center"
//                       style={{ backgroundColor: "#00ADB5" }}
//                     >
//                       <ListVideo className="text-white" size={24} />
//                     </motion.div>
//                   </div>

//                   {/* Video Count Badge */}
//                   <span
//                     className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
//                     style={{ backgroundColor: "#222831", color: "#EEEEEE" }}
//                   >
//                     <Clock size={12} />
//                     {playlistCounts[playlist.playlistId]
//                       ? `${playlistCounts[playlist.playlistId]} videos`
//                       : "..."}
//                   </span>

//                   {/* Level Badge */}
//                   <span
//                     className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium"
//                     style={{
//                       backgroundColor: playlist.level === "Beginner" ? "#10B981" : 
//                                      playlist.level === "Intermediate" ? "#F59E0B" : "#EF4444",
//                       color: "#FFFFFF",
//                     }}
//                   >
//                     {playlist.level}
//                   </span>
//                 </div>

//                 <div className="p-4">
//                   <h3 className="font-medium text-sm line-clamp-1 mb-1" style={{ color: "#EEEEEE" }}>
//                     {playlist.title}
//                   </h3>
//                   <p className="text-xs text-gray-400 line-clamp-1 mb-2">
//                     {playlist.description}
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-1">
//                       <Users size={12} className="text-gray-400" />
//                       <span className="text-xs text-gray-400">2.5k+ learners</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Star size={12} className="text-yellow-500 fill-yellow-500" />
//                       <span className="text-xs text-gray-400">4.9</span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* PLAYLIST MODAL */}
//         <AnimatePresence>
//           {selectedPlaylist && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-50 flex items-center justify-center p-4"
//               style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
//               onClick={() => setSelectedPlaylist(null)}
//             >
//               <motion.div
//                 initial={{ scale: 0.9, y: 20 }}
//                 animate={{ scale: 1, y: 0 }}
//                 exit={{ scale: 0.9, y: 20 }}
//                 transition={{ type: "spring", damping: 25, stiffness: 300 }}
//                 className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden"
//                 style={{ backgroundColor: "#222831", border: "1px solid rgba(255,255,255,0.1)" }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Modal Header */}
//                 <div
//                   className="flex items-center justify-between p-6 border-b"
//                   style={{ borderColor: "#393E46" }}
//                 >
//                   <div>
//                     <h3 className="text-2xl font-bold" style={{ color: "#00ADB5" }}>
//                       {selectedPlaylist.title}
//                     </h3>
//                     <p className="text-sm text-gray-400 mt-1">
//                       {playlistVideos.length} videos • {selectedPlaylist.level} Level
//                     </p>
//                   </div>
//                   <motion.button
//                     whileHover={{ scale: 1.1, rotate: 90 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => setSelectedPlaylist(null)}
//                     className="w-10 h-10 rounded-full flex items-center justify-center"
//                     style={{ backgroundColor: "#393E46" }}
//                   >
//                     <X size={18} style={{ color: "#EEEEEE" }} />
//                   </motion.button>
//                 </div>

//                 {/* Modal Body - Video List */}
//                 <div className="overflow-y-auto p-6 max-h-[60vh]" style={{ scrollbarWidth: "thin", scrollbarColor: "#00ADB5 #393E46" }}>
//                   {loading[selectedPlaylist.playlistId] ? (
//                     <div className="flex justify-center py-12">
//                       <div className="w-12 h-12 border-3 border-[#00ADB5] border-t-transparent rounded-full animate-spin" />
//                     </div>
//                   ) : (
//                     <div className="space-y-3">
//                       {playlistVideos.map((video, index) => (
//                         <motion.div
//                           key={video.videoId}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.02 }}
//                           whileHover={{ scale: 1.01, x: 4 }}
//                           onClick={() => {
//                             setSelectedPlaylist(null);
//                             navigate(`/editor/${video.videoId}`);
//                           }}
//                           className="flex items-center gap-4 p-4 rounded-xl cursor-pointer"
//                           style={{
//                             backgroundColor: "#393E46",
//                             border: "1px solid transparent",
//                           }}
                          
//                         >
//                           <span className="text-lg font-bold text-gray-400 w-8">
//                             {index + 1}
//                           </span>
//                           <img
//                             src={video.thumbnail}
//                             alt=""
//                             className="w-32 h-20 object-cover rounded-lg"
//                           />
//                           <div className="flex-1">
//                             <p className="text-sm font-medium line-clamp-2" style={{ color: "#EEEEEE" }}>
//                               {video.title}
//                             </p>
//                           </div>
//                           <motion.div
//                             whileHover={{ scale: 1.1 }}
//                             className="w-10 h-10 rounded-full flex items-center justify-center"
//                             style={{ backgroundColor: "#00ADB5" }}
//                           >
//                             <Play size={16} className="text-white" fill="white" />
//                           </motion.div>
//                         </motion.div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default Coursespage;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Play, 
//   X, 
//   Clock, 
//   ListVideo, 
//   Search,
//   Code,
//   Sparkles,
//   TrendingUp,
//   BookOpen,
//   ChevronRight,
//   Star,
//   Users,
//   Zap
// } from "lucide-react";

// const API_KEY = "AIzaSyDmeQc7z165tiV0ZOQz_2W5tkXZMLvR-Kc";

// const Coursespage = () => {
//   const navigate = useNavigate();

//   const [selectedPlaylist, setSelectedPlaylist] = useState(null);
//   const [playlistVideos, setPlaylistVideos] = useState([]);
//   const [playlistThumbnails, setPlaylistThumbnails] = useState({});
//   const [playlistCounts, setPlaylistCounts] = useState({});
//   const [loading, setLoading] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isHovered, setIsHovered] = useState(false);

//   const videos = [
//     { id: "W6NZfCO5SIk", title: "JavaScript Basics", category: "JavaScript", duration: "2.5 hrs" },
//     { id: "ESnrn1kAD4E", title: "CSS Tutorial for Beginners", category: "CSS", duration: "3 hrs" },
//     { id: "ajdRvxDWH4w", title: "JavaScript Full Course", category: "JavaScript", duration: "8 hrs" },
//     { id: "HcOc7P5BMi4", title: "HTML Tutorial for Beginners", category: "HTML", duration: "2 hrs" },
//     { id: "e7sAf4SbS_g", title: "Complete C++ Tutorial", category: "C++", duration: "10 hrs" },
//   ];

//   const playlists = [
//     {
//       id: "html01",
//       title: "HTML Complete Course",
//       description: "Learn HTML from scratch",
//       playlistId: "PLu71SKxNbfoDBNF5s-WH6aLbthSEIMhMI",
//       level: "Beginner",
//     },
//     {
//       id: "css01",
//       title: "CSS Introduction",
//       description: "Master CSS styling",
//       playlistId: "PLhzIaPMgkbxBk9-drEC0MBPqEOXpVlwY4",
//       level: "Beginner",
//     },
//     {
//       id: "js01",
//       title: "JavaScript for beginners",
//       description: "Complete JS course",
//       playlistId: "PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37",
//       level: "Intermediate",
//     },
//     {
//       id: "py01",
//       title: "Introduction to Python",
//       description: "Python programming basics",
//       playlistId: "PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
//       level: "Beginner",
//     },
//     {
//       id: "cpp01",
//       title: "Introduction to C++",
//       description: "C++ programming fundamentals",
//       playlistId: "PLxCzCOWd7aiF6yRNI5OHQsnUJQfl7Geqj",
//       level: "Intermediate",
//     },
//     {
//       id: "react01",
//       title: "React.js Complete Guide",
//       description: "Build modern UIs with React",
//       playlistId: "PLu71SKxNbfoDq-9KtMmy-4kF2HtE2F3zL",
//       level: "Advanced",
//     },
//   ];

//   // Filter playlists based on search
//   const filteredPlaylists = playlists.filter(playlist =>
//     playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     playlist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     playlist.level.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredVideos = videos.filter(video =>
//     video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     video.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Fetch playlist videos
//   const fetchPlaylistVideos = async (playlistId) => {
//     setLoading((prev) => ({ ...prev, [playlistId]: true }));
//     let videos = [];
//     let nextPageToken = "";

//     try {
//       do {
//         const response = await fetch(
//           `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}&pageToken=${nextPageToken}`
//         );
//         const data = await response.json();

//         const newVideos = data.items.map((item) => ({
//           videoId: item.snippet.resourceId.videoId,
//           title: item.snippet.title,
//           thumbnail: item.snippet.thumbnails.medium.url,
//         }));

//         videos = [...videos, ...newVideos];
//         nextPageToken = data.nextPageToken;
//       } while (nextPageToken);
//       setPlaylistVideos(videos);
//     } catch (error) {
//       console.error("Error fetching playlist videos:", error);
//     } finally {
//       setLoading((prev) => ({ ...prev, [playlistId]: false }));
//     }
//   };

//   // Fetch playlist count
//   const fetchPlaylistCount = async (playlistId) => {
//     try {
//       const response = await fetch(
//         `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${playlistId}&key=${API_KEY}`
//       );
//       const data = await response.json();

//       if (data.items && data.items.length > 0) {
//         const count = data.items[0].contentDetails.itemCount;
//         setPlaylistCounts((prev) => ({
//           ...prev,
//           [playlistId]: count,
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching playlist count:", error);
//     }
//   };

//   // Fetch playlist thumbnail
//   const fetchPlaylistThumbnail = async (playlistId) => {
//     try {
//       const response = await fetch(
//         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${API_KEY}`
//       );
//       const data = await response.json();

//       if (data.items && data.items.length > 0) {
//         const thumbnail = data.items[0].snippet.thumbnails.high.url;
//         setPlaylistThumbnails((prev) => ({
//           ...prev,
//           [playlistId]: thumbnail,
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching playlist thumbnail:", error);
//     }
//   };

//   useEffect(() => {
//     playlists.forEach((playlist) => {
//       fetchPlaylistThumbnail(playlist.playlistId);
//       fetchPlaylistCount(playlist.playlistId);
//     });
//   }, []);

//   const handlePlaylistClick = async (playlist) => {
//     setSelectedPlaylist(playlist);
//     await fetchPlaylistVideos(playlist.playlistId);
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 260, damping: 20 },
//     },
//   };

//   const heroVariants = {
//     hidden: { opacity: 0, y: -30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   // Floating elements for background
//   const floatingElements = [...Array(6)].map((_, i) => (
//     <motion.div
//       key={i}
//       className="absolute rounded-full opacity-10"
//       style={{
//         backgroundColor: i % 2 === 0 ? "#00ADB5" : "#61DAFB",
//         width: 100 + i * 40,
//         height: 100 + i * 40,
//         top: `${Math.random() * 100}%`,
//         left: `${Math.random() * 100}%`,
//         filter: "blur(60px)",
//       }}
//       animate={{
//         y: [0, -50, 0],
//         x: [0, Math.random() * 30 - 15, 0],
//         scale: [1, 1.2, 1],
//       }}
//       transition={{
//         duration: 10 + i * 2,
//         repeat: Infinity,
//         ease: "easeInOut",
//       }}
//     />
//   ));

//   return (
//     <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#0A0F1C" }}>
//       {/* Animated Background */}
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Grid Pattern */}
//         <div
//           className="absolute inset-0 opacity-5"
//           style={{
//             backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
//                              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
//             backgroundSize: "50px 50px",
//           }}
//         />
        
//         {/* Floating Elements */}
//         {floatingElements}
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 container mx-auto px-4 py-8">
//         {/* Hero Section - Exactly like Home Page */}
//         <motion.div
//           variants={heroVariants}
//           initial="hidden"
//           animate="visible"
//           className="text-center mb-16 pt-8"
//         >
//           <motion.div
//             animate={{
//               rotate: 360,
//               scale: [1, 1.1, 1],
//             }}
//             transition={{
//               rotate: { duration: 20, repeat: Infinity, ease: "linear" },
//               scale: { duration: 2, repeat: Infinity },
//             }}
//             className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
//             style={{
//               background: "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
//               boxShadow: "0 20px 60px rgba(0, 173, 181, 0.4)",
//             }}
//           >
//             <Code className="text-white" size={40} />
//           </motion.div>

//           <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
//             Code Along With{" "}
//             <span className="bg-gradient-to-r from-[#00ADB5] via-[#61DAFB] to-[#00ADB5] bg-clip-text text-transparent">
//               Videos
//             </span>
//           </h1>

//           <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8">
//             Watch, code, and master modern technologies with our interactive video platform.
//             Real-time coding environment, instant feedback, and expert-led tutorials.
//           </p>

//           {/* Stats - Like Home Page */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="flex justify-center gap-8 mb-10"
//           >
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white mb-1">10,000+</div>
//               <div className="text-sm text-gray-400">Developers Learning Daily</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white mb-1">500+</div>
//               <div className="text-sm text-gray-400">Video Tutorials</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white mb-1">4.9★</div>
//               <div className="text-sm text-gray-400">User Rating</div>
//             </div>
//           </motion.div>

//           {/* Search Bar - Enhanced */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="max-w-2xl mx-auto relative"
//           >
//             <div className="relative group">
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search tutorials, courses, or topics..."
//                 className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300 text-lg"
//                 style={{ backgroundColor: "rgba(57, 62, 70, 0.4)" }}
//               />
//               <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]" size={22} />
              
//               {/* Search Button */}
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-xl font-medium flex items-center gap-2"
//                 style={{
//                   background: "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
//                   color: "#FFFFFF",
//                 }}
//               >
//                 <Zap size={18} />
//                 <span>Search</span>
//               </motion.button>
//             </div>

//             {/* Popular Searches */}
//             <div className="flex flex-wrap justify-center gap-2 mt-4">
//               {["JavaScript", "React", "Python", "HTML", "CSS"].map((tag, idx) => (
//                 <motion.button
//                   key={idx}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setSearchTerm(tag)}
//                   className="px-3 py-1 rounded-full text-xs font-medium"
//                   style={{
//                     backgroundColor: "rgba(0, 173, 181, 0.1)",
//                     border: "1px solid rgba(0, 173, 181, 0.3)",
//                     color: "#00ADB5",
//                   }}
//                 >
//                   {tag}
//                 </motion.button>
//               ))}
//             </div>
//           </motion.div>

//           {/* CTA Buttons - Like Home Page */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="flex flex-wrap justify-center gap-4 mt-10"
//           >
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onHoverStart={() => setIsHovered(true)}
//               onHoverEnd={() => setIsHovered(false)}
//               className="px-8 py-4 rounded-xl font-bold flex items-center gap-2 relative overflow-hidden group"
//               style={{
//                 background: "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
//                 color: "#FFFFFF",
//               }}
//             >
//               <Sparkles size={20} />
//               <span>Start Free Journey</span>
//               <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
//               <motion.div
//                 className="absolute inset-0"
//                 style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
//                 initial={{ x: "-100%" }}
//                 animate={{ x: isHovered ? 0 : "-100%" }}
//                 transition={{ duration: 0.3 }}
//               />
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="px-8 py-4 rounded-xl font-bold flex items-center gap-2 border-2"
//               style={{
//                 borderColor: "#00ADB5",
//                 color: "#FFFFFF",
//               }}
//             >
//               <Code size={20} />
//               <span>Try Code Editor</span>
//             </motion.button>
//           </motion.div>
//         </motion.div>

//         {/* Categories Section */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="mb-12"
//         >
//           <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
//             <TrendingUp className="text-[#00ADB5]" size={24} />
//             Popular Categories
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//             {["JavaScript", "Python", "React", "HTML/CSS", "C++", "Database"].map((cat, idx) => (
//               <motion.div
//                 key={idx}
//                 variants={itemVariants}
//                 whileHover={{ y: -5, scale: 1.02 }}
//                 className="p-4 rounded-xl text-center cursor-pointer"
//                 style={{
//                   backgroundColor: "rgba(57, 62, 70, 0.4)",
//                   border: "1px solid rgba(255, 255, 255, 0.1)",
//                   backdropFilter: "blur(10px)",
//                 }}
//                 onClick={() => setSearchTerm(cat)}
//               >
//                 <BookOpen className="mx-auto mb-2 text-[#00ADB5]" size={24} />
//                 <h3 className="text-white text-sm font-medium">{cat}</h3>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* ONE SHOT VIDEOS SECTION */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="mb-16"
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//               <Zap className="text-[#00ADB5]" size={24} />
//               One Shot Videos
//               <span className="text-sm font-normal text-gray-400 ml-2">
//                 ({filteredVideos.length} videos)
//               </span>
//             </h2>
//             <motion.button
//               whileHover={{ x: 5 }}
//               className="text-[#00ADB5] flex items-center gap-1 text-sm"
//             >
//               View All <ChevronRight size={16} />
//             </motion.button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredVideos.map((video, index) => (
//               <motion.div
//                 key={video.id}
//                 variants={itemVariants}
//                 custom={index}
//                 whileHover={{ y: -8, scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => navigate(`/editor/${video.id}`)}
//                 className="group relative cursor-pointer rounded-xl overflow-hidden"
//                 style={{
//                   backgroundColor: "#393E46",
//                   border: "1px solid rgba(255,255,255,0.1)",
//                   boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 <div className="relative aspect-video overflow-hidden">
//                   <img
//                     src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
//                     alt={video.title}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
//                   {/* Play Button Overlay */}
//                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <motion.div
//                       whileHover={{ scale: 1.1 }}
//                       className="w-14 h-14 rounded-full flex items-center justify-center"
//                       style={{ backgroundColor: "#00ADB5" }}
//                     >
//                       <Play className="text-white" size={24} fill="white" />
//                     </motion.div>
//                   </div>

//                   {/* Duration Badge */}
//                   <span
//                     className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
//                     style={{ backgroundColor: "#222831", color: "#EEEEEE" }}
//                   >
//                     <Clock size={12} />
//                     {video.duration}
//                   </span>
//                 </div>

//                 <div className="p-4">
//                   <h3 className="font-medium text-sm line-clamp-2 mb-1" style={{ color: "#EEEEEE" }}>
//                     {video.title}
//                   </h3>
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs" style={{ color: "#00ADB5" }}>
//                       {video.category}
//                     </span>
//                     <div className="flex items-center gap-1">
//                       <Star size={12} className="text-yellow-500 fill-yellow-500" />
//                       <span className="text-xs text-gray-400">4.8</span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* PLAYLISTS SECTION */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="mb-16"
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//               <ListVideo className="text-[#00ADB5]" size={24} />
//               Learning Playlists
//               <span className="text-sm font-normal text-gray-400 ml-2">
//                 ({filteredPlaylists.length} playlists)
//               </span>
//             </h2>
//             <motion.button
//               whileHover={{ x: 5 }}
//               className="text-[#00ADB5] flex items-center gap-1 text-sm"
//             >
//               Browse All <ChevronRight size={16} />
//             </motion.button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredPlaylists.map((playlist, index) => (
//               <motion.div
//                 key={playlist.id}
//                 variants={itemVariants}
//                 custom={index}
//                 whileHover={{ y: -8, scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => handlePlaylistClick(playlist)}
//                 className="group relative cursor-pointer rounded-xl overflow-hidden"
//                 style={{
//                   backgroundColor: "#393E46",
//                   border: "1px solid rgba(255,255,255,0.1)",
//                   boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 <div className="relative aspect-video overflow-hidden">
//                   {playlistThumbnails[playlist.playlistId] ? (
//                     <img
//                       src={playlistThumbnails[playlist.playlistId]}
//                       alt={playlist.title}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <div className="w-8 h-8 border-2 border-[#00ADB5] border-t-transparent rounded-full animate-spin" />
//                     </div>
//                   )}
                  
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
//                   {/* Playlist Overlay */}
//                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <motion.div
//                       whileHover={{ scale: 1.1 }}
//                       className="w-14 h-14 rounded-full flex items-center justify-center"
//                       style={{ backgroundColor: "#00ADB5" }}
//                     >
//                       <ListVideo className="text-white" size={24} />
//                     </motion.div>
//                   </div>

//                   {/* Video Count Badge */}
//                   <span
//                     className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
//                     style={{ backgroundColor: "#222831", color: "#EEEEEE" }}
//                   >
//                     <Clock size={12} />
//                     {playlistCounts[playlist.playlistId]
//                       ? `${playlistCounts[playlist.playlistId]} videos`
//                       : "..."}
//                   </span>

//                   {/* Level Badge */}
//                   <span
//                     className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium"
//                     style={{
//                       backgroundColor: playlist.level === "Beginner" ? "#10B981" : 
//                                      playlist.level === "Intermediate" ? "#F59E0B" : "#EF4444",
//                       color: "#FFFFFF",
//                     }}
//                   >
//                     {playlist.level}
//                   </span>
//                 </div>

//                 <div className="p-4">
//                   <h3 className="font-medium text-sm line-clamp-1 mb-1" style={{ color: "#EEEEEE" }}>
//                     {playlist.title}
//                   </h3>
//                   <p className="text-xs text-gray-400 line-clamp-1 mb-2">
//                     {playlist.description}
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-1">
//                       <Users size={12} className="text-gray-400" />
//                       <span className="text-xs text-gray-400">2.5k+ learners</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Star size={12} className="text-yellow-500 fill-yellow-500" />
//                       <span className="text-xs text-gray-400">4.9</span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* PLAYLIST MODAL */}
//         <AnimatePresence>
//           {selectedPlaylist && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-50 flex items-center justify-center p-4"
//               style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
//               onClick={() => setSelectedPlaylist(null)}
//             >
//               <motion.div
//                 initial={{ scale: 0.9, y: 20 }}
//                 animate={{ scale: 1, y: 0 }}
//                 exit={{ scale: 0.9, y: 20 }}
//                 transition={{ type: "spring", damping: 25, stiffness: 300 }}
//                 className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden"
//                 style={{ backgroundColor: "#222831", border: "1px solid rgba(255,255,255,0.1)" }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Modal Header */}
//                 <div
//                   className="flex items-center justify-between p-6 border-b"
//                   style={{ borderColor: "#393E46" }}
//                 >
//                   <div>
//                     <h3 className="text-2xl font-bold" style={{ color: "#00ADB5" }}>
//                       {selectedPlaylist.title}
//                     </h3>
//                     <p className="text-sm text-gray-400 mt-1">
//                       {playlistVideos.length} videos • {selectedPlaylist.level} Level
//                     </p>
//                   </div>
//                   <motion.button
//                     whileHover={{ scale: 1.1, rotate: 90 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => setSelectedPlaylist(null)}
//                     className="w-10 h-10 rounded-full flex items-center justify-center"
//                     style={{ backgroundColor: "#393E46" }}
//                   >
//                     <X size={18} style={{ color: "#EEEEEE" }} />
//                   </motion.button>
//                 </div>

//                 {/* Modal Body - Video List */}
//                 <div className="overflow-y-auto p-6 max-h-[60vh]" style={{ scrollbarWidth: "thin", scrollbarColor: "#00ADB5 #393E46" }}>
//                   {loading[selectedPlaylist.playlistId] ? (
//                     <div className="flex justify-center py-12">
//                       <div className="w-12 h-12 border-3 border-[#00ADB5] border-t-transparent rounded-full animate-spin" />
//                     </div>
//                   ) : (
//                     <div className="space-y-3">
//                       {playlistVideos.map((video, index) => (
//                         <motion.div
//                           key={video.videoId}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.02 }}
//                           whileHover={{ scale: 1.01, x: 4 }}
//                           onClick={() => {
//                             setSelectedPlaylist(null);
//                             navigate(`/editor/${video.videoId}`);
//                           }}
//                           className="flex items-center gap-4 p-4 rounded-xl cursor-pointer"
//                           style={{
//                             backgroundColor: "#393E46",
//                             border: "1px solid transparent",
//                           }}
                          
//                         >
//                           <span className="text-lg font-bold text-gray-400 w-8">
//                             {index + 1}
//                           </span>
//                           <img
//                             src={video.thumbnail}
//                             alt=""
//                             className="w-32 h-20 object-cover rounded-lg"
//                           />
//                           <div className="flex-1">
//                             <p className="text-sm font-medium line-clamp-2" style={{ color: "#EEEEEE" }}>
//                               {video.title}
//                             </p>
//                           </div>
//                           <motion.div
//                             whileHover={{ scale: 1.1 }}
//                             className="w-10 h-10 rounded-full flex items-center justify-center"
//                             style={{ backgroundColor: "#00ADB5" }}
//                           >
//                             <Play size={16} className="text-white" fill="white" />
//                           </motion.div>
//                         </motion.div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default Coursespage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  X, 
  Clock, 
  ListVideo, 
  Search,
  Code,
  Sparkles,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Star,
  Users,
  Zap,
  Maximize2,
  Minimize2
} from "lucide-react";

const API_KEY = "AIzaSyDmeQc7z165tiV0ZOQz_2W5tkXZMLvR-Kc";

const Coursespage = () => {
  const navigate = useNavigate();

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [playlistThumbnails, setPlaylistThumbnails] = useState({});
  const [playlistCounts, setPlaylistCounts] = useState({});
  const [loading, setLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null); // new state for video modal

  const videos = [
    { id: "W6NZfCO5SIk", title: "JavaScript Basics", category: "JavaScript", duration: "2.5 hrs" },
    { id: "ESnrn1kAD4E", title: "CSS Tutorial for Beginners", category: "CSS", duration: "3 hrs" },
    { id: "ajdRvxDWH4w", title: "JavaScript Full Course", category: "JavaScript", duration: "8 hrs" },
    { id: "HcOc7P5BMi4", title: "HTML Tutorial for Beginners", category: "HTML", duration: "2 hrs" },
    { id: "e7sAf4SbS_g", title: "Complete C++ Tutorial", category: "C++", duration: "10 hrs" },
  ];

  const playlists = [
    {
      id: "html01",
      title: "HTML Complete Course",
      description: "Learn HTML from scratch",
      playlistId: "PLu71SKxNbfoDBNF5s-WH6aLbthSEIMhMI",
      level: "Beginner",
    },
    {
      id: "css01",
      title: "CSS Introduction",
      description: "Master CSS styling",
      playlistId: "PLhzIaPMgkbxBk9-drEC0MBPqEOXpVlwY4",
      level: "Beginner",
    },
    {
      id: "js01",
      title: "JavaScript for beginners",
      description: "Complete JS course",
      playlistId: "PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37",
      level: "Intermediate",
    },
    {
      id: "py01",
      title: "Introduction to Python",
      description: "Python programming basics",
      playlistId: "PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
      level: "Beginner",
    },
    {
      id: "cpp01",
      title: "Introduction to C++",
      description: "C++ programming fundamentals",
      playlistId: "PLxCzCOWd7aiF6yRNI5OHQsnUJQfl7Geqj",
      level: "Intermediate",
    },
    {
      id: "react01",
      title: "React.js Complete Guide",
      description: "Build modern UIs with React",
      playlistId: "PLu71SKxNbfoDq-9KtMmy-4kF2HtE2F3zL",
      level: "Advanced",
    },
  ];

  // Filter playlists based on search
  const filteredPlaylists = playlists.filter(playlist =>
    playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    playlist.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch playlist videos
  const fetchPlaylistVideos = async (playlistId) => {
    setLoading((prev) => ({ ...prev, [playlistId]: true }));
    let videos = [];
    let nextPageToken = "";

    try {
      do {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}&pageToken=${nextPageToken}`
        );
        const data = await response.json();

        const newVideos = data.items.map((item) => ({
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
        }));

        videos = [...videos, ...newVideos];
        nextPageToken = data.nextPageToken;
      } while (nextPageToken);
      setPlaylistVideos(videos);
    } catch (error) {
      console.error("Error fetching playlist videos:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [playlistId]: false }));
    }
  };

  // Fetch playlist count
  const fetchPlaylistCount = async (playlistId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${playlistId}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const count = data.items[0].contentDetails.itemCount;
        setPlaylistCounts((prev) => ({
          ...prev,
          [playlistId]: count,
        }));
      }
    } catch (error) {
      console.error("Error fetching playlist count:", error);
    }
  };

  // Fetch playlist thumbnail
  const fetchPlaylistThumbnail = async (playlistId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const thumbnail = data.items[0].snippet.thumbnails.high.url;
        setPlaylistThumbnails((prev) => ({
          ...prev,
          [playlistId]: thumbnail,
        }));
      }
    } catch (error) {
      console.error("Error fetching playlist thumbnail:", error);
    }
  };

  useEffect(() => {
    playlists.forEach((playlist) => {
      fetchPlaylistThumbnail(playlist.playlistId);
      fetchPlaylistCount(playlist.playlistId);
    });
  }, []);

  const handlePlaylistClick = async (playlist) => {
    setSelectedPlaylist(playlist);
    await fetchPlaylistVideos(playlist.playlistId);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Floating elements for background
  const floatingElements = [...Array(6)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full opacity-10"
      style={{
        backgroundColor: i % 2 === 0 ? "#00ADB5" : "#61DAFB",
        width: 100 + i * 40,
        height: 100 + i * 40,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        filter: "blur(60px)",
      }}
      animate={{
        y: [0, -50, 0],
        x: [0, Math.random() * 30 - 15, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 10 + i * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  ));

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#0A0F1C" }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        
        {/* Floating Elements */}
        {floatingElements}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section - Exactly like Home Page */}
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16 pt-8"
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity },
            }}
            className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
              boxShadow: "0 20px 60px rgba(0, 173, 181, 0.4)",
            }}
          >
            <Code className="text-white" size={40} />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Code Along With{" "}
            <span className="bg-gradient-to-r from-[#00ADB5] via-[#61DAFB] to-[#00ADB5] bg-clip-text text-transparent">
              Videos
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Watch, code, and master modern technologies with our interactive video platform.
            Real-time coding environment, instant feedback, and expert-led tutorials.
          </p>

          {/* Stats - Like Home Page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-8 mb-10"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10,000+</div>
              <div className="text-sm text-gray-400">Developers Learning Daily</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-gray-400">Video Tutorials</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4.9★</div>
              <div className="text-sm text-gray-400">User Rating</div>
            </div>
          </motion.div>

          {/* Search Bar - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto relative"
          >
            <div className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tutorials, courses, or topics..."
                className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300 text-lg"
                style={{ backgroundColor: "rgba(57, 62, 70, 0.4)" }}
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]" size={22} />
              
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-xl font-medium flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
                  color: "#FFFFFF",
                }}
              >
                <Zap size={18} />
                <span>Search</span>
              </motion.button>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["JavaScript", "React", "Python", "HTML", "CSS"].map((tag, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm(tag)}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "rgba(0, 173, 181, 0.1)",
                    border: "1px solid rgba(0, 173, 181, 0.3)",
                    color: "#00ADB5",
                  }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons - Like Home Page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="px-8 py-4 rounded-xl font-bold flex items-center gap-2 relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
                color: "#FFFFFF",
              }}
            >
              <Sparkles size={20} />
              <span>Start Free Journey</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? 0 : "-100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-bold flex items-center gap-2 border-2"
              style={{
                borderColor: "#00ADB5",
                color: "#FFFFFF",
              }}
            >
              <Code size={20} />
              <span>Try Code Editor</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Categories Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <TrendingUp className="text-[#00ADB5]" size={24} />
            Popular Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {["JavaScript", "Python", "React", "HTML/CSS", "C++", "Database"].map((cat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-4 rounded-xl text-center cursor-pointer"
                style={{
                  backgroundColor: "rgba(57, 62, 70, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
                onClick={() => setSearchTerm(cat)}
              >
                <BookOpen className="mx-auto mb-2 text-[#00ADB5]" size={24} />
                <h3 className="text-white text-sm font-medium">{cat}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ONE SHOT VIDEOS SECTION */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="text-[#00ADB5]" size={24} />
              One Shot Videos
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredVideos.length} videos)
              </span>
            </h2>
            <motion.button
              whileHover={{ x: 5 }}
              className="text-[#00ADB5] flex items-center gap-1 text-sm"
            >
              View All <ChevronRight size={16} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedVideo({ id: video.id, title: video.title })} // open modal instead of navigate
                className="group relative cursor-pointer rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "#393E46",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#00ADB5" }}
                    >
                      <Play className="text-white" size={24} fill="white" />
                    </motion.div>
                  </div>

                  {/* Duration Badge */}
                  <span
                    className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                    style={{ backgroundColor: "#222831", color: "#EEEEEE" }}
                  >
                    <Clock size={12} />
                    {video.duration}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1" style={{ color: "#EEEEEE" }}>
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#00ADB5" }}>
                      {video.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-400">4.8</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PLAYLISTS SECTION */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ListVideo className="text-[#00ADB5]" size={24} />
              Learning Playlists
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({filteredPlaylists.length} playlists)
              </span>
            </h2>
            <motion.button
              whileHover={{ x: 5 }}
              className="text-[#00ADB5] flex items-center gap-1 text-sm"
            >
              Browse All <ChevronRight size={16} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaylists.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePlaylistClick(playlist)}
                className="group relative cursor-pointer rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "#393E46",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                <div className="relative aspect-video overflow-hidden">
                  {playlistThumbnails[playlist.playlistId] ? (
                    <img
                      src={playlistThumbnails[playlist.playlistId]}
                      alt={playlist.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-[#00ADB5] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Playlist Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#00ADB5" }}
                    >
                      <ListVideo className="text-white" size={24} />
                    </motion.div>
                  </div>

                  {/* Video Count Badge */}
                  <span
                    className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                    style={{ backgroundColor: "#222831", color: "#EEEEEE" }}
                  >
                    <Clock size={12} />
                    {playlistCounts[playlist.playlistId]
                      ? `${playlistCounts[playlist.playlistId]} videos`
                      : "..."}
                  </span>

                  {/* Level Badge */}
                  <span
                    className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: playlist.level === "Beginner" ? "#10B981" : 
                                     playlist.level === "Intermediate" ? "#F59E0B" : "#EF4444",
                      color: "#FFFFFF",
                    }}
                  >
                    {playlist.level}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-sm line-clamp-1 mb-1" style={{ color: "#EEEEEE" }}>
                    {playlist.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                    {playlist.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-400">2.5k+ learners</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-400">4.9</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PLAYLIST MODAL */}
        <AnimatePresence>
          {selectedPlaylist && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
              onClick={() => setSelectedPlaylist(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#222831", border: "1px solid rgba(255,255,255,0.1)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  className="flex items-center justify-between p-6 border-b"
                  style={{ borderColor: "#393E46" }}
                >
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: "#00ADB5" }}>
                      {selectedPlaylist.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {playlistVideos.length} videos • {selectedPlaylist.level} Level
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPlaylist(null)}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#393E46" }}
                  >
                    <X size={18} style={{ color: "#EEEEEE" }} />
                  </motion.button>
                </div>

                {/* Modal Body - Video List */}
                <div className="overflow-y-auto p-6 max-h-[60vh]" style={{ scrollbarWidth: "thin", scrollbarColor: "#00ADB5 #393E46" }}>
                  {loading[selectedPlaylist.playlistId] ? (
                    <div className="flex justify-center py-12">
                      <div className="w-12 h-12 border-3 border-[#00ADB5] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {playlistVideos.map((video, index) => (
                        <motion.div
                          key={video.videoId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          whileHover={{ scale: 1.01, x: 4 }}
                          onClick={() => {
                            setSelectedPlaylist(null);
                            setSelectedVideo({ id: video.videoId, title: video.title }); // open video modal
                          }}
                          className="flex items-center gap-4 p-4 rounded-xl cursor-pointer"
                          style={{
                            backgroundColor: "#393E46",
                            border: "1px solid transparent",
                          }}
                          
                        >
                          <span className="text-lg font-bold text-gray-400 w-8">
                            {index + 1}
                          </span>
                          <img
                            src={video.thumbnail}
                            alt=""
                            className="w-32 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-2" style={{ color: "#EEEEEE" }}>
                              {video.title}
                            </p>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#00ADB5" }}
                          >
                            <Play size={16} className="text-white" fill="white" />
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VIDEO MODAL - New component */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-4xl rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#222831", border: "1px solid rgba(255,255,255,0.1)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  className="flex items-center justify-between p-4 border-b"
                  style={{ borderColor: "#393E46" }}
                >
                  <h3 className="text-lg font-bold text-white truncate flex-1">
                    {selectedVideo.title}
                  </h3>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const elem = document.querySelector('#video-iframe');
                        if (elem) {
                          if (elem.requestFullscreen) {
                            elem.requestFullscreen();
                          }
                        }
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#393E46" }}
                    >
                      <Maximize2 size={16} style={{ color: "#EEEEEE" }} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedVideo(null)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#393E46" }}
                    >
                      <X size={16} style={{ color: "#EEEEEE" }} />
                    </motion.button>
                  </div>
                </div>

                {/* Video Embed */}
                <div className="aspect-video bg-black">
                  <iframe
                    id="video-iframe"
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Optional: Video description or related links can go here */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Coursespage;