import React, { useEffect, useState } from "react";
// import { getPlaylists, addPlaylists, updatePlaylist, deletePlaylist } from "../api/playlists.api.js";
import { addPlaylist, getPlaylists, updatePlaylist, deletePlaylist } from "../api/playlists.api";
import { getAuth } from "firebase/auth";

export default function Playlists() {

    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

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
            const data = await getPlaylists();
            setPlaylists(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    // ---------------- FILTERED PLAYLISTS ----------------
    const filteredPlaylists = playlists.filter((p) => {
        const courseMatch = !filters.course || p.course === filters.course;
        const languageMatch = !filters.language || p.spokenLanguage === filters.language;
        return courseMatch && languageMatch;
    });

    // ---------------- HELPERS ----------------
    const getPlaylistId = (url) => {
        const match = url.match(
            /[&?]list=([^&]+)/
        );
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

                // Get video IDs
                const videoIds = itemsData.items.map(item => item.contentDetails.videoId).join(',');

                // Fetch video durations
                if (videoIds) {
                    const videosRes = await fetch(
                        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
                    );
                    const videosData = await videosRes.json();

                    videosData.items.forEach(video => {
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
        return (hours * 3600) + (minutes * 60) + seconds;
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
                createdAt: editingId
                    ? playlists.find(p => p.id === editingId)?.createdAt
                    : new Date().toISOString(),
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
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this playlist?")) {
            try {
                await deletePlaylist(id);
                setPlaylists(playlists.filter((p) => p.id !== id));
            } catch (error) {
                console.error(error);
            }
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
        <div className="min-h-screen bg-[#0B1120] text-white p-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black bg-linear-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                        Playlist Management
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Manage YouTube playlists for coding tutorials
                    </p>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-linear-to-r from-green-500 to-blue-600 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/20 hover:scale-105 transition"
                >
                    + Add New Playlist
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* TOTAL PLAYLISTS */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur">
                    <p className="text-gray-400 text-sm">Total Playlists</p>
                    <h2 className="text-3xl font-bold mt-2">{playlists.length}</h2>
                </div>

                {/* TOTAL COURSES */}
                <div
                    onClick={() => setShowDetails({type: "courses", open: true })}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur cursor-pointer hover:border-cyan-500/40 transition"
                >
                    <p className="text-gray-400 text-sm">Courses</p>
                    <h2 className="text-3xl font-bold mt-2">
                        {
                            [...new Set(
                                playlists.map(p => p.course)
                            )].length
                        }
                    </h2>
                </div>

                {/* LANGUAGES */}
                <div
                    onClick={() => setShowDetails({ type: "languages", open: true })}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur cursor-pointer hover:border-purple-500/40 transition"
                >
                    <p className="text-gray-400 text-sm">Languages</p>
                    <h2 className="text-3xl font-bold mt-2">
                        {[...new Set(playlists.map(p => p.spokenLanguage))].length}
                    </h2>
                </div>
            </div>

            {/* DETAILS MODAL */}
            {showDetails.open && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-2xl font-bold">
                                {showDetails.type === "courses" ? "Available Courses" : "Available Languages"}
                            </h2>
                            <button
                                onClick={() => setShowDetails({ type: "", open: false })}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {(showDetails.type === "courses"
                                ? [...new Set(playlists.map(p => p.course))]
                                : [...new Set(playlists.map(p => p.spokenLanguage))]
                            ).map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (showDetails.type === "courses") {
                                            setFilters((prev) => ({ ...prev, course: item }));
                                        } else {
                                            setFilters((prev) => ({ ...prev, language: item }));
                                        }
                                        setShowDetails({ type: "", open: false });
                                    }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-green-500/40 transition"
                                >
                                    <span>{item || "Unknown"}</span>
                                    <span className="text-green-400 text-sm">
                                        {playlists.filter(p =>
                                            showDetails.type === "courses"
                                                ? p.course === item
                                                : p.spokenLanguage === item
                                        ).length} playlists
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ACTIVE FILTERS */}
            {(filters.course || filters.language) && (
                <div className="flex gap-3 mb-6 flex-wrap">
                    {filters.course && (
                        <div className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full flex items-center gap-2">
                            Course: {filters.course}
                            <button onClick={() => setFilters((prev) => ({ ...prev, course: "" }))}>✕</button>
                        </div>
                    )}
                    {filters.language && (
                        <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full flex items-center gap-2">
                            Language: {filters.language}
                            <button onClick={() => setFilters((prev) => ({ ...prev, language: "" }))}>✕</button>
                        </div>
                    )}
                </div>
            )}

            {/* ADD / EDIT MODAL */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">
                                {editingId ? "Edit Playlist" : "Add New Playlist"}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                required
                                type="text"
                                name="url"
                                placeholder="YouTube Playlist URL"
                                value={form.url}
                                onChange={handleChange}
                                onBlur={handleUrlBlur}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition"
                            />

                            <select
                                name="course"
                                value={form.course}
                                onChange={handleChange}
                                className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 outline-none"
                            >
                                <option disabled value="">Select Course</option>
                                <option value="C++">C++</option>
                                <option value="C#">C#</option>
                                <option value="Python">Python</option>
                                <option value="JavaScript">JavaScript</option>
                                <option value="HTML/CSS">HTML/CSS</option>
                            </select>

                            <input
                                type="text"
                                name="playlistTitle"
                                placeholder="Playlist Title"
                                value={form.playlistTitle}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                            />

                            <input
                                type="text"
                                name="channel"
                                placeholder="Channel"
                                value={form.channel}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                            />

                            <input
                                type="text"
                                name="totalVideos"
                                placeholder="Total Videos"
                                value={form.totalVideos}
                                readOnly
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none cursor-not-allowed opacity-70"
                            />

                            <input
                                type="text"
                                name="duration"
                                placeholder="Total Duration"
                                value={form.duration}
                                readOnly
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none cursor-not-allowed opacity-70"
                            />

                            <input
                                type="text"
                                name="spokenLanguage"
                                placeholder="Language"
                                value={form.spokenLanguage}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                            />

                            <input
                                disabled
                                type="text"
                                name="uploadedBy"
                                value={user}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none cursor-not-allowed opacity-70"
                            />
                        </div>

                        {form.thumbnail && (
                            <div className="mt-4">
                                <img src={form.thumbnail} alt="Playlist thumbnail" className="w-full h-48 object-cover rounded-xl" />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    resetForm();
                                }}
                                className="bg-gray-500/20 text-gray-300 px-5 py-2 rounded-xl hover:bg-gray-500/30 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-linear-to-r from-green-500 to-blue-600 px-6 py-2 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50"
                            >
                                {loading ? "Loading..." : editingId ? "Update Playlist" : "Add Playlist"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PLAYLIST LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[...filteredPlaylists]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((p, index) => (
                        <div
                            key={p.id}
                            className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-green-500/30 transition hover:shadow-2xl hover:shadow-green-500/10 flex flex-col h-full"
                        >
                            {/* THUMBNAIL */}
                            <div className="relative">
                                <img
                                    src={p.thumbnail || `https://img.youtube.com/vi/${p.playlistId}/maxresdefault.jpg`}
                                    alt={p.playlistTitle}
                                    className="w-full h-56 object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://img.youtube.com/vi/${p.playlistId}/0.jpg`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />

                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-green-500 text-xs px-3 py-1 rounded-full font-semibold">
                                        {p.course}
                                    </span>
                                </div>

                                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-sm">
                                    📹 {p.totalVideos} videos
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="p-5 flex flex-col flex-1">
                                <p className="text-xs text-gray-400 mb-2">#{index + 1}</p>

                                <h2 className="font-bold text-xl line-clamp-2 mb-2">
                                    {p.playlistTitle}
                                </h2>

                                <p className="text-gray-400 text-sm mb-4">
                                    {p.channel}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                                        {p.duration}
                                    </span>
                                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                                        {p.spokenLanguage}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500 mb-5">
                                    Added: {formatDate(p.createdAt)} | by {p.uploadedBy}
                                </p>

                                {/* BUTTONS */}
                                <div className="flex gap-3 mt-auto">
                                    <a
                                        href={p.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-xl text-center hover:bg-green-500/30 transition"
                                    >
                                        Watch Playlist
                                    </a>

                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="flex-1 bg-yellow-500/20 text-yellow-400 py-2 rounded-xl hover:bg-yellow-500/30 transition"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-xl hover:bg-red-500/30 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {filteredPlaylists.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">No playlists found</p>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="mt-4 bg-green-500/20 text-green-400 px-6 py-2 rounded-xl hover:bg-green-500/30 transition"
                    >
                        Add your first playlist
                    </button>
                </div>
            )}
        </div>
    );
}