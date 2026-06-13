import React, { useEffect, useMemo, useState } from "react";
import { Search, Users as UsersIcon, Shield, Eye, Trash2, X, Loader2, } from "lucide-react";
import { motion } from "framer-motion";
import { getUsers, updateUserRole, deleteUser } from "../api/users.api";
import Sidebar from "../components/Sidebar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [isopenSidebar, setisopenSidebar] = useState(true); // Default to true (open)
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState("fasle");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // FILTER LOGIC
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.displayName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesRole =
        roleFilter === "all"
          ? true
          : user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalUsers = users.filter((u) => u.role === "user").length;

  const handleDelete = async (userId, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);
    if (!confirmDelete) return;

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await updateUserRole(userId, role);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role } : user
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        {/* Background */}
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
              <UsersIcon size={35} className="text-white" />
            </div>

            <div>
              <h1 className="text-5xl font-bold bg-linear-to-r from-[#00ADB5] to-[#61DAFB] bg-clip-text text-transparent">
                User Management
              </h1>

              <p className="text-gray-400 mt-2">
                View and manage all registered users.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl text-white border border-white/10 outline-none"
                style={{ backgroundColor: "rgba(57,62,70,0.4)" }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            {/* Total Users */}
            <div
              onClick={() => setRoleFilter("all")}
              className={`relative p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ${roleFilter === "all"
                ? "border border-cyan-400/30"
                : "border border-white/10"
                }`}
              style={{
                background: "linear-gradient(135deg, rgba(0,173,181,0.15), rgba(97,218,251,0.10))",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-300 text-sm">Total Users</h3>
                  <p className="text-4xl font-bold text-white mt-2">
                    {users.length}
                  </p>
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
                  <UsersIcon className="text-white" size={22} />
                </div>
              </div>
            </div>

            {/* Admins */}
            <div
              onClick={() => setRoleFilter("admin")}
              className={`relative p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ${roleFilter === "admin"
                ? "border border-emerald-400/30"
                : "border border-white/10"
                }`}
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(34,197,94,0.10))",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-300 text-sm">Admins</h3>
                  <p className="text-4xl font-bold text-white mt-2">
                    {totalAdmins}
                  </p>
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
                  <Shield className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            {/* Users */}
            <div
              onClick={() => setRoleFilter("user")}
              className={`relative p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 ${roleFilter === "user"
                ? "border border-purple-400/30"
                : "border border-white/10"
                }`}
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.10))",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-300 text-sm">Students</h3>
                  <p className="text-4xl font-bold text-white mt-2">
                    {totalUsers}
                  </p>
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
                  <UsersIcon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

          </div>

          {/* User List */}
          <div className="space-y-3">
            {[...filteredUsers]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg,#00ADB5,#61DAFB)",
                      }}
                    >
                      {user.displayName?.charAt(0)?.toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-white font-semibold truncate">
                        {user.displayName}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 ml-auto">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="w-fit p-2 rounded-lg text-white"
                      style={{ backgroundColor: "#222831" }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-4 py-2 rounded-lg text-white flex items-center gap-2"
                      style={{ backgroundColor: "#00ADB5" }}
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <button
                      onClick={() => handleDelete(user.id, user.displayName)}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl p-6" style={{ backgroundColor: "#222831" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: "#00ADB5" }}>
                  User Details
                </h2>

                <button onClick={() => setSelectedUser(null)}>
                  <X className="text-white" size={24} />
                </button>
              </div>

              <div className="space-y-4 text-gray-300">
                <p><strong>Name:</strong> {selectedUser.displayName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p>
                  <strong>Role:</strong>{" "}
                  <span
                    style={{
                      color: selectedUser.role === "admin" ? "green" : "white",
                      fontWeight: 600,
                    }}
                  >
                    {selectedUser.role}
                  </span>
                </p>
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Joined:</strong> {formatDate(selectedUser.createdAt)}</p>
                <p><strong>Last Login:</strong> {formatDate(selectedUser.lastLogin)}</p>
                <p><strong>Subscription:</strong> {selectedUser.subscription}</p>
                <p><strong>Enrolled Courses:</strong> {selectedUser.enrolledCourses}</p>
                <p><strong>Languages:</strong> {selectedUser.languages}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#00ADB5] animate-spin mx-auto mb-4" />
            <p className="text-gray-200">Loading users...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
