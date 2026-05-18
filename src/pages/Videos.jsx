import React, { useEffect, useState } from "react";
import { getVideos, addVideos, updateVideos, deleteVideos, } from "../api/videos.api";
// import { getUsers, getUserByEmail } from "../api/users.api";
import { getAuth } from "firebase/auth";

export default function Videos() {

    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState('');
    const [videos, setVideos] = useState([]);
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
        videoId: "",
        videoTitle: "",
        duration: "",
        spokenLanguage: "",
        course: "",
        uploadedBy: "",
    });

    // ---------------- User ----------------
    const fetchUser = async () => {

        try {

            const auth = getAuth();
            const currentUser = auth.currentUser;

            // console.log(currentUser.displayName);

            setUser(currentUser.displayName);

        } catch (error) {

            console.error(error);
        }
        return user;
    };

    useEffect(() => {

        fetchUser();

    }, []);



    // ---------------- FETCH ----------------
    const fetchVideos = async () => {

        try {

            const data = await getVideos();

            setVideos(data || []);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        fetchVideos();

    }, []);

    // ---------------- FILTERED VIDEOS ----------------
    const filteredVideos = videos.filter((v) => {

        const courseMatch =
            !filters.course || v.course === filters.course;

        const languageMatch =
            !filters.language ||
            v.spokenLanguage === filters.language;

        return courseMatch && languageMatch;
    });

    // ---------------- HELPERS ----------------
    const getYouTubeId = (url) => {

        const match = url.match(
            /(?:youtu\.be\/|v=|shorts\/)([^&?/]+)/
        );

        return match ? match[1] : "";
    };

    const convertDuration = (isoDuration) => {

        const match = isoDuration.match(
            /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
        );

        const hours = parseInt(match?.[1] || 0);

        const minutes = parseInt(match?.[2] || 0);

        const seconds = parseInt(match?.[3] || 0);

        let result = "";

        if (hours) result += `${hours}h `;

        if (minutes) result += `${minutes}m `;

        if (seconds || (!hours && !minutes)) {
            result += `${seconds}s`;
        }

        return result.trim();
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
    const fetchYouTubeData = async (videoId) => {

        try {

            const API_KEY =
                import.meta.env.VITE_YOUTUBE_API_KEY;

            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`
            );

            const data = await res.json();

            const item = data.items?.[0];

            if (!item) return null;

            return {
                title: item.snippet.title,
                channel: item.snippet.channelTitle,
                language:
                    item.snippet.defaultAudioLanguage ||
                    item.snippet.defaultLanguage ||
                    "unknown",
                duration: convertDuration(
                    item.contentDetails.duration
                ),
            };

        } catch (error) {

            console.error(error);

            return null;
        }
    };

    // ---------------- HANDLERS ----------------
    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleUrlBlur = async () => {

        const videoId = getYouTubeId(form.url);

        if (!videoId) return;

        setLoading(true);

        setForm((prev) => ({
            ...prev,
            videoId,
        }));

        const ytData = await fetchYouTubeData(videoId);

        if (ytData) {

            setForm((prev) => ({
                ...prev,
                videoTitle: ytData.title,
                channel: ytData.channel,
                spokenLanguage: ytData.language,
                duration: ytData.duration,
            }));
        }

        setLoading(false);
    };

    const resetForm = () => {

        setForm({
            url: "",
            channel: "",
            videoId: "",
            videoTitle: "",
            duration: "",
            spokenLanguage: "",
            course: "",
            uploadedBy: "",
        });

        setEditingId(null);
    };

    // ---------------- SUBMIT ----------------
    const handleSubmit = async () => {

        if (
            !form.url.trim() ||
            !form.videoTitle.trim() ||
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
                videoId: form.videoId,
                videoTitle: form.videoTitle,
                channel: form.channel,
                duration: form.duration,
                spokenLanguage: form.spokenLanguage,
                course: form.course,
                uploadedBy: user,
                createdAt: editingId
                    ? videos.find(v => v.id === editingId)?.createdAt
                    : new Date().toISOString(),
            };

            if (editingId) {

                await updateVideos(editingId, payload);

            } else {

                await addVideos(payload);
            }

            await fetchVideos();

            setIsOpen(false);

            resetForm();

        } catch (error) {

            console.error(error);
        }
    };

    // ---------------- DELETE ----------------
    const handleDelete = async (id) => {

        try {

            await deleteVideos(id);

            setVideos(
                videos.filter((v) => v.id !== id)
            );

        } catch (error) {

            console.error(error);
        }
    };

    // ---------------- EDIT ----------------
    const handleEdit = (v) => {

        setForm({
            url: v.url,
            videoId: v.videoId || "",
            videoTitle: v.videoTitle || "",
            channel: v.channel || "",
            duration: v.duration || "",
            spokenLanguage: v.spokenLanguage || "",
            course: v.course || "",
        });

        setEditingId(v.id);

        setIsOpen(true);
    };

    return (

        <div className="min-h-screen bg-[#0B1120] text-white p-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <div>

                    <h1 className="text-4xl font-black bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Video Management
                    </h1>

                    <p className="text-gray-400 mt-1">
                        Manage coding tutorials & playlists
                    </p>

                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-linear-to-r from-cyan-500 to-purple-600 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
                >
                    + Add New Video
                </button>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                {/* TOTAL VIDEOS */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur">

                    <p className="text-gray-400 text-sm">
                        Total Videos
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {videos.length}
                    </h2>

                </div>

                {/* COURSES */}
                <div
                    onClick={() =>
                        setShowDetails({
                            type: "courses",
                            open: true,
                        })
                    }
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur cursor-pointer hover:border-cyan-500/40 transition"
                >

                    <p className="text-gray-400 text-sm">
                        Courses
                    </p>

                    <h2 className="text-3xl font-bold mt-2">

                        {
                            [...new Set(
                                videos.map(v => v.course)
                            )].length
                        }

                    </h2>

                </div>

                {/* LANGUAGES */}
                <div
                    onClick={() =>
                        setShowDetails({
                            type: "languages",
                            open: true,
                        })
                    }
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur cursor-pointer hover:border-purple-500/40 transition"
                >

                    <p className="text-gray-400 text-sm">
                        Languages
                    </p>

                    <h2 className="text-3xl font-bold mt-2">

                        {
                            [...new Set(
                                videos.map(v => v.spokenLanguage)
                            )].length
                        }

                    </h2>

                </div>

            </div>

            {/* DETAILS MODAL */}
            {showDetails.open && (

                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 w-full max-w-md">

                        <div className="flex items-center justify-between mb-5">

                            <h2 className="text-2xl font-bold">

                                {showDetails.type === "courses"
                                    ? "Available Courses"
                                    : "Available Languages"}

                            </h2>

                            <button
                                onClick={() =>
                                    setShowDetails({
                                        type: "",
                                        open: false,
                                    })
                                }
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ✕
                            </button>

                        </div>

                        <div className="flex flex-col gap-3">

                            {(showDetails.type === "courses"
                                ? [...new Set(videos.map(v => v.course))]
                                : [...new Set(videos.map(v => v.spokenLanguage))]
                            ).map((item, index) => (

                                <div
                                    key={index}
                                    onClick={() => {

                                        if (showDetails.type === "courses") {

                                            setFilters((prev) => ({
                                                ...prev,
                                                course: item,
                                            }));

                                        } else {

                                            setFilters((prev) => ({
                                                ...prev,
                                                language: item,
                                            }));
                                        }

                                        setShowDetails({
                                            type: "",
                                            open: false,
                                        });

                                    }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-cyan-500/40 transition"
                                >

                                    <span>
                                        {item || "Unknown"}
                                    </span>

                                    <span className="text-cyan-400 text-sm">

                                        {
                                            videos.filter(v =>
                                                showDetails.type === "courses"
                                                    ? v.course === item
                                                    : v.spokenLanguage === item
                                            ).length
                                        }

                                        {" "}videos

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

                            <button
                                onClick={() =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        course: "",
                                    }))
                                }
                            >
                                ✕
                            </button>

                        </div>

                    )}

                    {filters.language && (

                        <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full flex items-center gap-2">

                            Language: {filters.language}

                            <button
                                onClick={() =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        language: "",
                                    }))
                                }
                            >
                                ✕
                            </button>

                        </div>

                    )}

                </div>

            )}

            {/* ADD / EDIT MODAL */}
            {isOpen && (

                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 w-full max-w-2xl">

                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-6">

                            <h2 className="text-2xl font-bold">

                                {editingId
                                    ? "Edit Video"
                                    : "Add New Video"}

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

                        {/* FORM */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <input
                                required
                                type="text"
                                name="url"
                                placeholder="YouTube URL"
                                value={form.url}
                                onChange={handleChange}
                                onBlur={handleUrlBlur}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                            />

                            <select
                                name="course"
                                value={form.course}
                                onChange={handleChange}
                                className={`bg-[#111827] border rounded-xl px-4 py-3 outline-none w-full
        
                                    }`}
                            >

                                <option disabled value="">
                                    Select Course
                                </option>

                                <option value="C++">
                                    C++
                                </option>

                                <option value="C#">
                                    C#
                                </option>

                                <option value="Python">
                                    Python
                                </option>

                                <option value="JavaScript">
                                    JavaScript
                                </option>

                                <option value="HTML/CSS">
                                    HTML/CSS
                                </option>

                            </select>

                            

                            <input
                                type="text"
                                name="videoTitle"
                                placeholder="Video Title"
                                value={form.videoTitle}
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
                                name="duration"
                                placeholder="Duration"
                                value={form.duration}
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
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
                                onChange={handleChange}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                            />

                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() => {

                                    setIsOpen(false);

                                    resetForm();

                                }}
                                className="bg-gray-500/20 text-gray-300 px-5 py-2 rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-linear-to-r from-cyan-500 to-purple-600 px-6 py-2 rounded-xl font-semibold"
                            >

                                {loading
                                    ? "Loading..."
                                    : editingId
                                        ? "Update Video"
                                        : "Add Video"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* VIDEO LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {[...filteredVideos]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((v, index) => (

                        <div
                            key={v.id}
                            className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col h-full"
                        >

                            {/* THUMBNAIL */}
                            <div className="relative">

                                <img
                                    src={`https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`}
                                    alt={v.videoTitle}
                                    className="w-full h-56 object-cover"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />

                                <div className="absolute bottom-4 left-4">

                                    <span className="bg-cyan-500 text-xs px-3 py-1 rounded-full font-semibold">
                                        {v.course}
                                    </span>

                                </div>

                            </div>

                            {/* CONTENT */}
                            <div className="p-5 flex flex-col flex-1">

                                <p className="text-xs text-gray-400 mb-2">
                                    #{index + 1}
                                </p>

                                <h2 className="font-bold text-xl line-clamp-2 mb-2">
                                    {v.videoTitle}
                                </h2>

                                <p className="text-gray-400 text-sm mb-4">
                                    {v.channel}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">

                                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                                        {v.duration}
                                    </span>

                                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                                        {v.spokenLanguage}
                                    </span>

                                </div>

                                <p className="text-xs text-gray-500 mb-5">

                                    Uploaded:
                                    {" "}
                                    {formatDate(v.createdAt)}
                                    {" | "}
                                    {v.uploadedBy}

                                </p>

                                {/* BUTTONS */}
                                <div className="flex gap-3 mt-auto">

                                    <a
                                        href={v.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-xl text-center hover:bg-green-500/30 transition"
                                    >
                                        Watch
                                    </a>

                                    <button
                                        onClick={() => handleEdit(v)}
                                        className="flex-1 bg-yellow-500/20 text-yellow-400 py-2 rounded-xl hover:bg-yellow-500/30 transition"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(v.id)}
                                        className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-xl hover:bg-red-500/30 transition"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

            </div>

        </div>
    );
}