import React, { useEffect, useState } from "react";
import { addPlaylist, getPlaylists, updatePlaylist, deletePlaylist } from "../api/playlists.api";
import { getAuth } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Search, Play, BookOpen, Globe, Eye, Edit, Trash2, X, Plus, Clock, Video, FolderOpen, Loader2 } from "lucide-react";

export default function Playlists() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState("");
    const [playlists, setPlaylists] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [isopenSidebar, setisopenSidebar] = useState(true);
    const [activeTab, setActiveTab] = useState("playlists");
    const [searchTerm, setSearchTerm] = useState("");

    // DETAILS MODAL
    const [showDetails, setShowDetails] = useState({
        type: "",
        open: false,
    });

    // FILTERS
    const [filters, setFilters] = useState({
        course: "",
        language: "",
    });

    // SELECTED PLAYLIST FOR DETAILS MODAL
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    // FORM
    const [form, setForm] = useState({
        url: "",
        channel: "",
        playlistId: "",
        playlistTitle: "",
        duration: "",
        spokenLanguage: "",
        course: "",
        uploadedBy: "",
        totalVideos: "",
        thumbnail: "",
    });

    // ---------------- User ----------------
    const fetchUser = async () => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            setUser(currentUser?.displayName || "");
            console.log("Current User:", auth.currentUser);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // ---------------- FETCH ----------------
    const fetchPlaylists = async () => {
        try {
            setLoading(true);

            const data = await getPlaylists();
            setPlaylists(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    // ---------------- FILTERED PLAYLISTS ----------------
    const filteredPlaylists = playlists.filter((p) => {
        const searchMatch =
            !searchTerm ||
            p.playlistTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.channel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.course?.toLowerCase().includes(searchTerm.toLowerCase());

        const courseMatch = !filters.course || p.course === filters.course;
        const languageMatch = !filters.language || p.spokenLanguage === filters.language;

        return searchMatch && courseMatch && languageMatch;
    });

    // Stats
    const totalCourses = [...new Set(playlists.map((p) => p.course))].length;
    const totalLanguages = [...new Set(playlists.map((p) => p.spokenLanguage))].length;
    const totalVideos = playlists.reduce((sum, p) => sum + (parseInt(p.totalVideos) || 0), 0);

    // ---------------- HELPERS ----------------
    const getPlaylistId = (url) => {
        const match = url.match(/[&?]list=([^&]+)/);
        return match ? match[1] : "";
    };

    const convertDuration = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "";
        return new Date(isoDate).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ---------------- YOUTUBE API ----------------
    const fetchPlaylistData = async (playlistId) => {
        try {
            const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

            // Fetch playlist details
            const playlistRes = await fetch(
                `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${API_KEY}`
            );
            const playlistData = await playlistRes.json();
            const playlistItem = playlistData.items?.[0];

            if (!playlistItem) return null;

            // Fetch playlist items to calculate total duration
            let nextPageToken = "";
            let totalDurationSeconds = 0;
            let videoCount = 0;

            do {
                const itemsRes = await fetch(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${API_KEY}&pageToken=${nextPageToken}`
                );
                const itemsData = await itemsRes.json();

                const videoIds = itemsData.items.map((item) => item.contentDetails.videoId).join(",");

                if (videoIds) {
                    const videosRes = await fetch(
                        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
                    );
                    const videosData = await videosRes.json();

                    videosData.items.forEach((video) => {
                        const duration = video.contentDetails.duration;
                        const seconds = parseDuration(duration);
                        totalDurationSeconds += seconds;
                    });
                }

                videoCount += itemsData.items.length;
                nextPageToken = itemsData.nextPageToken || "";
            } while (nextPageToken);

            // Get channel info
            const channelId = playlistItem.snippet.channelId;
            const channelRes = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`
            );
            const channelData = await channelRes.json();
            const channelName = channelData.items?.[0]?.snippet?.title || playlistItem.snippet.channelTitle;

            // Get best quality thumbnail
            const thumbnails = playlistItem.snippet.thumbnails;
            const thumbnail = thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url;

            return {
                title: playlistItem.snippet.title,
                channel: channelName,
                language: playlistItem.snippet.defaultLanguage || "unknown",
                totalVideos: videoCount,
                totalDuration: convertDuration(totalDurationSeconds),
                thumbnail: thumbnail,
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const parseDuration = (duration) => {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(match?.[1] || 0);
        const minutes = parseInt(match?.[2] || 0);
        const seconds = parseInt(match?.[3] || 0);
        return hours * 3600 + minutes * 60 + seconds;
    };

    // ---------------- HANDLERS ----------------
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleUrlBlur = async () => {
        const playlistId = getPlaylistId(form.url);

        if (!playlistId) {
            alert("Invalid YouTube Playlist URL!");
            return;
        }

        setLoading(true);

        setForm((prev) => ({
            ...prev,
            playlistId,
        }));

        const ytData = await fetchPlaylistData(playlistId);

        if (ytData) {
            setForm((prev) => ({
                ...prev,
                playlistTitle: ytData.title,
                channel: ytData.channel,
                spokenLanguage: ytData.language,
                totalVideos: ytData.totalVideos,
                duration: ytData.totalDuration,
                thumbnail: ytData.thumbnail,
            }));
        } else {
            alert("Failed to fetch playlist data. Please check the URL and try again.");
        }

        setLoading(false);
    };

    const resetForm = () => {
        setForm({
            url: "",
            channel: "",
            playlistId: "",
            playlistTitle: "",
            duration: "",
            spokenLanguage: "",
            course: "",
            uploadedBy: "",
            totalVideos: "",
            thumbnail: "",
        });
        setEditingId(null);
    };

    // ---------------- SUBMIT ----------------
    const handleSubmit = async () => {
        if (
            !form.url.trim() ||
            !form.playlistTitle.trim() ||
            !form.channel.trim() ||
            !form.duration.trim() ||
            !form.spokenLanguage.trim() ||
            !form.course.trim()
        ) {
            alert("All fields are required!");
            return;
        }

        try {
            const payload = {
                url: form.url,
                playlistId: form.playlistId,
                playlistTitle: form.playlistTitle,
                channel: form.channel,
                duration: form.duration,
                spokenLanguage: form.spokenLanguage,
                course: form.course,
                uploadedBy: user,
                totalVideos: form.totalVideos,
                thumbnail: form.thumbnail,
                createdAt: editingId ? playlists.find((p) => p.id === editingId)?.createdAt : new Date().toISOString(),
            };

            if (editingId) {
                await updatePlaylist(editingId, payload);
            } else {
                await addPlaylist(payload);
            }

            await fetchPlaylists();
            setIsOpen(false);
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    // ---------------- DELETE ----------------
    const handleDelete = async (id, title) => {
        const confirmDelete = window.confirm(`Delete "${title}" playlist?`);
        if (!confirmDelete) return;

        try {
            await deletePlaylist(id);
            setPlaylists(playlists.filter((p) => p.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    // ---------------- EDIT ----------------
    const handleEdit = (p) => {
        setForm({
            url: p.url,
            playlistId: p.playlistId || "",
            playlistTitle: p.playlistTitle || "",
            channel: p.channel || "",
            duration: p.duration || "",
            spokenLanguage: p.spokenLanguage || "",
            course: p.course || "",
            totalVideos: p.totalVideos || "",
            thumbnail: p.thumbnail || "",
        });
        setEditingId(p.id);
        setIsOpen(true);
    };

    return (
        <div className="min-h-screen flex bg-[#0A0F1C]">
            {/* Sidebar */}
            <Sidebar
                isopenSidebar={isopenSidebar}
                setisopenSidebar={setisopenSidebar}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Main Content */}
            <div
                className={`relative flex-1 transition-all duration-300 ${isopenSidebar ? "ml-70" : "ml-20"
                    }`}
            >
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full opacity-10"
                            style={{
                                backgroundColor: i % 2 === 0 ? "#00ADB5" : "#61DAFB",
                                width: 120 + i * 40,
                                height: 120 + i * 40,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                filter: "blur(70px)",
                            }}
                            animate={{ y: [0, -50, 0] }}
                            transition={{ duration: 8 + i, repeat: Infinity }}
                        />
                    ))}
                </div>

                <div className="relative z-10 container mx-auto px-6 py-10">
                    {/* Heading */}
                    <div className="flex items-center gap-5 mb-12">
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ background: "linear-gradient(135deg,#00ADB5,#61DAFB)" }}
                        >
                            <FolderOpen size={35} className="text-white" />
                        </div>

                        <div>
                            <h1 className="text-5xl font-bold bg-linear-to-r from-[#00ADB5] to-[#61DAFB] bg-clip-text text-transparent">
                                Playlist Management
                            </h1>
                            <p className="text-gray-400 mt-2">Manage YouTube playlists for coding tutorials</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="max-w-xl mx-auto mb-10">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search playlists by title, channel, or course..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl text-white border border-white/10 outline-none"
                                style={{ backgroundColor: "rgba(57,62,70,0.4)" }}
                            />
                        </div>
                    </div>

                    {/* Add Playlist Button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="bg-linear-to-r from-[#00ADB5] to-[#61DAFB] px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add New Playlist
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Total Playlists */}
                        <div
                            onClick={() => {
                                setFilters({ course: "", language: "" });
                                setSearchTerm("");
                            }}
                            className={`relative p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ${!filters.course && !filters.language && !searchTerm
                                ? "border border-cyan-400/30"
                                : "border border-white/10"
                                }`}
                            style={{
                                background: "linear-gradient(135deg, rgba(0,173,181,0.15), rgba(97,218,251,0.10))",
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-300 text-sm">Total Playlists</h3>
                                    <p className="text-4xl font-bold text-white mt-2">{playlists.length}</p>
                                </div>
                                <div
                                    className="w-14 h-14 flex items-center justify-center rounded-xl shadow-lg"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgba(0,173,181,0.25), rgba(97,218,251,0.10))",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        boxShadow: "0 0 25px rgba(0,173,181,0.25)",
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    <FolderOpen className="text-white" size={22} />
                                </div>
                            </div>
                        </div>

                        {/* Courses */}
                        <div
                            onClick={() => setShowDetails({ type: "courses", open: true })}
                            className={`relative p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ${filters.course ? "border border-emerald-400/30" : "border border-white/10"
                                }`}
                            style={{
                                background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(34,197,94,0.10))",
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-300 text-sm">Courses</h3>
                                    <p className="text-4xl font-bold text-white mt-2">{totalCourses}</p>
                                </div>
                                <div
                                    className="w-14 h-14 flex items-center justify-center rounded-xl"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(34,197,94,0.10))",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        boxShadow: "0 0 25px rgba(16,185,129,0.25)",
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    <BookOpen className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Languages */}
                        <div
                            onClick={() => setShowDetails({ type: "languages", open: true })}
                            className={`relative p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ${filters.language ? "border border-purple-400/30" : "border border-white/10"
                                }`}
                            style={{
                                background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.10))",
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-300 text-sm">Languages</h3>
                                    <p className="text-4xl font-bold text-white mt-2">{totalLanguages}</p>
                                </div>
                                <div
                                    className="w-14 h-14 flex items-center justify-center rounded-xl"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(99,102,241,0.10))",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        boxShadow: "0 0 25px rgba(168,85,247,0.25)",
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    <Globe className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(filters.course || filters.language) && (
                        <div className="flex gap-3 mb-6 flex-wrap">
                            {filters.course && (
                                <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                                    Course: {filters.course}
                                    <button onClick={() => setFilters((prev) => ({ ...prev, course: "" }))}>✕</button>
                                </div>
                            )}
                            {filters.language && (
                                <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                                    Language: {filters.language}
                                    <button onClick={() => setFilters((prev) => ({ ...prev, language: "" }))}>✕</button>
                                </div>
                            )}
                            <button
                                onClick={() => setFilters({ course: "", language: "" })}
                                className="text-gray-400 text-sm hover:text-white underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Playlist Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...filteredPlaylists]
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((playlist, index) => (
                                <motion.div
                                    key={playlist.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="group bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={
                                                playlist.thumbnail ||
                                                `https://img.youtube.com/vi/${playlist.playlistId}/maxresdefault.jpg`
                                            }
                                            alt={playlist.playlistTitle}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = `https://img.youtube.com/vi/${playlist.playlistId}/0.jpg`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                                        <div className="absolute bottom-3 left-3">
                                            <span
                                                className="text-xs px-3 py-1 rounded-full font-semibold"
                                                style={{ background: "linear-gradient(135deg,#00ADB5,#61DAFB)" }}
                                            >
                                                {playlist.course}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                                            style={{ background: "linear-gradient(135deg,#00ADB5,#61DAFB)" }}>
                                            <Video size={12} /> {playlist.totalVideos} videos
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-white font-bold text-lg line-clamp-2 mb-2">
                                            {playlist.playlistTitle}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-3">{playlist.channel}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs text-gray-300 flex items-center gap-1">
                                                <Clock size={12} /> {playlist.duration}
                                            </span>
                                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs text-gray-300">
                                                {playlist.spokenLanguage}
                                            </span>
                                        </div>

                                        <p className="text-gray-500 text-xs mb-4">
                                            Added: {formatDate(playlist.createdAt)} by {playlist.uploadedBy}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                onClick={() => setSelectedPlaylist(playlist)}
                                                className="flex-1 py-2 rounded-xl text-white flex items-center justify-center gap-2 transition-all duration-300"
                                                style={{ backgroundColor: "#00ADB5" }}
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleEdit(playlist)}
                                                className="flex-1 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center gap-2 hover:bg-yellow-500/30 transition-all duration-300"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(playlist.id, playlist.playlistTitle)}
                                                className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center gap-2 hover:bg-red-500/30 transition-all duration-300"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                    </div>

                    {/* Empty State */}
                    {filteredPlaylists.length === 0 && (
                        <div className="text-center py-20">
                            <Play size={64} className="text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl text-gray-400">No playlists found</h3>
                            <p className="text-gray-500 mt-2">
                                {searchTerm || filters.course || filters.language
                                    ? "Try adjusting your search or filters"
                                    : "Click 'Add New Playlist' to get started"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#222831" }}>
                        <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#222831] z-10 pb-2">
                            <h2 className="text-2xl font-bold" style={{ color: "#00ADB5" }}>
                                {editingId ? "Edit Playlist" : "Add New Playlist"}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="url"
                                placeholder="YouTube Playlist URL"
                                value={form.url}
                                onChange={handleChange}
                                onBlur={handleUrlBlur}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 transition-colors"
                            />
                            <select
                                name="course"
                                value={form.course}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 transition-colors"
                            >
                                <option value="" className="bg-gray-500 text-black" disabled>Select Course</option>
                                <option value="C++" className="bg-gray-700 text-white" >C++</option>
                                <option value="C#" className="bg-gray-700 text-white" >C#</option>
                                <option value="Python" className="bg-gray-700 text-white" >Python</option>
                                <option value="JavaScript" className="bg-gray-700 text-white" >JavaScript</option>
                                <option value="HTML/CSS" className="bg-gray-700 text-white" >HTML/CSS</option>
                            </select>
                            <input
                                type="text"
                                name="playlistTitle"
                                placeholder="Playlist Title"
                                value={form.playlistTitle}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 transition-colors"
                            />
                            <input
                                type="text"
                                name="channel"
                                placeholder="Channel"
                                value={form.channel}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 transition-colors"
                            />
                            <input
                                type="text"
                                name="totalVideos"
                                placeholder="Total Videos"
                                value={form.totalVideos}
                                readOnly
                                className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-gray-400 outline-none cursor-not-allowed"
                            />
                            <input
                                type="text"
                                name="duration"
                                placeholder="Total Duration"
                                value={form.duration}
                                readOnly
                                className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-gray-400 outline-none cursor-not-allowed"
                            />
                            <input
                                type="text"
                                name="spokenLanguage"
                                placeholder="Spoken Language"
                                value={form.spokenLanguage}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 transition-colors"
                            />
                            <input
                                type="text"
                                name="uploadedBy"
                                value={user}
                                disabled
                                className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-not-allowed"
                            />
                        </div>

                        {form.thumbnail && (
                            <div className="mt-4">
                                <img
                                    src={form.thumbnail}
                                    alt="Playlist thumbnail"
                                    className="w-full h-48 object-cover rounded-xl"
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    resetForm();
                                }}
                                className="px-5 py-2 rounded-xl text-gray-300 hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50"
                                style={{ background: "linear-gradient(135deg,#00ADB5,#61DAFB)" }}
                            >
                                {loading ? "Loading..." : editingId ? "Update Playlist" : "Add Playlist"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal (Courses/Languages) */}
            {showDetails.open && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-2xl p-6" style={{ backgroundColor: "#222831" }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold" style={{ color: "#00ADB5" }}>
                                {showDetails.type === "courses" ? "All Courses" : "All Languages"}
                            </h2>
                            <button
                                onClick={() => setShowDetails({ type: "", open: false })}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {(showDetails.type === "courses"
                                ? [...new Set(playlists.map((p) => p.course))]
                                : [...new Set(playlists.map((p) => p.spokenLanguage))]
                            ).map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        if (showDetails.type === "courses") {
                                            setFilters((prev) => ({ ...prev, course: item }));
                                        } else {
                                            setFilters((prev) => ({ ...prev, language: item }));
                                        }
                                        setShowDetails({ type: "", open: false });
                                    }}
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
                                >
                                    <span className="text-white">{item || "Unknown"}</span>
                                    <span className="text-cyan-400 text-sm">
                                        {playlists.filter((p) =>
                                            showDetails.type === "courses" ? p.course === item : p.spokenLanguage === item
                                        ).length}{" "}
                                        playlists
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Playlist Details Modal */}
            {selectedPlaylist && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg rounded-2xl p-6" style={{ backgroundColor: "#222831" }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold" style={{ color: "#00ADB5" }}>
                                Playlist Details
                            </h2>
                            <button onClick={() => setSelectedPlaylist(null)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {selectedPlaylist.thumbnail && (
                            <img
                                src={selectedPlaylist.thumbnail}
                                alt={selectedPlaylist.playlistTitle}
                                className="w-full h-48 object-cover rounded-xl mb-4"
                            />
                        )}

                        <div className="space-y-4 text-gray-300">
                            <p>
                                <strong className="text-cyan-400">Title:</strong> {selectedPlaylist.playlistTitle}
                            </p>
                            <p>
                                <strong className="text-cyan-400">Channel:</strong> {selectedPlaylist.channel}
                            </p>
                            <p>
                                <strong className="text-cyan-400">Course:</strong> {selectedPlaylist.course}
                            </p>
                            <p>
                                <strong className="text-cyan-400">Language:</strong> {selectedPlaylist.spokenLanguage}
                            </p>
                            <p>
                                <strong className="text-cyan-400">Total Videos:</strong> {selectedPlaylist.totalVideos}
                            </p>
                            <p>
                                <strong className="text-cyan-400">Total Duration:</strong> {selectedPlaylist.duration}
                            </p>
                            <p>
                                <strong className="text-cyan-400">Uploaded By:</strong> {selectedPlaylist.uploadedBy}
                            </p>
                            <p>
                                <strong className="text-cyan-400">Added On:</strong> {formatDate(selectedPlaylist.createdAt)}
                            </p>
                            <p className="break-all">
                                <strong className="text-cyan-400">URL:</strong>{" "}
                                <a
                                    href={selectedPlaylist.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:underline"
                                >
                                    {selectedPlaylist.url}
                                </a>
                            </p>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <a
                                href={selectedPlaylist.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center py-2 rounded-xl text-white transition-all duration-300"
                                style={{ background: "linear-gradient(135deg,#00ADB5,#61DAFB)" }}
                            >
                                Watch on YouTube
                            </a>
                            <button
                                onClick={() => setSelectedPlaylist(null)}
                                className="flex-1 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-[#00ADB5] animate-spin mx-auto mb-4" />
                        <p className="text-gray-200">Loading playlists...</p>
                    </div>
                </div>
            )}
        </div>
    );
}