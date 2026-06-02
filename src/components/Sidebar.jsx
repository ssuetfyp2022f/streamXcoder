import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isopenSidebar, setisopenSidebar, activeTab, setActiveTab }) => {
    const { user } = useAuth();

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: "📊", path: "/admin" },
        { id: "users", label: "Users", icon: "👥", path: "/admin/users" },
        { id: "videos", label: "Videos", icon: "🎥", path: "/admin/videos" },
        { id: "playlists", label: "Playlists", icon: "📂", path: "/admin/playlists" },
    ];

    return (
        <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-0 left-0 h-screen bg-[#0f172a]/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col z-50
            ${isopenSidebar ? "w-72" : "w-20"}`}
        >
            {/* Logo Area */}
            <div className={`h-24 p-6 border-b border-white/10 ${!isopenSidebar && "px-3"}`}>
                {isopenSidebar ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🎬</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                streamXcoder
                            </h1>
                            <p className="text-xs text-zinc-500">Admin Panel</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-12 h-12 bg-linear-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto">
                        <span className="text-2xl">🎬</span>
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setisopenSidebar(!isopenSidebar)}
                className="absolute -right-3 top-20 rounded-full bg-cyan-500 text-white shadow-lg transition-all hover:scale-110 w-6 h-6 flex items-center justify-center"
            >
                {isopenSidebar ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 mt-8 px-3">
                {navItems.map((item) => (
                    <Link key={item.id} to={item.path}>
                        <motion.button
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center rounded-xl transition-all relative group
                            ${isopenSidebar ? "w-full gap-3 px-4 py-3" : "w-12 h-12 justify-center mx-auto"}
                            ${activeTab === item.id
                                    ? "bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                                    : "hover:bg-white/5"
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>

                            {isopenSidebar && (
                                <span className="text-sm font-medium">{item.label}</span>
                            )}

                            {!isopenSidebar && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                    {item.label}
                                </div>
                            )}
                        </motion.button>
                    </Link>
                ))}
            </nav>

            {/* Admin Profile */}
            <div className="p-4 border-t border-white/10">
                <div
                    className={`bg-linear-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-3 border border-cyan-500/20
                    ${!isopenSidebar && "flex justify-center w-14"}`}
                >
                    {isopenSidebar ? (
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-8 h-8 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                                <span>👨‍💼</span>
                            </div>
                            <div>
                                <h2 className="font-semibold text-sm">
                                    {user?.displayName || "Admin"}
                                </h2>
                                <p className="text-xs text-zinc-500">
                                    {user?.email || "admin@email.com"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-lg">👨‍💼</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;