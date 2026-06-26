import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import {
  TrendingUp, BookOpen, Code, Award, Flame, Calendar, Clock, 
  ChevronRight, Play, Save, Star, Users, Zap, Target, 
  Activity, BarChart3, CircleDollarSign, Trophy, Medal,
  GitBranch, Terminal, Coffee, Heart, Sparkles, Rocket,
  MonitorPlay, FileCode, Layers, Crown, Gift, Gem,
  Loader2, CheckCircle, Brain, TrendingUp as TrendingUpIcon,
  X, ExternalLink, Info, Copy, Edit3
} from 'lucide-react';
import {
  getUserProfile,
  getUserCourses,
  getUserCodes,
  getUserAchievements,
  getUserLanguagesWithProgress,
  updateUserStreak,
  ALL_LANGUAGES
} from '../firebase/userData';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [codes, setCodes] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [languagesWithProgress, setLanguagesWithProgress] = useState([]);
  const [showAllCoursesModal, setShowAllCoursesModal] = useState(false);
  const [showAllCodesModal, setShowAllCodesModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null); // ✅ NEW
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalCodes: 0,
    totalPoints: 0,
    streak: 0
  });

  // Achievement details mapping
  const achievementDetails = {
    first_code: { title: "First Code", description: "Write and save your first code snippet", icon: "🎯", points: 50, howTo: "Save any code in the editor" },
    code_master: { title: "Code Master", description: "Save 10 code snippets", icon: "👨‍💻", points: 200, howTo: "Save 10 different code snippets" },
    streak_7: { title: "Weekly Warrior", description: "Login for 7 consecutive days", icon: "🔥", points: 100, howTo: "Login daily for 7 days" },
    streak_30: { title: "Monthly Legend", description: "Login for 30 consecutive days", icon: "⭐", points: 500, howTo: "Login daily for 30 days" },
    course_complete: { title: "Course Master", description: "Complete your first course", icon: "📚", points: 100, howTo: "Watch all videos of any course" },
  };

  // Get user name
  const getUserName = () => {
    if (userData?.displayName) return userData.displayName;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Coder';
  };

  const getUserFirstLetter = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  // Get overall progress
  const getOverallProgress = () => {
    if (languagesWithProgress.length === 0) return 0;
    const total = languagesWithProgress.reduce((sum, lang) => sum + (lang.progress || 0), 0);
    return Math.round(total / languagesWithProgress.length);
  };

  // Get primary language
  const getPrimaryLanguage = () => {
    if (languagesWithProgress.length === 0) return null;
    return languagesWithProgress.reduce((best, current) => 
      (current.progress > best.progress) ? current : best
    );
  };

  // ✅ NEW: Handle code click
  const handleCodeClick = (code) => {
    setSelectedCode(code);
  };

  // ✅ NEW: Copy code to clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  // ✅ NEW: Open code in editor
  const openCodeInEditor = (code) => {
    setSelectedCode(null);
    navigate('/editor', { state: { code: code.code, title: code.title, language: code.language } });
  };

  // Fetch all data once
  useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        await updateUserStreak(user.uid);
        
        const userResult = await getUserProfile(user.uid);
        if (userResult.success) {
          setUserData(userResult.data);
          setStats(prev => ({
            ...prev,
            totalPoints: userResult.data?.points || 0,
            streak: userResult.data?.streak || 0
          }));
        }
        
        const coursesResult = await getUserCourses(user.uid);
        if (coursesResult.success) {
          setCourses(coursesResult.data);
          setStats(prev => ({
            ...prev,
            totalCourses: coursesResult.data.length,
            completedCourses: coursesResult.data.filter(c => c.status === 'completed').length
          }));
        }
        
        
        const codesResult = await getUserCodes(user.uid);
        console.log("Codes Result:", codesResult);  // ✅ Add this line
        if (codesResult.success) {
           console.log("Codes data:", codesResult.data);
          setCodes(codesResult.data);
          setStats(prev => ({
            ...prev,
            totalCodes: codesResult.data.length
          }));
        }
        else{
          console.log("Codes error:", codesResult.error); 
        }
        
        const achievementsResult = await getUserAchievements(user.uid);
        
        if (achievementsResult.success) {
          setAchievements(achievementsResult.data);
        }
        
        const languagesResult = await getUserLanguagesWithProgress(user.uid);
        if (languagesResult.success) {
          setLanguagesWithProgress(languagesResult.data);
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, [user]);

  // Recommended courses
  const getRecommendedCourses = () => {
    if (languagesWithProgress.length === 0) return [];
    
    const recommendations = [];
    languagesWithProgress.forEach(lang => {
      const langCourses = courses.filter(c => c.language === lang.id);
      const inProgress = langCourses.find(c => c.status === 'in_progress');
      if (inProgress) {
        recommendations.push({
          id: inProgress.courseId,
          title: inProgress.courseTitle,
          language: lang.id,
          progress: inProgress.percentage,
          level: lang.level
        });
      }
    });
    
    return recommendations.slice(0, 3);
  };

  const recommendedCourses = getRecommendedCourses();

  // Recent activity
  const recentActivity = [
    ...courses.slice(0, 3).map(course => ({
      id: course.id,
      type: 'course',
      title: course.courseTitle,
      action: 'Watched',
      time: course.lastWatched ? new Date(course.lastWatched).toLocaleDateString() : 'Recently',
      icon: '📘',
      color: '#00ADB5',
      videoId: course.courseId
    })),
    ...codes.slice(0, 3).map(code => ({
      id: code.id,
      type: 'code',
      title: code.title,
      action: 'Saved',
      time: code.createdAt ? new Date(code.createdAt).toLocaleDateString() : 'Recently',
      icon: '💻',
      color: '#61DAFB',
      codeContent: code.code
    }))
  ];

  // Handle activity click
  const handleActivityClick = (activity) => {
    if (activity.type === 'course') {
      navigate(`/editor/${activity.videoId}`);
    } else if (activity.type === 'code') {
      const codeData = codes.find(c => c.id === activity.id);
      if (codeData) handleCodeClick(codeData);
    }
  };

  // Handle achievement click
  const handleAchievementClick = (achievementId) => {
    const details = achievementDetails[achievementId] || {
      title: achievementId,
      description: "Complete specific tasks to earn this achievement",
      icon: "🏆",
      points: 0,
      howTo: "Keep learning and coding!"
    };
    setSelectedAchievement({ id: achievementId, ...details });
  };

  // Leaderboard
  const leaderboard = [
    { rank: 1, name: 'Alex Coder', points: 5840, avatar: 'A' },
    { rank: 2, name: 'Sarah Dev', points: 4920, avatar: 'S' },
    { rank: 3, name: 'Mike Tech', points: 3850, avatar: 'M' },
    { rank: 4, name: getUserName(), points: stats.totalPoints, avatar: getUserFirstLetter(), current: true }
  ];

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl"
            >
              <div className="bg-[#1a1a2e] rounded-2xl max-h-[85vh] overflow-hidden border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                  <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
                  {children}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1422] to-[#0A0F1C] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#00ADB5] animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading your dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching your learning data</p>
        </div>
      </div>
    );
  }

  const overallProgress = getOverallProgress();
  const primaryLang = getPrimaryLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1422] to-[#0A0F1C]">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ADB5]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#61DAFB]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        
        {/* Welcome Section */}
       
<div className="flex gap-3 my-4">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => window.location.reload()}
    className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold flex items-center gap-2 hover:bg-white/20 transition-all"
  >
    <RefreshCw size={18} />
    Refresh
  </motion.button>
  
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigate('/courses')}
    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00ADB5] to-[#61DAFB] text-white font-semibold flex items-center gap-2 shadow-lg shadow-[#00ADB5]/20"
  >
    <Play size={18} />
    Browse Courses
  </motion.button>
</div>
       

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { icon: <BookOpen className="text-[#00ADB5]" />, label: 'Watched Videos', value: stats.totalCourses, bg: 'from-cyan-500/10 to-blue-500/10' },
            { icon: <Award className="text-yellow-400" />, label: 'Points Earned', value: stats.totalPoints.toLocaleString(), bg: 'from-yellow-500/10 to-orange-500/10' },
            { icon: <Flame className="text-orange-500" />, label: 'Day Streak', value: `${stats.streak} days`, bg: 'from-orange-500/10 to-red-500/10' },
            { icon: <Code className="text-purple-400" />, label: 'Code Snippets', value: stats.totalCodes, bg: 'from-purple-500/10 to-pink-500/10' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative overflow-hidden rounded-2xl backdrop-blur-sm p-5 bg-gradient-to-br ${stat.bg}`}
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Language Progress Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl backdrop-blur-sm overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(0,173,181,0.15) 0%, rgba(97,218,251,0.05) 100%)', border: '1px solid rgba(0,173,181,0.3)' }}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain size={22} className="text-[#00ADB5]" />
                    <h2 className="text-xl font-bold text-white">Your Learning Progress</h2>
                  </div>
                </div>
                
                {languagesWithProgress.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">You haven't selected any language yet!</p>
                    <button 
                      onClick={() => navigate('/language-settings')}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#00ADB5] to-[#61DAFB] text-white font-medium hover:opacity-90 transition-all"
                    >
                      Select Your First Language
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">Overall Progress</span>
                        <span className="text-[#00ADB5] font-bold">{overallProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${overallProgress}%` }}
                          transition={{ duration: 1 }}
                          className="h-full rounded-full bg-gradient-to-r from-[#00ADB5] to-[#61DAFB]"
                        />
                      </div>
                      {primaryLang && (
                        <p className="text-xs text-gray-400 mt-2">
                          Primary focus: <span className="text-[#00ADB5]">{primaryLang.name}</span> ({primaryLang.progress}% mastered)
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {languagesWithProgress.map((lang) => (
                        <div key={lang.id} className="p-3 rounded-xl bg-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{lang.icon}</span>
                              <div>
                                <p className="text-white font-semibold">{lang.name}</p>
                                <p className="text-xs text-gray-400">{lang.level}</p>
                              </div>
                            </div>
                            <span className="text-sm font-bold" style={{ color: lang.color }}>
                              {lang.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${lang.progress}%` }}
                              transition={{ duration: 0.8 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: lang.color }}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-gray-400">
                            <span>{lang.coursesCompleted}/{lang.totalCourses} courses</span>
                            {lang.progress === 100 && <CheckCircle size={12} className="text-green-400" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Continue Learning Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl backdrop-blur-sm overflow-hidden"
              style={{ background: 'rgba(15, 20, 34, 0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="p-5 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MonitorPlay size={20} className="text-[#00ADB5]" />
                    <h2 className="text-xl font-bold text-white">Continue Learning</h2>
                  </div>
                  <button 
                    onClick={() => setShowAllCoursesModal(true)}
                    className="text-[#00ADB5] text-sm hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-white/10">
                {recommendedCourses.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No courses in progress</p>
                    <button 
                      onClick={() => navigate('/courses')}
                      className="mt-3 text-[#00ADB5] text-sm hover:underline"
                    >
                      Browse Courses →
                    </button>
                  </div>
                ) : (
                  recommendedCourses.map((course) => {
                    const langInfo = ALL_LANGUAGES.find(l => l.id === course.language);
                    return (
                      <div key={course.id} className="p-5 hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{langInfo?.icon || '📚'}</span>
                              <h3 className="font-semibold text-white group-hover:text-[#00ADB5] transition-colors">
                                {course.title}
                              </h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                course.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {course.level}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                              <span className="flex items-center gap-1">
                                <Target size={12} /> {course.progress}% Complete
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${course.progress}%` }}
                                transition={{ duration: 1 }}
                                className="h-full rounded-full bg-gradient-to-r from-[#00ADB5] to-[#61DAFB]"
                              />
                            </div>
                          </div>
                          <button className="px-4 py-2 rounded-lg bg-[#00ADB5]/20 text-[#00ADB5] text-sm font-medium hover:bg-[#00ADB5]/30 transition-all">
                            Resume
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>

            {/* Recent Activity - CLICKABLE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl backdrop-blur-sm overflow-hidden"
              style={{ background: 'rgba(15, 20, 34, 0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-[#00ADB5]" />
                  <h3 className="font-bold text-white">Recent Activity</h3>
                  <span className="text-xs text-gray-500 ml-auto">Click to open</span>
                </div>
              </div>
              <div className="divide-y divide-white/10 max-h-[350px] overflow-y-auto">
                {recentActivity.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Activity size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No recent activity yet</p>
                    <p className="text-xs mt-1">Start learning to see activity here!</p>
                  </div>
                ) : (
                  recentActivity.map((activity) => (
                    <div 
                      key={activity.id} 
                      onClick={() => handleActivityClick(activity)}
                      className="p-4 hover:bg-white/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">
                            <span className="text-gray-400">{activity.action}:</span> {activity.title}
                          </p>
                          <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                            <Clock size={10} /> {activity.time}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-gray-500 group-hover:text-[#00ADB5] transition-colors" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* My Codes Section - CLICKABLE CODES */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl backdrop-blur-sm overflow-hidden"
              style={{ background: 'rgba(15, 20, 34, 0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileCode size={18} className="text-[#61DAFB]" />
                    <h3 className="font-bold text-white">My Codes</h3>
                  </div>
                  <button 
                    onClick={() => setShowAllCodesModal(true)}
                    className="text-xs text-[#61DAFB] hover:underline"
                  >
                    View All ({codes.length})
                  </button>
                </div>
              </div>
              <div className="divide-y divide-white/10 max-h-[350px] overflow-y-auto">
                {codes.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Code size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No code snippets yet</p>
                    <p className="text-xs mt-1">Save your code from the editor!</p>
                    <button onClick={() => navigate('/editor')} className="mt-3 text-[#00ADB5] text-sm hover:underline">Open Editor →</button>
                  </div>
                ) : (
                  codes.slice(0, 4).map((code) => (
                    <div 
                      key={code.id} 
                      onClick={() => handleCodeClick(code)}
                      className="p-4 hover:bg-white/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-[#61DAFB]" />
                            <p className="text-white text-sm font-medium group-hover:text-[#61DAFB] transition-colors">
                              {code.title}
                            </p>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">
                            {code.language?.toUpperCase()} • {new Date(code.createdAt).toLocaleDateString()}
                          </p>
                          <div className="mt-2 bg-black/30 rounded-lg p-2">
                            <code className="text-xs text-gray-400 font-mono">
                              {code.code?.substring(0, 60)}...
                            </code>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-500 group-hover:text-[#61DAFB] transition-colors ml-2" />
                      </div>
                    </div>
                  ))
                )}
                {codes.length > 4 && (
                  <div className="p-3 text-center border-t border-white/10">
                    <button onClick={() => setShowAllCodesModal(true)} className="text-[#61DAFB] text-xs hover:underline">
                      +{codes.length - 4} more snippets
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Achievements Card - CLICKABLE */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl backdrop-blur-sm overflow-hidden"
              style={{ background: 'rgba(15, 20, 34, 0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Trophy size={18} className="text-yellow-400" />
                  <h3 className="font-bold text-white">Achievements</h3>
                  <span className="text-xs text-gray-400 ml-auto">{achievements.length} earned</span>
                </div>
              </div>
              <div className="p-4 space-y-3 max-h-[350px] overflow-y-auto">
                {Object.entries({
                  first_code: { title: "First Code", icon: "🎯", points: 50 },
                  code_master: { title: "Code Master", icon: "👨‍💻", points: 200 },
                  streak_7: { title: "Weekly Warrior", icon: "🔥", points: 100 },
                  streak_30: { title: "Monthly Legend", icon: "⭐", points: 500 },
                  course_complete: { title: "Course Master", icon: "📚", points: 100 }
                }).map(([id, ach]) => {
                  const earned = achievements.some(a => a.achievementId === id);
                  return (
                    <div 
                      key={id} 
                      onClick={() => handleAchievementClick(id)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                        earned ? 'bg-white/5 hover:bg-white/10' : 'opacity-60 hover:opacity-80'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        earned ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : 'bg-white/5'
                      }`}>
                        {ach.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${earned ? 'text-white' : 'text-gray-400'}`}>
                          {ach.title}
                        </p>
                        <p className="text-xs text-gray-500">+{ach.points} points</p>
                      </div>
                      <Info size={16} className="text-gray-500" />
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="rounded-2xl backdrop-blur-sm overflow-hidden"
              style={{ background: 'rgba(15, 20, 34, 0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-purple-400" />
                  <h3 className="font-bold text-white">Leaderboard</h3>
                </div>
              </div>
              <div className="divide-y divide-white/10">
                {leaderboard.map((userItem) => (
                  <div key={userItem.rank} className={`p-3 flex items-center gap-3 ${userItem.current ? 'bg-[#00ADB5]/10' : ''}`}>
                    <div className="w-7 text-center">
                      <span className={`text-sm font-bold ${userItem.rank <= 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                        #{userItem.rank}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      userItem.current ? 'bg-gradient-to-r from-[#00ADB5] to-[#61DAFB]' : 'bg-white/10'
                    }`}>
                      {userItem.avatar}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${userItem.current ? 'text-[#00ADB5]' : 'text-white'}`}>
                        {userItem.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gem size={12} className="text-yellow-400" />
                      <span className="text-sm font-semibold text-white">{userItem.points.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl backdrop-blur-sm p-4"
              style={{ background: 'linear-gradient(135deg, rgba(0,173,181,0.1) 0%, rgba(97,218,251,0.05) 100%)', border: '1px solid rgba(0,173,181,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUpIcon size={16} className="text-[#00ADB5]" />
                <span className="text-sm font-medium text-white">Your Stats</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.completedCourses}</div>
                  <p className="text-xs text-gray-400">Courses Done</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalCodes}</div>
                  <p className="text-xs text-gray-400">Code Saves</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.streak}</div>
                  <p className="text-xs text-gray-400">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{languagesWithProgress.length}</div>
                  <p className="text-xs text-gray-400">Languages</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* View All Courses Modal */}
      <Modal isOpen={showAllCoursesModal} onClose={() => setShowAllCoursesModal(false)} title="All Your Courses">
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No courses enrolled yet</p>
            <button onClick={() => navigate('/courses')} className="mt-3 text-[#00ADB5] hover:underline">Browse Courses →</button>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-medium">{course.courseTitle}</h4>
                    <p className="text-gray-400 text-xs">{course.completedVideos}/{course.totalVideos} videos • {course.percentage}% complete</p>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-[#00ADB5]/20 text-[#00ADB5] text-sm hover:bg-[#00ADB5]/30 transition">Resume</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* View All Codes Modal */}
      <Modal isOpen={showAllCodesModal} onClose={() => setShowAllCodesModal(false)} title="All Your Code Snippets">
        {codes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No code snippets saved yet</p>
            <button onClick={() => navigate('/editor')} className="mt-3 text-[#00ADB5] hover:underline">Open Editor →</button>
          </div>
        ) : (
          <div className="space-y-3">
            {codes.map((code) => (
              <div 
                key={code.id} 
                onClick={() => { setShowAllCodesModal(false); handleCodeClick(code); }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <Terminal size={14} className="text-[#61DAFB]" />
                      <h4 className="text-white font-medium">{code.title}</h4>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{code.language?.toUpperCase()} • {new Date(code.createdAt).toLocaleDateString()}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Code Details Modal - FULL CODE VIEW */}
      <Modal isOpen={selectedCode !== null} onClose={() => setSelectedCode(null)} title="Code Snippet">
  {selectedCode && (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={20} className="text-[#61DAFB]" />
          <h3 className="text-xl font-bold text-white">{selectedCode.title}</h3>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 rounded-lg bg-white/10 text-xs text-gray-300">
            {selectedCode.language?.toUpperCase()}
          </span>
          <span className="px-2 py-1 rounded-lg bg-white/10 text-xs text-gray-300">
            {new Date(selectedCode.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {/* Code Display */}
      <div className="bg-black/60 rounded-xl overflow-hidden">
        <div className="bg-[#1a1a2e] px-4 py-2 border-b border-white/10 flex justify-between items-center">
          <span className="text-xs text-gray-400">Code</span>
        </div>
        <pre className="p-4 text-green-400 text-sm font-mono overflow-x-auto max-h-96">
          {selectedCode.code}
        </pre>
      </div>
      
      {/* Output if exists */}
      {selectedCode.output && (
        <div className="bg-black/40 rounded-xl overflow-hidden">
          <div className="bg-[#1a1a2e] px-4 py-2 border-b border-white/10">
            <span className="text-xs text-gray-400">Output</span>
          </div>
          <pre className="p-4 text-yellow-400 text-sm font-mono overflow-x-auto">
            {selectedCode.output}
          </pre>
        </div>
      )}
      
      {/* ✅ Sirf Copy Code Button - Open in Editor Hata Diya */}
      <div className="flex gap-3 pt-2">
        <button 
          onClick={() => {
            navigator.clipboard.writeText(selectedCode.code);
            alert("Code copied to clipboard!");
          }}
          className="w-full py-2 rounded-lg bg-white/10 text-gray-300 font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition"
        >
          <Copy size={16} /> Copy Code
        </button>
      </div>
    </div>
  )}
</Modal>

      {/* Achievement Details Modal */}
      <Modal isOpen={selectedAchievement !== null} onClose={() => setSelectedAchievement(null)} title="Achievement Details">
        {selectedAchievement && (
          <div className="text-center">
            <div className="text-6xl mb-4">{selectedAchievement.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{selectedAchievement.title}</h3>
            <p className="text-gray-400 mb-4">{selectedAchievement.description}</p>
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-[#00ADB5]">How to earn:</span><br />
                {selectedAchievement.howTo}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Award size={16} />
              <span>+{selectedAchievement.points} points</span>
            </div>
            {achievements.some(a => a.achievementId === selectedAchievement.id) && (
              <div className="mt-4 p-2 rounded-lg bg-green-500/20 text-green-400 text-sm">
                ✓ Already earned!
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;