import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Fingerprint,
  Zap,
  Code,
  Sparkles,
  AlertCircle,
  Chrome,
  Github,
  Terminal,
  ArrowRight,
  Shield,
  Brain,
  Rocket
} from 'lucide-react';
import { form } from 'framer-motion/client';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, githubLogin, resetPassword, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [resetEmail, setResetEmail] = useState('');

  const handleChange = (e) => {
    clearError();
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      sessionStorage.setItem('justLoggedIn', 'true'); 
      navigate('/dashboard');
    } catch (err) {
      // Error is already handled by AuthContext
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      sessionStorage.setItem('justLoggedIn', 'true');
      navigate('/dashboard');
    } catch (err) {
      // Error is already handled by AuthContext
    }
  };
  
  const handleGithubLogin = async () => {
  await githubLogin();
  navigate('/dashboard');
};

  const handleForgotPassword = () => {
    setActiveTab('forgot');
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      alert('Please enter your email address');
      return;
    }

    try {
      await resetPassword(resetEmail);
      alert('Password reset link sent to your email!');
      setActiveTab('login');
      setResetEmail('');
    } catch (err) {
      // Error is already handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0A0F1C' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{ 
              backgroundColor: i % 2 === 0 ? '#00ADB5' : '#61DAFB',
              width: 100 + i * 40,
              height: 100 + i * 40,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
                  style={{ 
                    background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                    boxShadow: '0 20px 60px rgba(0, 173, 181, 0.4)'
                  }}
                >
                  <Code className="text-white" size={40} />
                </motion.div>
                
                <h1 className="text-5xl font-bold mb-4 text-white">
                  Welcome Back to <br />
                  <span className="bg-gradient-to-r from-[#00ADB5] via-[#61DAFB] to-[#00ADB5] bg-clip-text text-transparent">
                    StreamXCoder
                  </span>
                </h1>
                <p className="text-gray-400 text-lg">
                  Continue your coding journey with interactive tutorials and real-time practice.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                {[
                  {
                    icon: <Terminal className="text-[#00ADB5]" size={20} />,
                    text: 'Access 500+ coding tutorials'
                  },
                  {
                    icon: <Brain className="text-[#FFD700]" size={20} />,
                    text: 'Track your learning progress'
                  },
                  {
                    icon: <Rocket className="text-[#FF6B35]" size={20} />,
                    text: 'Join live coding sessions'
                  },
                  {
                    icon: <Shield className="text-[#10B981]" size={20} />,
                    text: 'Secure & private learning environment'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      {feature.icon}
                    </div>
                    <span className="text-gray-300">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 rounded-2xl backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'rgba(57, 62, 70, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: '50K+', label: 'Developers' },
                    { value: '95%', label: 'Success Rate' },
                    { value: '24/7', label: 'Support' },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold mb-1 text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="backdrop-blur-xl rounded-3xl p-8"
              style={{ 
                backgroundColor: 'rgba(57, 62, 70, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Tabs */}
              <div className="flex border-b border-white/10 mb-8">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-4 font-bold text-lg relative ${
                    activeTab === 'login' ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Fingerprint size={20} />
                    Login
                  </span>
                  {activeTab === 'login' && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: '#00ADB5' }}
                    />
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('forgot')}
                  className={`flex-1 py-4 font-bold text-lg relative ${
                    activeTab === 'forgot' ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Shield size={20} />
                    Reset Password
                  </span>
                  {activeTab === 'forgot' && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: '#00ADB5' }}
                    />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl flex items-center gap-3"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                >
                  <AlertCircle className="text-red-400" size={20} />
                  <span className="text-red-300 text-sm">{error}</span>
                </motion.div>
              )}

              {/* Login Form */}
              <AnimatePresence mode="wait">
                {activeTab === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <form onSubmit={handleSubmit}>
                      <div>
                        <label className="block text-sm font-medium mb-3 text-gray-300">
                          <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>Email Address</span>
                          </div>
                        </label>
                        <div className="relative group">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300"
                            placeholder="developer@example.com"
                          />
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]" size={18} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-3 text-gray-300">
                          <div className="flex items-center gap-2">
                            <Lock size={16} />
                            <span>Password</span>
                          </div>
                        </label>
                        <div className="relative group">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 pl-12 pr-12 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300"
                            placeholder="Enter your password"
                          />
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]" size={18} />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="w-4 h-4 rounded bg-white/5 border-white/10 text-[#00ADB5] focus:ring-[#00ADB5]"
                          />
                          <span className="text-sm text-gray-300">Remember me</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm text-[#00ADB5] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={loading}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 relative overflow-hidden group mt-6"
                        style={{ 
                          background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                          color: '#FFFFFF'
                        }}
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <LogIn size={20} />
                            <span>Sign In to Your Account</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                        <motion.div
                          className="absolute inset-0"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                          initial={{ x: '-100%' }}
                          animate={{ x: isHovered ? 0 : '-100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 text-sm text-gray-400" style={{ backgroundColor: 'rgba(57, 62, 70, 0.6)' }}>
                          Or continue with
                        </span>
                      </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        onClick={handleGoogleLogin}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-white/10 hover:border-white/30 text-white transition-all"
                      >
                        <Chrome size={20} />
                        <span>Google</span>
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={handleGithubLogin}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF'
                        }}
                      >
                        <Github size={20} />
                        <span>GitHub</span>
                      </motion.button>
                    </div>

                    {/* Signup Link */}
                    <div className="text-center mt-8 pt-6 border-t border-white/10">
                      <p className="text-gray-400">
                        New to StreamXCoder?{' '}
                        <Link to="/signup" className="text-[#00ADB5] font-bold hover:underline">
                          Create an account
                        </Link>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  /* Forgot Password Form */
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ 
                          backgroundColor: 'rgba(0, 173, 181, 0.1)',
                          border: '2px solid rgba(0, 173, 181, 0.3)'
                        }}
                      >
                        <Shield className="text-[#00ADB5]" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-white">Reset Your Password</h3>
                      <p className="text-gray-400">
                        Enter your email address and we'll send you a reset link
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-300">
                        Email Address
                      </label>
                      <div className="relative group">
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300"
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]" size={18} />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        type="button"
                        onClick={() => {
                          setActiveTab('login');
                          setResetEmail('');
                          clearError();
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 rounded-xl font-medium border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all"
                      >
                        Back to Login
                      </motion.button>
                      
                      <motion.button
                        type="button"
                        onClick={handleResetPassword}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 relative overflow-hidden group"
                        style={{ 
                          background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                          color: '#FFFFFF'
                        }}
                      >
                        <Zap size={20} />
                        <span>Send Reset Link</span>
                      </motion.button>
                    </div>

                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                      <p className="text-sm text-gray-400 text-center">
                        Check your spam folder if you don't receive an email within a few minutes.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/signup')}
            className="px-6 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2"
            style={{ 
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)',
              color: '#FFFFFF'
            }}
          >
            <Sparkles size={20} />
            <span>Start Free Trial</span>
            <Rocket size={16} />
          </motion.button>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl blur-xl opacity-50 -z-10"
            style={{ backgroundColor: '#FF6B35' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;