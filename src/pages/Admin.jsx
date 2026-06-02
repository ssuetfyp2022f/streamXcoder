import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVideos } from "../api/videos.api";
import { getUsers } from "../api/users.api";
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import Sidebar from "../components/Sidebar";

export default function Admin() {
  // =========================
  // STATES
  // =========================
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isopenSidebar, setisopenSidebar] = useState(true); // Default to true (open)
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user } = useAuth();

  // =========================
  // STATIC PLAYLISTS (mock)
  // =========================
  const playlists = [
    { id: 1, title: "React Basics", videos: 10, createdBy: "Ahmed", thumbnail: "🎯" },
    { id: 2, title: "Hooks Deep Dive", videos: 8, createdBy: "Ali", thumbnail: "⚛️" },
    { id: 3, title: "Node API", videos: 12, createdBy: "Usman", thumbnail: "🚀" },
    { id: 4, title: "MongoDB Mastery", videos: 9, createdBy: "Zain", thumbnail: "🗄️" },
    { id: 5, title: "Firebase Auth", videos: 6, createdBy: "Hamza", thumbnail: "🔥" },
  ];

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const usersData = await getUsers();
        const videosData = await getVideos();
        setUsers(usersData || []);
        setVideos(videosData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // FILTERED DATA
  // =========================
  const latestUsers = [...users].slice(0, 5);
  const latestVideos = [...videos]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);
  const latestPlaylists = playlists.slice(0, 5);

  // =========================
  // STATS
  // =========================
  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: "👥",
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30",
    },
    {
      title: "Total Videos",
      value: videos.length,
      icon: "🎥",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-gradient-to-br from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/30",
    },
    {
      title: "Total Playlists",
      value: playlists.length,
      icon: "📂",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20",
      borderColor: "border-purple-500/30",
    },
  ];

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white animate-pulse">
            Loading Dashboard...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        isopenSidebar={isopenSidebar}
        setisopenSidebar={setisopenSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {/* ================= MAIN ================= */}
      <main
        className={`transition-all duration-300 min-h-screen
        ${isopenSidebar ? "ml-72" : "ml-20"}`}
      >
        {/* Header */}
        <div className="h-24 sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Welcome back, {user?.displayName || "Admin"}!
                </span>
                <span className="ml-2 text-white">👋</span>
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Here's what's happening with your platform today
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative overflow-hidden rounded-2xl p-6 border ${item.borderColor} ${item.bgColor} backdrop-blur-sm cursor-pointer`}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-zinc-300 text-sm font-medium">{item.title}</p>
                      <h3 className="text-4xl font-bold mt-2">{item.value}</h3>
                    </div>
                    <div className="text-4xl animate-bounce">{item.icon}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Users Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 mb-10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  👥 Recent Users
                </h2>
                <p className="text-zinc-400 mt-1">
                  {users.length} registered users
                </p>
              </div>
              <Link to="/admin/users">
                <button className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition">
                  View All
                </button>
              </Link>
            </div>

            <div className="space-y-4">
              {latestUsers.map((user, i) => (
                <motion.div
                  key={user.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{
                    scale: 1.01,
                    borderColor: "rgba(34,211,238,0.4)",
                  }}
                  className="group flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0f172a]/70 p-5 transition-all hover:bg-[#111827]"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                        {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white text-lg">
                          {user.displayName}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-zinc-700/50 text-zinc-300"
                          }`}
                        >
                          {user.role || "User"}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col lg:items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.subscription === "Premium"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-zinc-700/50 text-zinc-300"
                      }`}
                    >
                      {user.subscription || "Free"}
                    </span>
                    <div className="text-xs text-zinc-500 text-right">
                      <p>Joined: {formatDate(user.createdAt)}</p>
                      <p>Last Login: {formatDate(user.lastLogin)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Videos and Playlists Section */}
          <div className="space-y-8">
            {/* Videos Section */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#1e293b]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span>🎥</span> Recent Videos
                  </h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    Total {videos.length} videos uploaded
                  </p>
                </div>
                <Link to="/admin/videos">
                  <button className="px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-xl transition-all text-sm font-medium">
                    View All →
                  </button>
                </Link>
              </div>
              <div className="space-y-4">
                {latestVideos.length === 0 ? (
                  <div className="text-center text-zinc-400 py-8">No Videos Found</div>
                ) : (
                  latestVideos.map((video, i) => (
                    <motion.div
                      key={video.id || i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-[#0f172a]/50 rounded-xl p-3 flex gap-4"
                    >
                      <img
                        src={
                          video.videoId
                            ? `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`
                            : "/api/placeholder/160/90"
                        }
                        alt={video.videoTitle}
                        className="w-40 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{video.videoTitle}</h3>
                        <p className="text-zinc-400 text-sm mt-1">
                          By: {video.uploadedBy}
                        </p>
                        <p className="text-zinc-500 text-xs mt-2">
                          {formatDate(video.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.section>

            {/* Playlists Section */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#1e293b]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span>📂</span> Recent Playlists
                  </h2>
                  <p className="text-zinc-400 text-sm mt-1">
                    Total {playlists.length} playlists available
                  </p>
                </div>
                <Link to="/admin/playlists">
                  <button className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl transition-all text-sm font-medium">
                    View All →
                  </button>
                </Link>
              </div>
              <div className="space-y-4">
                {latestPlaylists.map((playlist, i) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#0f172a]/50 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{playlist.thumbnail}</div>
                      <div>
                        <h3 className="font-semibold">{playlist.title}</h3>
                        <p className="text-zinc-400 text-sm">
                          {playlist.videos} videos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 text-sm">Created by</p>
                      <p className="text-zinc-500 text-xs">{playlist.createdBy}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}