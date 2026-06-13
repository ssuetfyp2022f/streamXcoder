// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  TrendingUp, BookOpen, Code, Award, Flame, Calendar, Clock,
  ChevronRight, Play, Save, Star, Users, Zap, Target,
  Activity, BarChart3, CircleDollarSign, Trophy, Medal,
  GitBranch, Terminal, Coffee, Heart, Sparkles, Rocket,
  MonitorPlay, FileCode, Layers, Crown, Gift, Gem,
  Loader2, CheckCircle, Brain, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import {
  getUserProfile,
  getUserCourses,
  getUserCodes,
  getUserAchievements,
  getUserLanguagesWithProgress,
  subscribeToUserData,
  subscribeToUserCourses,
  subscribeToUserCodes,
  subscribeToUserAchievements,
  updateUserStreak,
  getTotalCoursesCount,
  getCompletedCoursesCount,
  getTotalCodesCount,
  ALL_LANGUAGES
} from '../firebase/userData';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    displayName: '',
    points: 0,
    streak: 0,
    selectedLanguages: [],
    languageProgress: {}
  });
  const [courses, setCourses] = useState([]);
  const [codes, setCodes] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [languagesWithProgress, setLanguagesWithProgress] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalCodes: 0,
    totalPoints: 0,
    streak: 0
  });

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

  // Get overall progress across selected languages
  const getOverallProgress = () => {
    if (languagesWithProgress.length === 0) return 0;
    const total = languagesWithProgress.reduce((sum, lang) => sum + (lang.progress || 0), 0);
    return Math.round(total / languagesWithProgress.length);
  };

  // Get primary language (the one user is most focused on)
  const getPrimaryLanguage = () => {
    if (languagesWithProgress.length === 0) return null;
    return languagesWithProgress.reduce((best, current) =>
      (current.progress > best.progress) ? current : best
    );
  };

  // Real-time data fetching
  useEffect(() => {
    if (!user) return;

    // Update streak on dashboard load
    updateUserStreak(user.uid);

    // Subscribe to real-time user data
    const unsubscribeUser = subscribeToUserData(user.uid, (data) => {
      setUserData(data);
      setStats(prev => ({
        ...prev,
        totalPoints: data?.points || 0,
        streak: data?.streak || 0
      }));
    });

    // Subscribe to real-time courses
    const unsubscribeCourses = subscribeToUserCourses(user.uid, (coursesList) => {
      setCourses(coursesList);
      const total = coursesList.length;
      const completed = coursesList.filter(c => c.status === 'completed').length;
      setStats(prev => ({
        ...prev,
        totalCourses: total,
        completedCourses: completed
      }));
    });

    // Subscribe to real-time codes
    const unsubscribeCodes = subscribeToUserCodes(user.uid, (codesList) => {
      setCodes(codesList);
      setStats(prev => ({
        ...prev,
        totalCodes: codesList.length
      }));
    });

    // Subscribe to real-time achievements
    const unsubscribeAchievements = subscribeToUserAchievements(user.uid, (achievementsList) => {
      setAchievements(achievementsList);
    });

    // Get languages with progress
    const fetchLanguages = async () => {
      const result = await getUserLanguagesWithProgress(user.uid);
      if (result.success) {
        setLanguagesWithProgress(result.data);
      }
    };
    fetchLanguages();

    setLoading(false);

    return () => {
      unsubscribeUser();
      unsubscribeCourses();
      unsubscribeCodes();
      unsubscribeAchievements();
    };
  }, [user]);

  // Filter courses by language
  const getCoursesByLanguage = (languageId) => {
    return courses.filter(c => c.language === languageId);
  };

  // Sample recommended courses based on selected languages
  const getRecommendedCourses = () => {
    if (languagesWithProgress.length === 0) {
      return [
        { id: 'getting_started', title: 'Getting Started with Coding', language: 'html', progress: 0, duration: '2h', level: 'Beginner' }
      ];
    }

    const recommendations = [];
    languagesWithProgress.forEach(lang => {
      const langCourses = getCoursesByLanguage(lang.id);
      const inProgress = langCourses.find(c => c.status === 'in_progress');
      if (inProgress) {
        recommendations.push({
          id: inProgress.courseId,
          title: inProgress.courseTitle,
          language: lang.id,
          progress: inProgress.percentage,
          duration: '4h',
          level: lang.level
        });
      }
    });

    return recommendations.slice(0, 3);
  };

  const recommendedCourses = getRecommendedCourses();

  // Recent activity from actual data
  const recentActivity = [
    ...courses.slice(0, 2).map(course => ({
      id: course.id,
      type: 'course',
      title: `Watched: ${course.courseTitle}`,
      time: course.lastWatched ? new Date(course.lastWatched).toLocaleDateString() : 'Recently',
      icon: '📘'
    })),
    ...codes.slice(0, 2).map(code => ({
      id: code.id,
      type: 'code',
      title: `Saved: ${code.title}`,
      time: code.createdAt ? new Date(code.createdAt).toLocaleDateString() : 'Recently',
      icon: '💻'
    }))
  ];

  // Leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Alex Coder', points: 5840, avatar: 'A' },
    { rank: 2, name: 'Sarah Dev', points: 4920, avatar: 'S' },
    { rank: 3, name: 'Mike Tech', points: 3850, avatar: 'M' },
    { rank: 4, name: getUserName(), points: stats.totalPoints, avatar: getUserFirstLetter(), current: true }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };


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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00ADB5] to-[#61DAFB] flex items-center justify-center shadow-lg shadow-[#00ADB5]/20">
                  <span className="text-white font-bold text-2xl">{getUserFirstLetter()}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Welcome back, <span className="bg-gradient-to-r from-[#00ADB5] to-[#61DAFB] bg-clip-text text-transparent">
                      {getUserName()}
                    </span>
                  </h1>
                  <p className="text-gray-400 mt-1">
                    {languagesWithProgress.length === 0
                      ? "Select a language to start your coding journey!"
                      : `Learning ${languagesWithProgress.map(l => l.name).join(' & ')}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00ADB5] to-[#61DAFB] text-white font-semibold flex items-center gap-2 shadow-lg shadow-[#00ADB5]/20"
              >
                <Play size={18} />
                Continue Learning
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                <Save size={18} />
                My Codes ({stats.totalCodes})
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {[
            { icon: <BookOpen className="text-[#00ADB5]" />, label: 'Total Courses', value: stats.totalCourses, bg: 'from-cyan-500/10 to-blue-500/10' },
            { icon: <Award className="text-yellow-400" />, label: 'Points Earned', value: stats.totalPoints.toLocaleString(), bg: 'from-yellow-500/10 to-orange-500/10' },
            { icon: <Flame className="text-orange-500" />, label: 'Day Streak', value: `${stats.streak} days`, bg: 'from-orange-500/10 to-red-500/10' },
            { icon: <Code className="text-purple-400" />, label: 'Code Snippets', value: stats.totalCodes, bg: 'from-purple-500/10 to-pink-500/10' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
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
        </motion.div>

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
                  {languagesWithProgress.length < 2 && (
                    <button className="text-xs text-[#00ADB5] hover:underline">
                      + Add Language
                    </button>
                  )}
                </div>

                {languagesWithProgress.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">You haven't selected any language yet!</p>
                    <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#00ADB5] to-[#61DAFB] text-white font-medium">
                      Select Your First Language
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Overall Progress */}
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

                    {/* Individual Language Progress */}
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
                  <button className="text-[#00ADB5] text-sm hover:underline flex items-center gap-1">
                    View All <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-white/10">
                {recommendedCourses.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No courses in progress</p>
                    <button className="mt-3 text-[#00ADB5] text-sm">Browse Courses →</button>
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
                              <span className={`text-xs px-2 py-0.5 rounded-full ${course.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                  course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                {course.level}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                              <span className="flex items-center gap-1">
                                <Clock size={12} /> {course.duration}
                              </span>
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

            {/* Recent Activity & Code Snippets */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
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
                  </div>
                </div>
                <div className="divide-y divide-white/10 max-h-[300px] overflow-y-auto">
                  {recentActivity.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <Activity size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No recent activity yet</p>
                      <p className="text-xs mt-1">Start learning to see activity here!</p>
                    </div>
                  ) : (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{activity.title}</p>
                            <p className="text-gray-400 text-xs">{activity.time}</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-500" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Recent Code Snippets */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-2xl backdrop-blur-sm overflow-hidden"
                style={{ background: 'rgba(15, 20, 34, 0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileCode size={18} className="text-[#61DAFB]" />
                      <h3 className="font-bold text-white">Recent Codes</h3>
                    </div>
                    <button className="text-xs text-[#61DAFB] hover:underline">View All</button>
                  </div>
                </div>
                <div className="divide-y divide-white/10 max-h-[300px] overflow-y-auto">
                  {codes.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <Code size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No code snippets yet</p>
                      <p className="text-xs mt-1">Save your code from the editor!</p>
                    </div>
                  ) : (
                    codes.slice(0, 4).map((code) => (
                      <div key={code.id} className="p-4 hover:bg-white/5 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Terminal size={14} className="text-[#61DAFB]" />
                              <p className="text-white text-sm font-medium">{code.title}</p>
                            </div>
                            <p className="text-gray-400 text-xs mt-1">
                              {code.language?.toUpperCase()} • {new Date(code.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <ChevronRight size={14} className="text-gray-500" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Achievements Card */}
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
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {Object.entries({
                  first_code: { title: "First Code", icon: "🎯", points: 50 },
                  code_master: { title: "Code Master", icon: "👨‍💻", points: 200 },
                  streak_7: { title: "Weekly Warrior", icon: "🔥", points: 100 },
                  streak_30: { title: "Monthly Legend", icon: "⭐", points: 500 },
                  course_complete: { title: "Course Master", icon: "📚", points: 100 }
                }).map(([id, ach]) => {
                  const earned = achievements.some(a => a.achievementId === id);
                  return (
                    <div key={id} className={`flex items-center gap-3 p-2 rounded-xl transition-all ${earned ? 'bg-white/5' : 'opacity-50'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${earned ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : 'bg-white/5'}`}>
                        {ach.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${earned ? 'text-white' : 'text-gray-400'}`}>
                          {ach.title}
                        </p>
                        <p className="text-xs text-gray-500">+{ach.points} points</p>
                      </div>
                      {earned && (
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle size={14} className="text-green-400" />
                        </div>
                      )}
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${userItem.current ? 'bg-gradient-to-r from-[#00ADB5] to-[#61DAFB]' : 'bg-white/10'
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
              <div className="mt-3 pt-3 border-t border-white/10 text-center">
                <p className="text-xs text-gray-400">
                  <Coffee size={10} className="inline mr-1" />
                  Keep learning to master {languagesWithProgress.length === 0 ? 'a language' : 'your skills'}!
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 pt-6 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">© 2026 StreamXCode</span>
              <div className="flex gap-3">
                <a href="#" className="text-gray-500 hover:text-[#00ADB5] text-xs transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-[#00ADB5] text-xs transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-[#00ADB5] text-xs transition-colors">Cookie Policy</a>
                <a href="#" className="text-gray-500 hover:text-[#00ADB5] text-xs transition-colors">Contact</a>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
                <span className="text-gray-400 text-xs">SSL Secured</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-sm">★★★★★</span>
                <span className="text-gray-400 text-xs">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={12} className="text-red-400" />
                <span className="text-gray-400 text-xs">24/7 Support</span>
              </div>
            </div>
          </div>
        </motion.div> */}
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#00ADB5] animate-spin mx-auto mb-4" />
            <p className="text-gray-200">Loading Dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;