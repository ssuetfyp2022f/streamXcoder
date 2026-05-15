import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getVideos,
  addVideos,
  updateVideos,
  deleteVideos,
} from "../api/videos.api";

import { getUsers } from "../api/users.api";

export default function StreamXcoderAdminDashboard() {
  // =========================
  // STATES
  // =========================
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);

  // form states
  const [videoTitle, setVideoTitle] = useState("");
  const [codingLanguage, setCodingLanguage] = useState("");
  const [spokenLanguage, setSpokenLanguage] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");

  // edit mode
  const [editingVideoId, setEditingVideoId] = useState(null);

  // =========================
  // STATIC DATA
  // =========================
  const courses = [
    {
      title: "React Mastery",
      playlists: 6,
      videos: 42,
      difficulty: "Beginner",
      status: "Published",
    },
    {
      title: "Node.js API",
      playlists: 4,
      videos: 28,
      difficulty: "Intermediate",
      status: "Published",
    },
  ];

  const playlists = [
    {
      title: "React Basics",
      course: "React Mastery",
      videos: 10,
    },
    {
      title: "Hooks Deep Dive",
      course: "React Mastery",
      videos: 8,
    },
  ];

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const usersData = await getUsers();
      const videosData = await getVideos();

      setUsers(usersData || []);
      setVideos(videosData || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    if (timestamp.seconds) {
      return new Date(
        timestamp.seconds * 1000
      ).toLocaleString();
    }

    return "N/A";
  };

  // =========================
  // ADD VIDEO
  // =========================
  const handleAddVideo = async () => {
    if (
      !videoTitle ||
      !codingLanguage ||
      !spokenLanguage ||
      !uploadedBy
    ) {
      alert("Please fill all fields");
      return;
    }

    const newVideo = {
      videoTitle,
      codingLanguage,
      spokenLanguage,
      uploadedBy,
      createdAt: new Date(),
    };

    const response = await addVideos(newVideo);

    if (response.success) {
      await fetchDashboardData();

      // clear fields
      setVideoTitle("");
      setCodingLanguage("");
      setSpokenLanguage("");
      setUploadedBy("");

      alert("Video Added Successfully");
    }
  };

  // =========================
  // DELETE VIDEO
  // =========================
  const handleDeleteVideo = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmDelete) return;

    const response = await deleteVideos(id);

    if (response.success) {
      setVideos((prev) =>
        prev.filter((video) => video.id !== id)
      );

      alert("Video Deleted");
    }
  };

  // =========================
  // EDIT VIDEO
  // =========================
  const handleEditClick = (video) => {
    setEditingVideoId(video.id);

    setVideoTitle(video.videoTitle || "");
    setCodingLanguage(video.codingLanguage || "");
    setSpokenLanguage(video.spokenLanguage || "");
    setUploadedBy(video.uploadedBy || "");
  };

  // =========================
  // UPDATE VIDEO
  // =========================
  const handleUpdateVideo = async () => {
    const updatedData = {
      videoTitle,
      codingLanguage,
      spokenLanguage,
      uploadedBy,
    };

    const response = await updateVideos(
      editingVideoId,
      updatedData
    );

    if (response.success) {
      await fetchDashboardData();

      setEditingVideoId(null);

      setVideoTitle("");
      setCodingLanguage("");
      setSpokenLanguage("");
      setUploadedBy("");

      alert("Video Updated Successfully");
    }
  };

  // =========================
  // STATS
  // =========================
  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: "👥",
    },
    {
      title: "Courses",
      value: courses.length,
      icon: "📚",
    },
    {
      title: "Playlists",
      value: playlists.length,
      icon: "📂",
    },
    {
      title: "Videos",
      value: videos.length,
      icon: "🎥",
    },
  ];

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-cyan-400">
              StreamXcoder
            </h1>

            <p className="text-zinc-400 mt-2 text-sm">
              Admin Dashboard
            </p>
          </div>

          <nav className="space-y-3">
            {[
              "Dashboard",
              "Users",
              "Courses",
              "Playlists",
              <Link to="/admin/videos">Videos</Link>,
              "Analytics",
              "Settings",
            ].map((item) => (
              <button
                key={item}
                className="w-full text-left px-4 py-3 rounded-2xl hover:bg-cyan-500/10 hover:text-cyan-400 transition"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-zinc-800 rounded-2xl p-4 mt-10">
          <p className="text-sm text-zinc-400">
            Logged in as
          </p>

          <h2 className="font-semibold mt-1">Admin</h2>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold">
            Dashboard Overview
          </h2>

          <p className="text-zinc-400 mt-2">
            Manage users and videos.
          </p>
        </div>

        {/* ================= STATS ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {stats.map((item) => (
            <div
              key={item.title}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400">
                  {item.title}
                </h3>

                <span className="text-3xl">
                  {item.icon}
                </span>
              </div>

              <p className="text-4xl font-bold">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* ================= VIDEO FORM ================= */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-6">
            {editingVideoId
              ? "Update Video"
              : "Add Video"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Video Title"
              value={videoTitle}
              onChange={(e) =>
                setVideoTitle(e.target.value)
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="text"
              placeholder="Coding Language"
              value={codingLanguage}
              onChange={(e) =>
                setCodingLanguage(e.target.value)
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="text"
              placeholder="Spoken Language"
              value={spokenLanguage}
              onChange={(e) =>
                setSpokenLanguage(e.target.value)
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="text"
              placeholder="Uploaded By"
              value={uploadedBy}
              onChange={(e) =>
                setUploadedBy(e.target.value)
              }
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div className="mt-6">
            {editingVideoId ? (
              <button
                onClick={handleUpdateVideo}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-2xl font-semibold"
              >
                Update Video
              </button>
            ) : (
              <button
                onClick={handleAddVideo}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-2xl font-semibold"
              >
                Add Video
              </button>
            )}
          </div>
        </section>

        {/* ================= USERS TABLE ================= */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6">
            Users
          </h2>

          {users.length === 0 ? (
            <p>No Users Found</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="pb-4">#</th>
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">
                    Subscription
                  </th>
                  <th className="pb-4">
                    Last Login
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id || index}
                    className="border-b border-zinc-800"
                  >
                    <td className="py-5">
                      {index + 1}
                    </td>

                    <td>
                      {user.displayName ||
                        "No Name"}
                    </td>

                    <td>{user.email}</td>

                    <td>
                      {user.subscription ||
                        "Free"}
                    </td>

                    <td>
                      {formatDate(
                        user.lastLogin
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ================= VIDEOS ================= */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Videos
          </h2>

          <div className="space-y-4">
            {videos.length === 0 ? (
              <p>No Videos Found</p>
            ) : (
              videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-zinc-800 rounded-2xl p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-xl">
                        {video.videoTitle}
                      </h3>

                      <p className="text-zinc-400 mt-1">
                        {video.codingLanguage} →{" "}
                        {video.spokenLanguage}
                      </p>

                      <p className="text-zinc-500 text-sm mt-1">
                        Uploaded By:{" "}
                        {video.uploadedBy}
                      </p>

                      <p className="text-zinc-500 text-sm mt-1">
                        Created At:{" "}
                        {formatDate(
                          video.createdAt
                        )}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleEditClick(video)
                        }
                        className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-xl"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteVideo(
                            video.id
                          )
                        }
                        className="bg-red-500/10 text-red-400 px-4 py-2 rounded-xl"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}











// import React, { useEffect, useState } from "react";
// import { getUsers } from "../api/users.api";
// import { getVideos } from "../api/videos.api";

// const Admin = () => {
//     const [users, setUsers] = useState([]);
//     const [videos, setVideos] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const data = await getUsers();
//                 setUsers(data);
//             } catch (error) {
//                 console.error("Error fetching users:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUsers();

//         const fetchVideos = async () => {
//             try {
//                 const data = await getVideos();
//                 setVideos(data);
//             } catch (error) {
//                 console.error("Error fetching videos:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchVideos();
//     }, []);

//     if (loading) return <p>Loading ...</p>;

//     // date time format convert
//     const formatDate = (timestamp) => {
//         if (!timestamp) return "N/A";

//         // Firestore Timestamp
//         if (timestamp.seconds) {
//             return new Date(timestamp.seconds * 1000).toLocaleString();
//         }

//         return "N/A";
//     };

//     return (
//         <div className="p-4 sm:p-6">
//             <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//                 Admin Panel
//             </h1>
//             <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//                 - Users Data -
//             </h1>

//             {users.length === 0 ? (
//                 <p className="text-gray-500">No users found</p>
//             ) : (
//                 <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
//                     <table className="min-w-full bg-white">
//                         <thead className="bg-gray-900 text-white">
//                             <tr>
//                                 <th className="px-3 sm:px-4 py-3 text-left text-sm">#</th>
//                                 <th className="px-3 sm:px-4 py-3 text-left text-sm">Name</th>
//                                 <th className="px-3 sm:px-4 py-3 text-left text-sm">Email</th>
//                                 <th className="px-3 sm:px-4 py-3 text-left text-sm">Subscription</th>
//                                 <th className="px-3 sm:px-4 py-3 text-left text-sm">Last Login</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {users.map((user, index) => (
//                                 <tr
//                                     key={user.id || index}
//                                     className="border-b hover:bg-gray-50 transition"
//                                 >
//                                     <td className="px-3 sm:px-4 py-3 text-sm text-gray-700">
//                                         {index + 1}
//                                     </td>

//                                     <td className="px-3 sm:px-4 py-3 text-sm font-medium text-gray-800">
//                                         {user.displayName ? user.displayName : user.email}
//                                     </td>

//                                     <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 break-all">
//                                         {user.email || "N/A"}
//                                     </td>

//                                     <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 break-all">
//                                         {user.subscription || "N/A"}
//                                     </td>

//                                     <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 break-all">
//                                         {formatDate(user.lastLogin) || "N/A"}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//                 - Videos Data -
//             </h1>
//             {videos.length === 0 ? (
//                 <p className="text-gray-500">No users found</p>
//             ) : (
//                 <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
//                     <table className="min-w-full bg-white">
//                         <thead className="bg-gray-900 text-white">
//                             <tr>
//                                 <th className="px-3 sm:px-4 py-3 text-left text-sm">#</th>
//                                 <th className="px-3 sm:px-4 py-3 text-left text-sm">Title</th>
//                                 <th className="px-3 sm:px-4 py-3 text-left text-sm">Coding Language</th>
//                                 <th className="px-3 sm:px-4 py-3 text-left text-sm">Spoken Language</th>
//                                 <th className="px-3 sm:px-4 py-3 text-left text-sm">Uploaded by</th>
//                                 <th className="px-3 sm:px-4 py-3 text-left text-sm">Uploaded at</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {videos.map((video, index) => (
//                                 <tr
//                                     key={video.id || index}
//                                     className="border-b hover:bg-gray-50 transition"
//                                 >
//                                     <td className="px-3 sm:px-4 py-3 text-sm text-gray-700">
//                                         {index + 1}
//                                     </td>

//                                     <td className="px-3 sm:px-4 py-3 text-sm font-medium text-gray-800">
//                                         {video.videoTitle || "N/A"}
//                                     </td>

//                                     <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 break-all">
//                                         {video.codingLanguage || "N/A"}
//                                     </td>

//                                     <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 break-all">
//                                         {video.spokenLanguage || "N/A"}
//                                     </td>

//                                     <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 break-all">
//                                         {video.uploadedBy || "N/A"}
//                                     </td>

//                                     <td className="px-3 sm:px-4 py-3 text-sm text-gray-600 break-all">
//                                         {formatDate(video.createdAt) || "N/A"}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>

//     );
// };

// export default Admin;
