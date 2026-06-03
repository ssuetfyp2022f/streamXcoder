import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsLeft, ChevronsRight, LayoutDashboard, Users, Video, FolderOpen, UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({
    isopenSidebar,
    setisopenSidebar,
    activeTab,
    setActiveTab,
}) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
        { id: "users", label: "Users", icon: Users, path: "/admin/users" },
        { id: "videos", label: "Videos", icon: Video, path: "/admin/videos" },
        { id: "playlists", label: "Playlists", icon: FolderOpen, path: "/admin/playlists" },
    ];

    return (
        <motion.aside
            animate={{ width: isopenSidebar ? 288 : 80 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-screen 
      bg-[#0B1220]/95 backdrop-blur-xl 
      border-r border-white/5 
      shadow-2xl flex flex-col z-50 overflow-hidden"
        >
            {/* LOGO */}
            <div className="h-24 p-4 border-b border-white/5 flex items-center">
                <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-linear-to-r from-cyan-300 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Video className="text-white" size={22} />
                    </div>

                    <AnimatePresence>
                        {isopenSidebar && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1 className="text-lg font-bold bg-linear-to-r from-cyan-300 to-cyan-600 bg-clip-text text-transparent">
                                    streamXcoder
                                </h1>
                                <p className="text-xs text-zinc-500">Admin Panel</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* TOGGLE */}
            <motion.button
                onClick={() => setisopenSidebar(!isopenSidebar)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="
                absolute top-20 -right-4
                w-8 h-8 rounded-full
                bg-linear-to-r from-cyan-300 to-cyan-600
                border-2 border-[#0B1220]
                shadow-[0_0_20px_rgba(6,182,212,0.4)]
                flex items-center justify-center
                text-white z-50"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isopenSidebar ? "left" : "right"}
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isopenSidebar ? (
                            <ChevronsLeft size={16} />
                        ) : (
                            <ChevronsRight size={16} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.button>

            {/* NAV */}
            <nav className="flex-1 space-y-2 mt-8 px-3">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link key={item.id} to={item.path}>
                            <motion.button
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(item.id)}
                                className={`relative flex items-center rounded-xl transition-all
                ${isopenSidebar ? "w-full gap-3 px-4 py-3" : "w-12 h-12 justify-center mx-auto"}
                ${activeTab === item.id
                                        ? "bg-linear-to-r from-cyan-500/15 to-blue-500/15 text-cyan-300 border border-cyan-500/30"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon size={20} />

                                <AnimatePresence>
                                    {isopenSidebar && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm font-medium"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Tooltip for collapsed */}
                                {!isopenSidebar && (
                                    <div
                                        className="absolute left-full ml-3 px-2 py-1 
                    bg-[#0B1220] border border-white/10 
                    text-white text-xs rounded-lg 
                    opacity-0 group-hover:opacity-100 
                    transition-all whitespace-nowrap z-50"
                                    >
                                        {item.label}
                                    </div>
                                )}
                            </motion.button>
                        </Link>
                    );
                })}
            </nav>

            {/* PROFILE */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-r from-cyan-300 to-cyan-600 rounded-full flex items-center justify-center shadow-md">
                        <UserCircle size={18} className="text-white" />
                    </div>

                    <AnimatePresence>
                        {isopenSidebar && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center justify-between w-full"
                            >
                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        {user?.displayName || "Admin"}
                                    </h2>
                                    <p className="text-xs text-zinc-400">
                                        {user?.email || "admin@email.com"}
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </motion.aside>
    );
};

export default Sidebar;