// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  User, 
  Eye, 
  Code,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Star,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import VideoCard from '../components/VideoCard';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: Code },
    { id: 'react', name: 'React', icon: TrendingUp },
    { id: 'javascript', name: 'JavaScript', icon: Zap },
    { id: 'python', name: 'Python', icon: Sparkles },
    { id: 'webdev', name: 'Web Dev', icon: Code }
  ];

  // Mock video data
  const videos = [
    {
      id: 1,
      title: "Learn React in 60 Minutes",
      description: "Complete React tutorial for beginners with hands-on coding exercises.",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop&crop=center",
      duration: "10:30",
      author: "StreamXCoder",
      views: "1.2K",
      category: "React",
      level: "Beginner",
      rating: 4.8
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      description: "Master JavaScript basics with interactive examples.",
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop",
      duration: "15:45",
      author: "CodeMaster",
      views: "2.4K",
      category: "JavaScript",
      level: "Beginner",
      rating: 4.5
    },
    {
      id: 3,
      title: "Tailwind CSS Crash Course",
      description: "Learn Tailwind CSS utilities and build modern UIs.",
      thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=225&fit=crop",
      duration: "12:20",
      author: "UI Expert",
      views: "3.1K",
      category: "CSS",
      level: "Intermediate",
      rating: 4.7
    },
    {
      id: 4,
      title: "Python for Data Science",
      description: "Start your data science journey with Python basics.",
      thumbnail: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec8?w=400&h=225&fit=crop",
      duration: "18:30",
      author: "DataWizard",
      views: "5.6K",
      category: "Python",
      level: "Intermediate",
      rating: 4.9
    },
    {
      id: 5,
      title: "Full Stack Development",
      description: "Build complete web applications from scratch.",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
      duration: "25:15",
      author: "FullStackPro",
      views: "8.3K",
      category: "Web Dev",
      level: "Advanced",
      rating: 4.6
    },
    {
      id: 6,
      title: "Node.js Backend Mastery",
      description: "Learn to build scalable backend services.",
      thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=225&fit=crop",
      duration: "20:45",
      author: "BackendDev",
      views: "4.2K",
      category: "Node.js",
      level: "Intermediate",
      rating: 4.8
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE7' }}>
      
      {/* Hero Section with Animations */}
      <section className="relative overflow-hidden py-20">
        {/* Background Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 opacity-5"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Code size={128} color="#213555" />
        </motion.div>

        <motion.div 
          className="absolute bottom-20 right-10 w-24 h-24 opacity-5"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Play size={96} color="#3E5879" />
        </motion.div>

        {/* Floating Elements */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: 40 + i * 20,
              height: 40 + i * 20,
              backgroundColor: i % 2 === 0 ? '#213555' : '#D8C4B6',
              top: `${20 + i * 25}%`,
              right: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 15 - 7.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 10,
                delay: 0.2 
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ 
                backgroundColor: 'rgba(33, 53, 85, 0.1)',
                color: '#213555'
              }}
            >
              <Sparkles size={16} />
              <span className="text-sm font-medium">Learn to Code with Videos</span>
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ color: '#213555' }}
            >
              Code Along With{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Videos</span>
                <motion.span
                  className="absolute bottom-2 left-0 w-full h-3 opacity-30"
                  style={{ backgroundColor: '#D8C4B6' }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Watch coding tutorials and practice in real-time with our integrated code editor. 
              Perfect for beginners and advanced developers alike.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tutorials, technologies, or concepts..."
                  className="w-full px-6 py-4 pl-12 rounded-xl border focus:outline-none focus:ring-2 shadow-lg"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D8C4B6',
                    color: '#000000'
                  }}
                />
                <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-2 px-6 py-2 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: '#213555',
                    color: '#FFFFFF'
                  }}
                >
                  Search
                </motion.button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: '#213555',
                  color: '#FFFFFF'
                }}
              >
                <Play size={20} />
                <span>Start Learning Free</span>
                <ArrowRight size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 border"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderColor: '#213555',
                  color: '#213555'
                }}
              >
                <Code size={20} />
                <span>Explore Code Editor</span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {[
                { icon: Users, value: '10K+', label: 'Active Learners' },
                { icon: Play, value: '500+', label: 'Video Tutorials' },
                { icon: Star, value: '4.8', label: 'Average Rating' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.1, type: "spring" }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: 'rgba(33, 53, 85, 0.1)' }}
                  >
                    <stat.icon size={24} style={{ color: '#213555' }} />
                  </div>
                  <div className="text-2xl font-bold" style={{ color: '#213555' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center mb-8"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  activeFilter === category.id 
                    ? 'text-white' 
                    : 'text-gray-700'
                }`}
                style={{ 
                  backgroundColor: activeFilter === category.id ? '#213555' : '#FFFFFF',
                  border: activeFilter === category.id ? 'none' : '1px solid #D8C4B6'
                }}
              >
                <category.icon size={16} />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#213555' }}>
                Featured Tutorials
              </h2>
              <p className="text-gray-600">
                Hand-picked videos to start your coding journey
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 font-medium"
              style={{ color: '#213555' }}
            >
              <span>View All</span>
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>

          {/* Video Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                variants={itemVariants}
                custom={index}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center rounded-2xl p-12"
            style={{ 
              backgroundColor: '#213555',
              backgroundImage: 'linear-gradient(135deg, #213555 0%, #3E5879 100%)'
            }}
          >
            <motion.div
              variants={floatVariants}
              animate="animate"
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Code className="text-white" size={32} />
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Coding?
            </h2>
            
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already learning and building projects with our platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg font-medium"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  color: '#213555'
                }}
              >
                Get Started Free
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg font-medium border"
                style={{ 
                  borderColor: '#FFFFFF',
                  color: '#FFFFFF'
                }}
              >
                View Pricing
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;