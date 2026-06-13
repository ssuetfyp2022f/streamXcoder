// import React, { useState, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import { useParams } from "react-router-dom";

// const CodingEditor = () => {
//     const { videoId } = useParams();  // Get video ID from URL
//     const [videoUrl, setVideoUrl] = useState("");
//     const [videoSrc, setVideoSrc] = useState("");
//     const [code, setCode] = useState("// Start coding here");
//     const [videoSourceOption, setVideoSourceOption] = useState("");

//     // Helper: Extract YouTube video ID
//     const extractYoutubeId = (url) => {
//         const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/;
//         const match = url.match(regExp);
//         return match ? match[1] : null;
//     };

//     // Load video whenever videoId or videoUrl changes
//     useEffect(() => {
//         if (videoId) {
//             setVideoSrc(`https://www.youtube.com/embed/${videoId}`);
//             return;
//         }

//         if (videoSourceOption === "youtube" && videoUrl) {
//             const id = extractYoutubeId(videoUrl);
//             if (id) setVideoSrc(`https://www.youtube.com/embed/${id}`
//             );
//             else setVideoSrc(videoUrl); // fallback: direct URL
//         }
//     }, [videoId, videoUrl, videoSourceOption]);

//     // Load local video
//     const loadLocalVideo = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         const url = URL.createObjectURL(file);
//         setVideoSrc(url);
//     };

//     return (
//         <div className="h-full flex flex-col bg-[#1b2b55] text-white">

//             {/* TOP BAR */}
//             <div className="p-4 flex flex-wrap gap-4 items-center mt-4 bg-[#0f1f3d] border-b border-white/10 rounded-b-xl">

//                 <div className="relative flex items-center gap-2">
//                     {/* Video Source Selector */}
//                     <select
//                         className="text-sm px-3 py-2 rounded-lg text-[#00ADB5] bg-[#1b2b55] border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50 transition"
//                         value={videoSourceOption}
//                         onChange={(e) => setVideoSourceOption(e.target.value)}
//                     >
//                         <option value="" hidden disabled>Select Video Source</option>
//                         <option value="youtube">YouTube / Video URL</option>
//                         <option value="local">Local Video</option>
//                     </select>

//                     {/* Help Icon */}
//                     {!videoSourceOption && (
//                         <div className="relative group cursor-pointer">
//                             <span className="text-[#00ADB5] font-bold">?</span>
//                             {/* Tooltip */}
//                             <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-64 bg-gray-800 text-white text-xs p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
//                                Select a video source: choose from courses, paste a YouTube URL, paste a URL from other platforms, or upload a local file.
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* YouTube URL Input */}
//                 {videoSourceOption === "youtube" && (
//                     <div className="flex items-end gap-3">
//                         <input
//                             type="text"
//                             placeholder="Paste YouTube or video URL..."
//                             value={videoUrl}
//                             onChange={(e) => setVideoUrl(e.target.value)}
//                             className="px-3 py-2 rounded-lg bg-[#1b2b55] border border-white/20 text-white w-72 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50 transition"
//                         />
//                     </div>
//                 )}

//                 {/* Local Video Upload */}
//                 {videoSourceOption === "local" && (
//                     <input
//                         type="file"
//                         accept="video/*"
//                         // onChange={loadLocalVideo}
//                         onChange={(e) => {
//                             loadLocalVideo(e);
//                             setVideoUrl("")
//                         }}
//                         className="text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00ADB5] file:text-black hover:file:bg-[#01979e] cursor-pointer"
//                     />
//                 )}

//             </div>

//             {/* MAIN LAYOUT */}
//             <div className="flex flex-col md:flex-row flex-1">

//                 {/* VIDEO SIDE */}
//                 <div className="w-full md:w-1/2 h-[calc(100vh-120px)] flex items-center justify-center bg-black">
//                     {videoSrc.includes("youtube") ? (
//                         <iframe
//                             src={videoSrc}
//                             title="YouTube Player"
//                             className="w-full h-full"
//                             allowFullScreen

//                         />
//                     ) : (
//                         videoSrc && (
//                             <video
//                                 src={videoSrc}
//                                 controls
//                                 className="w-full h-full object-contain"
//                             />
//                         )
//                     )}
//                 </div>

//                 {/* EDITOR SIDE */}
//                 <div className="md:w-1/2 border-l h-[calc(100vh-120px)] border-white/10 bg-[#0f1f3d]">
//                     <Editor
//                         height="100%"
//                         defaultLanguage="javascript"
//                         value={code}
//                         theme="vs-dark"
//                         onChange={(value) => setCode(value)}
//                         options={{
//                             fontSize: 14,
//                             minimap: { enabled: false },
//                             automaticLayout: true,
//                         }}
//                     />
//                 </div>

//             </div>

//         </div>
//     );
// };

// export default CodingEditor;

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useAuth } from '../context/AuthContext';
// import { User, Mail, Calendar, Edit2, Save, X, Camera, Trophy, Code, BookOpen } from 'lucide-react';

// const Profile = () => {
//   const { user, userData } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editData, setEditData] = useState({
//     displayName: user?.displayName || '',
//     bio: userData?.bio || 'Coding enthusiast passionate about web development',
//     location: userData?.location || 'Pakistan',
//     website: userData?.website || '',
//     github: userData?.github || '',
//     twitter: userData?.twitter || ''
//   });

//   const handleSave = () => {
//     // TODO: Save to Firebase
//     setIsEditing(false);
//   };

//   const stats = [
//     { icon: <BookOpen size={20} />, label: 'Courses', value: userData?.totalCourses || 4 },
//     { icon: <Code size={20} />, label: 'Codes', value: userData?.totalCodes || 12 },
//     { icon: <Trophy size={20} />, label: 'Achievements', value: userData?.achievements?.length || 3 },
//     { icon: <Calendar size={20} />, label: 'Member Since', value: 'Jan 2024' }
//   ];

//   const getInitials = () => {
//     const name = user?.displayName || user?.email?.[0] || 'U';
//     return name.charAt(0).toUpperCase();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#0F1422] py-8 px-4">
//       <div className="container mx-auto max-w-4xl">
        
//         {/* Profile Header */}
//         <div className="relative mb-8">
//           {/* Cover Image */}
//           <div className="h-48 rounded-2xl bg-gradient-to-r from-[#00ADB5]/20 to-[#61DAFB]/20 overflow-hidden">
//             <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200')] bg-cover bg-center opacity-30" />
//           </div>
          
//           {/* Avatar */}
//           <div className="absolute -bottom-12 left-8">
//             <div className="relative">
//               <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00ADB5] to-[#61DAFB] flex items-center justify-center shadow-xl">
//                 <span className="text-white font-bold text-3xl">{getInitials()}</span>
//               </div>
//               <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#00ADB5] text-white hover:bg-[#00ADB5]/80 transition-all">
//                 <Camera size={14} />
//               </button>
//             </div>
//           </div>
          
//           {/* Edit Button */}
//           <div className="absolute top-4 right-4">
//             {isEditing ? (
//               <div className="flex gap-2">
//                 <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white">
//                   <X size={18} />
//                 </button>
//                 <button onClick={handleSave} className="p-2 rounded-lg bg-[#00ADB5] text-white">
//                   <Save size={18} />
//                 </button>
//               </div>
//             ) : (
//               <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all">
//                 <Edit2 size={18} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Profile Info */}
//         <div className="mt-16 mb-8">
//           {isEditing ? (
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 value={editData.displayName}
//                 onChange={(e) => setEditData({...editData, displayName: e.target.value})}
//                 className="text-2xl font-bold bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white w-full"
//               />
//               <textarea
//                 value={editData.bio}
//                 onChange={(e) => setEditData({...editData, bio: e.target.value})}
//                 className="text-gray-400 bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full"
//                 rows="3"
//               />
//             </div>
//           ) : (
//             <>
//               <h1 className="text-2xl font-bold text-white">{user?.displayName || user?.email?.split('@')[0]}</h1>
//               <div className="flex items-center gap-2 text-gray-400 mt-1">
//                 <Mail size={14} />
//                 <span className="text-sm">{user?.email}</span>
//               </div>
//               <p className="text-gray-400 mt-3">{editData.bio}</p>
//               <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
//                 {editData.location && <span>📍 {editData.location}</span>}
//                 {editData.github && <span>🐙 {editData.github}</span>}
//                 {editData.twitter && <span>🐦 {editData.twitter}</span>}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {stats.map((stat, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.1 }}
//               className="bg-white/5 rounded-2xl p-4 text-center border border-white/10"
//             >
//               <div className="text-[#00ADB5] flex justify-center mb-2">{stat.icon}</div>
//               <div className="text-2xl font-bold text-white">{stat.value}</div>
//               <div className="text-xs text-gray-400">{stat.label}</div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;