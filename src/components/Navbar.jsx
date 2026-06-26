
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Video,
  Code,
  User,
  LogIn,
  Menu,
  X,
  LogOut,
  Upload,
  Search,
  Sparkles,
  Bell,
  Zap,
  Flame,
  ChevronDown,
  Command,
  Moon,
  Sun,
  Sparkle,
  BookOpen,
  TrendingUp,
  Settings,
  HelpCircle,
  Award,
  Calendar,
  Clock,
  Mail,
  CheckCircle,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3);
  const [darkMode, setDarkMode] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  // Check if user just logged in (show welcome popup)
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");
    if (user && justLoggedIn === "true") {
      setShowWelcomePopup(true);
      sessionStorage.removeItem("justLoggedIn");
      const timer = setTimeout(() => {
        setShowWelcomePopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Get user's first letter
  const getUserFirstLetter = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "?";
  };

  // Get user's display name
  const getUserName = () => {
    if (user?.displayName) {
      return user.displayName;
    } else if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Get user's email
  const getUserEmail = () => {
    return user?.email || "";
  };

  // Get random avatar color based on user name
  const getAvatarColor = () => {
    const colors = [
      "from-red-500 to-red-600",
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-yellow-500 to-yellow-600",
      "from-orange-500 to-orange-600",
    ];
    const index = getUserName().length % colors.length;
    return colors[index];
  };

  // ✅ Handle logout - Single click
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if current page is editor
  const isEditorPage = location.pathname.startsWith("/editor");
  const isAdminPage = location.pathname.startsWith("/admin");

  // Auto hide navbar on editor page
  useEffect(() => {
    let timer;
    if (isAdminPage) {
      setShowNavbar(false);
    } else if (isEditorPage) {
      setShowNavbar(true);
      timer = setTimeout(() => {
        setShowNavbar(false);
      }, 3000);
    } else {
      setShowNavbar(true);
    }
    return () => clearTimeout(timer);
  }, [isEditorPage, isAdminPage]);

  // Unhide navbar on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isEditorPage && e.clientY < 20) {
        setShowNavbar(true);
        clearTimeout(window.navbarTimer);
        window.navbarTimer = setTimeout(() => {
          setShowNavbar(false);
        }, 3000);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(window.navbarTimer);
    };
  }, [isEditorPage]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { path: "/", label: "Home", icon: Home, color: "#00ADB5" },
    { path: "/courses", label: "Courses", icon: BookOpen, color: "#8CC84B" },
    { path: "/editor", label: "Editor", icon: Code, color: "#61DAFB" },
  ];

  if (user) {
    navItems.push({
      path: "/dashboard",
      label: "Dashboard",
      icon: TrendingUp,
      color: "#FF6B35",
    });
  }

  return (
    <>
      {/* Welcome Popup */}
      <AnimatePresence>
        {showWelcomePopup && user && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 right-6 z-50"
          >
            <div
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                border: "1px solid rgba(0, 173, 181, 0.3)",
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#00ADB5] via-[#61DAFB] to-[#00ADB5] opacity-50"
                style={{ filter: "blur(20px)" }}
              />
              <div className="relative p-4 min-w-[280px]">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-r ${getAvatarColor()}`}
                  >
                    {getUserFirstLetter()}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">
                      Welcome back! 👋
                    </h3>
                    <p className="text-gray-300 text-sm">{getUserName()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle size={12} className="text-green-400" />
                      <span className="text-gray-400 text-xs">
                        Logged in successfully
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWelcomePopup(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#00ADB5] to-[#61DAFB]"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blur overlay for mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Navbar - ✅ Pehle jaisa hi, sirf editor page par hover height kam */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500
          ${showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"} 
          ${
            isScrolled
              ? "backdrop-blur-xl bg-[#393E46]/90 shadow-2xl shadow-black/20"
              : "backdrop-blur-md bg-[#393E46]/80"
          } 
          ${isEditorPage ? "py-0 lg:h-14 sm:h-10" : "py-2"}`}
        style={{
          borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.1)" : "none",
        }}
      >
        {/* Animated particles in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                backgroundColor: "#00ADB5",
                width: 16 + i * 24,
                height: 16 + i * 24,
                top: "20%",
                left: `${20 + i * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-2 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5"
            >
              <Link to="/" className="flex items-center gap-2 group">
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className={`flex items-center justify-center relative overflow-hidden group-hover:shadow-lg group-hover:shadow-[#00ADB5]/30 transition-all duration-300 ${isEditorPage ? "w-7 h-7" : "w-9 h-9"}
                  ${isEditorPage ? "rounded-lg" : "rounded-xl"}`}
                    style={{
                      background:
                        "linear-gradient(135deg, #00ADB5 0%, #393E46 100%)",
                    }}
                  >
                    <Code
                      size={isEditorPage ? 12 : 18}
                      className="text-white"
                    />
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{ backgroundColor: "#00ADB5" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      scale: { duration: 2, repeat: Infinity },
                    }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles
                      size={isEditorPage ? 8 : 10}
                      className="text-[#00ADB5]"
                    />
                  </motion.div>
                </motion.div>

                <div className="flex flex-col">
                  <motion.span
                    className={`font-bold bg-linear-to-r from-[#00ADB5] to-[#61DAFB] bg-clip-text text-transparent ${isEditorPage ? "text-base" : "text-xl"}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    StreamXCoder
                  </motion.span>
                  <span
                    className={`text-gray-300 flex items-center gap-1 ${isEditorPage ? "text-[9px]" : "text-[11px]"}`}
                  >
                    <Zap
                      size={isEditorPage ? 7 : 9}
                      className="text-[#00ADB5]"
                    />
                    Code Along With Videos
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-7">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`relative group rounded-lg mx-0.5 transition-all duration-300 ${isEditorPage ? "px-2 py-1" : "px-3 py-1.5"}`}
                    style={{
                      color:
                        location.pathname === item.path
                          ? item.color
                          : "#D1D5DB",
                    }}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="flex items-center gap-1.5">
                      <item.icon
                        size={isEditorPage ? 14 : 16}
                        style={{ color: item.color }}
                      />
                      <span
                        className={`font-medium ${isEditorPage ? "text-xs" : "text-sm"}`}
                      >
                        {item.label}
                      </span>
                    </div>
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      />
                    )}
                    {/* ✅ FIX: Editor page par hover height kam */}
                    <div
                      className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isEditorPage ? "h-8" : ""
                      }`}
                      style={{
                        backgroundColor: `${item.color}20`,
                        boxShadow: `0 0 20px ${item.color}40`,
                        height: isEditorPage ? "32px" : "auto",
                        top: isEditorPage ? "50%" : "auto",
                        transform: isEditorPage ? "translateY(-50%)" : "none",
                      }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Section */}
            <div
              className={`flex items-center ${isEditorPage ? "gap-1.5" : "gap-2"}`}
            >
              {/* User Profile / Auth */}
              {user ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown("user")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center p-0.5 rounded-xl backdrop-blur-sm hover:shadow-lg transition-all group ${isEditorPage ? "gap-1" : "gap-1.5"}`}
                    style={{
                      backgroundColor: "rgba(34, 40, 49, 0.8)",
                      border: "1px solid rgba(0, 173, 181, 0.3)",
                    }}
                  >
                    <div
                      className={`rounded-full flex items-center justify-center font-bold relative overflow-hidden bg-gradient-to-r ${getAvatarColor()} ${isEditorPage ? "w-5 h-5 text-xs" : "w-7 h-7 text-sm"}`}
                      style={{ color: "#FFFFFF" }}
                    >
                      {getUserFirstLetter()}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: "#00ADB5" }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div
                      className={`hidden lg:block text-left ${isEditorPage ? "mr-0.5" : "mr-1"}`}
                    >
                      <div
                        className={`font-semibold text-white ${isEditorPage ? "text-[10px]" : "text-xs"}`}
                      >
                        {getUserName()}
                      </div>
                      <div
                        className={`text-gray-300 flex items-center ${isEditorPage ? "text-[8px] gap-0" : "text-[10px] gap-0.5"}`}
                      >
                        <Sparkle
                          size={isEditorPage ? 6 : 8}
                          className="text-yellow-400"
                        />
                        {user?.role || "Member"}
                      </div>
                    </div>
                    <ChevronDown
                      size={isEditorPage ? 10 : 12}
                      className="text-gray-400 group-hover:rotate-180 transition-transform"
                    />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === "user" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 w-64"
                        style={{
                          backgroundColor: "rgba(57, 62, 70, 0.98)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div
                          className="p-4 border-b"
                          style={{ borderColor: "rgba(255,255,255,0.1)" }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-gradient-to-r ${getAvatarColor()}`}
                              style={{ color: "#FFFFFF" }}
                            >
                              {getUserFirstLetter()}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-white text-sm">
                                {getUserName()}
                              </div>
                              <div className="text-xs text-gray-300 flex items-center gap-1">
                                <Mail size={10} />
                                {getUserEmail()}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                  {user?.subscription === "premium"
                                    ? "⭐ Premium"
                                    : "✨ Free Member"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all text-sm"
                            style={{
                              backgroundColor: "#FF4081",
                              color: "#FFFFFF",
                            }}
                          >
                            <LogOut size={16} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div
                  className={`hidden lg:flex items-center ${isEditorPage ? "gap-1.5" : "gap-2"}`}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className={`rounded-lg font-medium flex items-center backdrop-blur-sm hover:shadow-lg transition-all ${isEditorPage ? "px-3 py-1 text-xs gap-1" : "px-4 py-1.5 text-sm gap-1.5"}`}
                    style={{
                      backgroundColor: "rgba(34, 40, 49, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#FFFFFF",
                    }}
                  >
                    <LogIn size={isEditorPage ? 12 : 16} />
                    <span>Login</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/signup")}
                    className={`rounded-lg font-bold relative overflow-hidden group ${isEditorPage ? "px-4 py-1 text-xs" : "px-5 py-1.5 text-sm"}`}
                    style={{
                      background:
                        "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
                      color: "#FFFFFF",
                    }}
                  >
                    <span
                      className={`relative z-10 flex items-center ${isEditorPage ? "gap-1" : "gap-1.5"}`}
                    >
                      <Flame size={isEditorPage ? 12 : 16} />
                      Get Started
                    </span>
                    <motion.div
                      className="absolute inset-0"
                      style={{ backgroundColor: "#393E46" }}
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden rounded-lg flex items-center justify-center backdrop-blur-sm ${isEditorPage ? "w-6 h-6" : "w-8 h-8"}`}
                style={{
                  backgroundColor: "rgba(34, 40, 49, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {isMenuOpen ? (
                  <X size={isEditorPage ? 14 : 18} className="text-white" />
                ) : (
                  <Menu size={isEditorPage ? 14 : 18} className="text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 mt-1 mx-4 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-40"
              style={{
                backgroundColor: "rgba(57, 62, 70, 0.98)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-all text-sm ${location.pathname === item.path ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                  >
                    <item.icon size={18} style={{ color: item.color }} />
                    <span className="font-medium">{item.label}</span>
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="mobile-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    )}
                  </Link>
                ))}
              </div>

              <div
                className="p-5 border-t"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base bg-gradient-to-r ${getAvatarColor()}`}
                        style={{ color: "#FFFFFF" }}
                      >
                        {getUserFirstLetter()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">
                          {getUserName()}
                        </div>
                        <div className="text-xs text-gray-300">
                          {user?.role || "Member"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm"
                      style={{ backgroundColor: "#FF4081", color: "#FFFFFF" }}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm"
                      style={{
                        backgroundColor: "rgba(34, 40, 49, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#FFFFFF",
                      }}
                    >
                      <LogIn size={16} />
                      <span>Login</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/signup");
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)",
                        color: "#FFFFFF",
                      }}
                    >
                      <Flame size={16} />
                      <span>Get Started Free</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer */}
      <div
        className={`transition-all duration-500 ${showNavbar ? (isEditorPage ? "lg:h-14 sm:h-9" : "h-14") : "h-0"}`}
      />
    </>
  );
};

export default Navbar;