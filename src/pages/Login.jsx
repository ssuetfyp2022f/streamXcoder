import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Github,
  Chrome,
  ArrowRight,
  Sparkles,
  Code,
  Video,
  Palette,
  Zap
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen px-4 pt-10 pb-20 relative overflow-hidden" style={{ backgroundColor: '#EEEEEE' }}>
      
      {/* Background Animated Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Code size={80} color="#393E46" />
      </motion.div>

      <motion.div 
        className="absolute bottom-20 right-10 w-16 h-16 opacity-10"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <Video size={64} color="#393E46" />
      </motion.div>

      <motion.div 
        className="absolute top-1/3 right-1/4 w-12 h-12 opacity-10"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Palette size={48} color="#00ADB5" />
      </motion.div>

      {/* Main Content - Always from top */}
      <div className="relative z-10 max-w-md w-full mx-auto pt-12">
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.2 
            }}
            className="flex justify-center mb-6"
          >
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{ backgroundColor: '#00ADB5' }}
            >
              <Code className="text-white" size={36} />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="text-white" size={20} />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-2"
            style={{ color: '#393E46' }}
          >
            Welcome Back!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ color: '#222831' }}
            className="opacity-80"
          >
            Sign in to continue coding with videos
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium mb-2" style={{ color: '#393E46' }}>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>Email Address</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-10 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: '#EEEEEE',
                    borderColor: '#00ADB5',
                    color: '#222831'
                  }}
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-3 top-3.5" size={18} style={{ color: '#00ADB5' }} />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium mb-2" style={{ color: '#393E46' }}>
                <div className="flex items-center gap-2">
                  <Lock size={16} />
                  <span>Password</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: '#EEEEEE',
                    borderColor: '#00ADB5',
                    color: '#222831'
                  }}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3.5" size={18} style={{ color: '#00ADB5' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5"
                  style={{ color: '#00ADB5' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm hover:underline" style={{ color: '#00ADB5' }}>
                  Forgot password?
                </a>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-300"
                style={{ 
                  backgroundColor: '#00ADB5',
                  color: '#FFFFFF'
                }}
              >
                {loading ? (
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Sign In</span>
                    <motion.div
                      className="absolute -right-8"
                      animate={{ x: isHovered ? -30 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight size={20} />
                    </motion.div>
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#00ADB5' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2" style={{ backgroundColor: '#FFFFFF', color: '#393E46' }}>
                Or continue with
              </span>
            </div>
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => console.log('Google login')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border hover:shadow-md transition-all duration-300"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderColor: '#00ADB5',
                color: '#222831'
              }}
            >
              <Chrome size={20} style={{ color: '#00ADB5' }} />
              <span>Google</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => console.log('GitHub login')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border hover:shadow-md transition-all duration-300"
              style={{ 
                backgroundColor: '#222831',
                borderColor: '#222831',
                color: '#FFFFFF'
              }}
            >
              <Github size={20} />
              <span>GitHub</span>
            </motion.button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center mt-6 pt-6 border-t"
            style={{ borderColor: '#00ADB5' }}
          >
            <p style={{ color: '#393E46' }}>
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-medium hover:underline transition-all"
                style={{ color: '#00ADB5' }}
              >
                <motion.span
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center gap-1"
                >
                  Sign up now
                  <ArrowRight size={16} />
                </motion.span>
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Features Highlight */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { icon: Video, text: 'Video Tutorials', color: '#00ADB5' },
            { icon: Code, text: 'Live Coding', color: '#393E46' },
            { icon: Zap, text: 'Real-time Practice', color: '#222831' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="p-3 rounded-lg"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <feature.icon size={20} style={{ color: feature.color }} className="mx-auto mb-2" />
              <span className="text-xs font-medium" style={{ color: feature.color }}>
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;