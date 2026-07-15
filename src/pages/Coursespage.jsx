import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Play, Clock, BookOpen, Code, Sparkles, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 
import { updateCourseProgress, getUserCourses } from "../firebase/userdata"; 

// for dynamic fetching form db
import { getVideos } from "../api/videos.api";
import { getPlaylists } from "../api/playlists.api";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const Coursespage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); //Get logged in user
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [userCourses, setUserCourses] = useState([]);

  // fetching video from db
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, []);

  // fetching playlists from db
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getPlaylists();
        setPlaylists(data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };
    fetchPlaylists();
  }, []);

  //Fetch user's enrolled courses
  useEffect(() => {
    const fetchUserCourses = async () => {
      if (user) {
        const result = await getUserCourses(user.uid);
        if (result.success) {
          setUserCourses(result.data);
        }
      }
    };
    fetchUserCourses();
  }, [user]);

  //  Get progress for a playlist
  const getCourseProgress = (playlistId, totalVideos) => {
    const course = userCourses.find(c => c.courseId === playlistId);
    if (course) {
      return {
        completedVideos: course.completedVideos,
        percentage: course.percentage,
        status: course.status
      };
    }
    return { completedVideos: 0, percentage: 0, status: "not_started" };
  };

  // Handle video click with tracking
 // Coursespage.jsx - Replace handleVideoClick with this

// Coursespage.jsx - Replace handleVideoClick with this

const handleVideoClick = async (videoId, playlistId, playlistTitle, language, totalVideos, currentCompleted) => {
  // Navigate to editor first
  navigate(`/editor/${videoId}`);
  
  // If not logged in, don't track
  if (!user) return;
  
  // ✅ FIX 1: Standardize language name
  const languageMap = {
    'pyton': 'py',     // 'py' is in ALL_LANGUAGES
    'python': 'py',
    'javascript': 'js',
    'c#': 'csharp',
    'c++': 'cpp'
  };
  const standardLanguage = languageMap[language?.toLowerCase()] || language || 'general';
  
  // ✅ FIX 2: Validate total videos
  const actualTotalVideos = Math.max(totalVideos, 1);
  const newCompleted = Math.min(currentCompleted + 1, actualTotalVideos);
  
  console.log("Tracking video:", { playlistId, newCompleted, actualTotalVideos, language: standardLanguage });
  
  const result = await updateCourseProgress(
    user.uid,
    playlistId,
    playlistTitle,
    standardLanguage,
    newCompleted,
    actualTotalVideos
  );
  
  if (result.success) {
    console.log(`✅ Progress updated: ${result.percentage}%`);
    const updatedCourses = await getUserCourses(user.uid);
    if (updatedCourses.success) {
      setUserCourses(updatedCourses.data);
    }
  } else {
    console.error("❌ Progress update failed:", result.error);
  }
};

  // Memoized filters
  const filteredVideos = useMemo(() => {
    return videos.filter(video =>
      video.videoTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [videos, searchTerm]);

  const filteredPlaylists = useMemo(() => {
    return playlists.filter((playlist) =>
      playlist.playlistTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [playlists, searchTerm]);

  // Fetch playlist videos
  const fetchPlaylistVideos = async (playlistId) => {
    setLoadingPlaylist(true);
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
          thumbnail:
            item.snippet.thumbnails?.medium?.url ||
            item.snippet.thumbnails?.high?.url ||
            item.snippet.thumbnails?.default?.url ||
            null,
        }));

        videos = [...videos, ...newVideos];
        nextPageToken = data.nextPageToken;
      } while (nextPageToken);

      setPlaylistVideos(videos);
    } catch (error) {
      console.error("Error fetching playlist videos:", error);
    } finally {
      setLoadingPlaylist(false);
    }
  };

  const handlePlaylistClick = async (playlist) => {
    setSelectedPlaylist(playlist);
    await fetchPlaylistVideos(playlist.playlistId);
  };

  const clearSearch = () => setSearchTerm("");

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 25 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#0A0F1C" }}>
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        {[...Array(6)].map((_, i) => (
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
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
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
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
              boxShadow: "0 20px 60px rgba(0, 173, 181, 0.4)",
            }}
          >
            <Code className="text-white" size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Learn & Code With{" "}
            <span className="bg-gradient-to-r from-[#00ADB5] via-[#61DAFB] to-[#00ADB5] bg-clip-text text-transparent">
              Video Courses
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Master modern technologies through our interactive video tutorials.
            Watch, practice, and build real-world projects.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tutorials, courses..."
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 text-white placeholder-gray-400 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300"
              style={{ backgroundColor: "rgba(57, 62, 70, 0.4)" }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-center text-sm text-gray-400 mt-2">
              {filteredVideos.length + filteredPlaylists.length} result(s) found
            </p>
          )}
        </motion.div>

        {/* One Shot Videos */}
        {loadingVideos ? (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin text-[#00ADB5]" size={40} />
          </div>
        ) : (
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 flex items-center justify-center gap-2">
              <Sparkles className="text-[#00ADB5]" size={28} />
              <span className="bg-gradient-to-r from-[#00ADB5] to-[#61DAFB] bg-clip-text text-transparent">
                One Shot Videos
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVideos.length > 0 ? (
                [...filteredVideos]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((video, index) => {
                    const progress = getCourseProgress(`video_${video.videoId}`, 1);
                    return (
                      <div
                        key={video.videoId || index}
                        onClick={() => handleVideoClick(
                          video.videoId,
                          `video_${video.videoId}`,
                          video.videoTitle,
                          video.course?.toLowerCase() || "general",
                          1,
                          progress.completedVideos
                        )}
                        className="group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                        style={{
                          backgroundColor: "#393E46",
                          border: "1px solid rgba(255,255,255,0.1)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        }}
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                            alt={video.videoTitle}
                            className="w-full h-56 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                          <div className="absolute bottom-8 left-4">
                            <span className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                              {video.course}
                            </span>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div
                              className="w-14 h-14 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: "#00ADB5" }}
                            >
                              <Play className="text-white" size={24} fill="white" />
                            </div>
                          </div>
                          <span
                            className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                            style={{ backgroundColor: "#222831", color: "#EEEEEE" }}
                          >
                            <Clock size={12} />
                            {video.duration}
                          </span>
                          {progress.percentage === 100 && (
                            <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium bg-green-500 text-white">
                              ✓ Completed
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-sm line-clamp-2" style={{ color: "#EEEEEE" }}>
                            {video.videoTitle}
                          </h3>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  No videos found for "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Playlists */}
        {!loadingVideos && (
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 flex items-center justify-center gap-2">
              <BookOpen className="text-[#00ADB5]" size={28} />
              <span className="bg-gradient-to-r from-[#00ADB5] to-[#61DAFB] bg-clip-text text-transparent">
                Learning Playlists
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPlaylists.length > 0 ? (
                filteredPlaylists.map((playlist) => {
                  const progress = getCourseProgress(playlist.playlistId, playlist.totalVideos);
                  return (
                    <div
                      key={playlist.id}
                      onClick={() => handlePlaylistClick(playlist)}
                      className="group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                      style={{
                        backgroundColor: "#393E46",
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      }}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={playlist.thumbnail}
                          alt={playlist.playlistTitle}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                        <div className="absolute bottom-2 left-4 z-10">
                          <span className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                            {playlist.course}
                          </span>
                        </div>
                        <span
                          className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                          style={{ backgroundColor: "#222831", color: "#EEEEEE" }}
                        >
                          <Clock size={12} />
                          {playlist.duration}
                        </span>
                        {progress.percentage > 0 && (
                          <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium bg-[#00ADB5]/80 text-white">
                            {progress.percentage}% done
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm line-clamp-2" style={{ color: "#EEEEEE" }}>
                          {playlist.playlistTitle}
                        </h3>
                        {progress.percentage > 0 && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-700 rounded-full h-1">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#00ADB5] to-[#61DAFB]"
                                style={{ width: `${progress.percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {progress.completedVideos}/{playlist.totalVideos} videos
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  No playlists found for "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Playlist Modal with Tracking */}
        <AnimatePresence>
          {selectedPlaylist && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 mt-16 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedPlaylist(null)}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-[#222831] w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: "#393E46" }}>
                  <h2 className="text-2xl font-bold" style={{ color: "#00ADB5" }}>
                    {selectedPlaylist.playlistTitle}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      {selectedPlaylist.totalVideos} videos
                    </span>
                    <button
                      onClick={() => setSelectedPlaylist(null)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition"
                      style={{ color: "#EEEEEE" }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
                  {loadingPlaylist ? (
                    <div className="flex justify-center py-10">
                      <Loader className="animate-spin text-[#00ADB5]" size={40} />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {playlistVideos.map((video, index) => {
                        const progress = getCourseProgress(selectedPlaylist.playlistId, selectedPlaylist.totalVideos);
                        const isWatched = index < progress.completedVideos;
                        return (
                          <div
                            key={video.videoId}
                            onClick={() => {
                              setSelectedPlaylist(null);
                              handleVideoClick(
                                video.videoId,
                                selectedPlaylist.playlistId,
                                selectedPlaylist.playlistTitle,
                                selectedPlaylist.course?.toLowerCase() || "general",
                                selectedPlaylist.totalVideos,
                                progress.completedVideos
                              );
                            }}
                            className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all hover:border-[#00ADB5] hover:shadow-lg ${
                              isWatched ? "opacity-70" : ""
                            }`}
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
                              className="w-28 h-16 object-cover rounded-md"
                            />
                            <p className="text-sm font-medium flex-1" style={{ color: "#EEEEEE" }}>
                              {video.title}
                            </p>
                            {isWatched ? (
                              <span className="text-green-400 text-xs">✓ Watched</span>
                            ) : (
                              <Play size={18} style={{ color: "#00ADB5" }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Coursespage;