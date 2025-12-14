// src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  ArrowRight,
  Sparkles,
  Code,
  CheckCircle,
  Shield,
  Rocket
} from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    // TODO: Firebase registration
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: '#F5EFE7' }}>
      
      {/* Background Animated Elements */}
      <motion.div 
        className="absolute top-10 right-10 w-24 h-24 opacity-5"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Shield size={96} color="#213555" />
      </motion.div>

      <motion.div 
        className="absolute bottom-32 left-20 w-20 h-20 opacity-5"
        animate={{ 
          rotate: -360,
          y: [0, -20, 0]
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Rocket size={80} color="#3E5879" />
      </motion.div>

      {/* Floating Checkmarks */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + i * 20}%`,
            left: `${10 + i * 25}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          <CheckCircle size={24} color="#D8C4B6" />
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.2 
            }}
            className="flex justify-center mb-4"
          >
            <div 
              className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{ 
                backgroundColor: '#213555',
                backgroundImage: 'linear-gradient(135deg, #213555 0%, #3E5879 100%)'
              }}
            >
              <UserPlus className="text-white" size={36} />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Sparkles className="text-yellow-400" size={20} />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-2"
            style={{ color: '#213555' }}
          >
            Join StreamXCoder
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            Start your coding journey with video tutorials
          </motion.p>
        </div>

        {/* Signup Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium mb-2" style={{ color: '#213555' }}>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Full Name</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-10 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: '#F5EFE7',
                    borderColor: '#D8C4B6',
                    color: '#000000'
                  }}
                  placeholder="John Doe"
                />
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <label className="block text-sm font-medium mb-2" style={{ color: '#213555' }}>
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
                    backgroundColor: '#F5EFE7',
                    borderColor: '#D8C4B6',
                    color: '#000000'
                  }}
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium mb-2" style={{ color: '#213555' }}>
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
                    backgroundColor: '#F5EFE7',
                    borderColor: '#D8C4B6',
                    color: '#000000'
                  }}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              <label className="block text-sm font-medium mb-2" style={{ color: '#213555' }}>
                <div className="flex items-center gap-2">
                  <Shield size={16} />
                  <span>Confirm Password</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: '#F5EFE7',
                    borderColor: '#D8C4B6',
                    color: '#000000'
                  }}
                  placeholder="••••••••"
                />
                <Shield className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Password Requirements */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <h4 className="text-sm font-medium mb-2" style={{ color: '#213555' }}>
                Password Requirements:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {['At least 8 characters', 'One uppercase letter', 'One number', 'One special character'].map((req, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle size={12} className="text-green-500" />
                    {req}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-start space-x-2"
            >
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 rounded"
                style={{ 
                  backgroundColor: '#F5EFE7',
                  borderColor: '#D8C4B6'
                }}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="font-medium hover:underline" style={{ color: '#213555' }}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium hover:underline" style={{ color: '#213555' }}>
                  Privacy Policy
                </a>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
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
                  backgroundImage: 'linear-gradient(135deg, #213555 0%, #3E5879 100%)',
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
                    <UserPlus size={20} />
                    <span>Create Account</span>
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

          {/* Login Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center mt-6 pt-6 border-t"
            style={{ borderColor: '#D8C4B6' }}
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium hover:underline transition-all"
                style={{ color: '#213555' }}
              >
                <motion.span
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center gap-1"
                >
                  Sign in here
                  <ArrowRight size={16} />
                </motion.span>
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center"
        >
          <h3 className="text-sm font-medium mb-3" style={{ color: '#213555' }}>
            Join 10,000+ developers who are already learning
          </h3>
          <div className="flex justify-center items-center space-x-6">
            {[
              { value: '500+', label: 'Video Tutorials' },
              { value: '50+', label: 'Projects' },
              { value: '24/7', label: 'Support' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3 + idx * 0.1, type: "spring" }}
                className="text-center"
              >
                <div className="text-xl font-bold" style={{ color: '#213555' }}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
