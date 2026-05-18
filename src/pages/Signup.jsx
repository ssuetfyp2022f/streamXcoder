import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Signup.js - Add this import at the top (after other imports):
import { useAuth } from '../context/AuthContext';
import { 
  Rocket, 
  Sparkles, 
  Code,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Shield,
  Terminal,
  Zap,
  Globe,
  Star,
  AlertCircle,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

const useMockAuth = () => {  // ✅ Different name!
  return {
    user: null,
    loading: false,
    error: '',
    signup: async (email, password, displayName) => {
      console.log('Signing up:', email, displayName);
      return new Promise(resolve => {
        setTimeout(() => {
          alert(`Account created for ${email}! Redirecting to dashboard...`);
          resolve({ user: { uid: 'mock-user', email, displayName } });
        }, 2000);
      });
    },
    loginWithGoogle: async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          alert('Google login successful! Redirecting to dashboard...');
          resolve({ user: { uid: 'google-user', email: 'user@gmail.com', displayName: 'Google User' } });
        }, 2000);
      });
    },
    clearError: () => {}
  };
};
const Signup = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formStep, setFormStep] = useState(1);
  const [selectedTechs, setSelectedTechs] = useState([]);

  // Calculate password strength
  useEffect(() => {
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return (score / 4) * 100;
  };

  const handleChange = (e) => {
    clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    await signup(formData.email, formData.password, formData.displayName, selectedTechs);
    navigate('/login');
  } catch (err) {
    // Error is already handled by AuthContext
    console.error('Signup error:', err);
  }
};

  const handleGoogleSignup = async () => {
  try {
    await loginWithGoogle();
    navigate('/dashboard');
  } catch (err) {
    console.error('Google signup error:', err);
  }
};  
  const technologies = [
    { id: 'react', name: 'React', color: '#61DAFB', icon: '⚛️' },
    { id: 'js', name: 'JavaScript', color: '#F7DF1E', icon: '🟡' },
    { id: 'python', name: 'Python', color: '#3776AB', icon: '🐍' },
    { id: 'node', name: 'Node.js', color: '#8CC84B', icon: '🟢' },
    { id: 'vue', name: 'Vue.js', color: '#4FC08D', icon: '🟩' },
    { id: 'flutter', name: 'Flutter', color: '#02569B', icon: '📱' },
  ];

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

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0A0F1C' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 10% 20%, rgba(0, 173, 181, 0.2) 0%, transparent 50%),
                             radial-gradient(circle at 90% 80%, rgba(57, 62, 70, 0.2) 0%, transparent 50%)`
          }}
        />
        
        {/* Floating Code Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-10"
            style={{
              top: `${10 + i * 10}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Code size={24} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ 
              background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
              boxShadow: '0 20px 60px rgba(0, 173, 181, 0.4)'
            }}
          >
            <Rocket className="text-white" size={40} />
          </motion.div>
          
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-[#00ADB5] via-[#61DAFB] to-[#00ADB5] bg-clip-text text-transparent">
            Start Your Coding Journey
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of developers learning through interactive video tutorials and real-time coding.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="backdrop-blur-xl rounded-3xl p-8"
              style={{ 
                backgroundColor: 'rgba(57, 62, 70, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-10 relative">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        formStep >= step ? 'scale-110' : ''
                      }`}
                        style={{ 
                          backgroundColor: formStep >= step ? '#00ADB5' : 'rgba(255, 255, 255, 0.1)',
                          border: formStep >= step ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        {formStep > step ? (
                          <Check className="text-white" size={20} />
                        ) : (
                          <span className={`font-bold ${formStep >= step ? 'text-white' : 'text-gray-400'}`}>
                            {step}
                          </span>
                        )}
                      </div>
                      <span className={`text-sm ${formStep >= step ? 'text-white' : 'text-gray-400'}`}>
                        {step === 1 ? 'Account' : step === 2 ? 'Profile' : 'Complete'}
                      </span>
                    </div>
                    {step < 3 && (
                      <div className="flex-1 h-0.5 mx-4 relative -top-6"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        <motion.div 
                          className="h-full rounded-full"
                          style={{ backgroundColor: '#00ADB5' }}
                          initial={{ width: 0 }}
                          animate={{ width: formStep >= 2 ? '100%' : formStep === 1 ? '50%' : '0%' }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
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

              <form onSubmit={handleSubmit}>
                {/* Step 1: Account Info */}
                <AnimatePresence mode="wait">
                  {formStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-3 text-gray-300">
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>Full Name</span>
                          </div>
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300"
                            placeholder="Enter your full name"
                          />
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]" size={18} />
                        </div>
                      </div>

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
                            placeholder="you@example.com"
                          />
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]" size={18} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-3 text-gray-300">
                          <div className="flex items-center gap-2">
                            <Lock size={16} />
                            <span>Password</span>
                            <span className="text-xs text-gray-400 ml-auto">
                              {passwordStrength === 100 ? 'Strong 🔒' : 
                               passwordStrength >= 75 ? 'Good 🔑' : 
                               passwordStrength >= 50 ? 'Fair ⚠️' : 'Weak ❌'}
                            </span>
                          </div>
                        </label>
                        <div className="relative group mb-2">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 pl-12 pr-12 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300"
                            placeholder="Create a strong password"
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
                        
                        {/* Password Strength Meter */}
                        <div className="h-2 rounded-full overflow-hidden bg-white/5">
                          <motion.div 
                            className="h-full rounded-full"
                            style={{ backgroundColor: passwordStrength === 100 ? '#10B981' : passwordStrength >= 75 ? '#3B82F6' : passwordStrength >= 50 ? '#F59E0B' : '#EF4444' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      <motion.button
                        type="button"
                        onClick={() => setFormStep(2)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 relative overflow-hidden group"
                        style={{ 
                          background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                          color: '#FFFFFF'
                        }}
                      >
                        <span className="relative z-10">Continue to Profile</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 2: Tech Interests */}
                <AnimatePresence mode="wait">
                  {formStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                          <Terminal size={20} />
                          What technologies interest you?
                        </h3>
                        <p className="text-gray-400 mb-6">Select your areas of interest (optional)</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {technologies.map((tech) => (
                            <motion.button
                              key={tech.id}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                if (selectedTechs.includes(tech.id)) {
                                  setSelectedTechs(selectedTechs.filter(t => t !== tech.id));
                                } else {
                                  setSelectedTechs([...selectedTechs, tech.id]);
                                }
                              }}
                              className={`p-4 rounded-xl flex items-center gap-3 transition-all ${
                                selectedTechs.includes(tech.id)
                                  ? 'border-2 scale-105'
                                  : 'border border-white/10 hover:border-white/30'
                              }`}
                              style={{ 
                                backgroundColor: selectedTechs.includes(tech.id) ? `${tech.color}20` : 'rgba(255, 255, 255, 0.05)',
                                borderColor: selectedTechs.includes(tech.id) ? tech.color : ''
                              }}
                            >
                              <span className="text-2xl">{tech.icon}</span>
                              <span className={`font-medium ${selectedTechs.includes(tech.id) ? 'text-white' : 'text-gray-300'}`}>
                                {tech.name}
                              </span>
                              {selectedTechs.includes(tech.id) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-auto"
                                >
                                  <Check size={16} style={{ color: tech.color }} />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <motion.button
                          type="button"
                          onClick={() => setFormStep(1)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-3 rounded-xl font-medium border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all"
                        >
                          Back
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setFormStep(3)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 relative overflow-hidden group"
                          style={{ 
                            background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                            color: '#FFFFFF'
                          }}
                        >
                          <span className="relative z-10">Continue</span>
                          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 3: Final Step */}
                <AnimatePresence mode="wait">
                  {formStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                          style={{ 
                            backgroundColor: 'rgba(0, 173, 181, 0.1)',
                            border: '2px solid rgba(0, 173, 181, 0.3)'
                          }}
                        >
                          <Shield size={32} style={{ color: '#00ADB5' }} />
                        </motion.div>
                        
                        <h3 className="text-2xl font-bold mb-4 text-white">Almost There!</h3>
                        <p className="text-gray-400 mb-8">
                          Confirm your password and agree to our terms to complete your registration.
                        </p>

                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium mb-3 text-gray-300">
                              Confirm Password
                            </label>
                            <div className="relative group">
                              <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300"
                                placeholder="Re-enter your password"
                              />
                              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]" size={18} />
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 rounded-xl"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                          >
                            <input
                              type="checkbox"
                              id="terms"
                              required
                              className="mt-1 rounded"
                              style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderColor: 'rgba(255, 255, 255, 0.3)'
                              }}
                            />
                            <label htmlFor="terms" className="text-sm text-gray-300">
                              I agree to the{' '}
                              <a href="#" className="text-[#00ADB5] hover:underline">Terms of Service</a>{' '}
                              and{' '}
                              <a href="#" className="text-[#00ADB5] hover:underline">Privacy Policy</a>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <motion.button
                          type="button"
                          onClick={() => setFormStep(2)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-3 rounded-xl font-medium border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all"
                        >
                          Back
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 relative overflow-hidden group"
                          style={{ 
                            background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                            color: '#FFFFFF'
                          }}
                        >
                          {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Rocket size={20} />
                              <span>Launch Your Journey</span>
                              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-gray-400" style={{ backgroundColor: 'rgba(57, 62, 70, 0.6)' }}>
                    Or sign up with
                  </span>
                </div>
              </div>

              {/* Social Signup */}
              <motion.button
                type="button"
                onClick={handleGoogleSignup}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-3 border border-white/10 hover:border-white/30 text-white transition-all"
              >
                <Globe size={20} />
                <span>Continue with Google</span>
              </motion.button>

              {/* Login Link */}
              <div className="text-center mt-8 pt-6 border-t border-white/10">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#00ADB5] font-medium hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </motion.div>

            {/* Benefits Sidebar */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {[
                {
                  icon: <Terminal className="text-[#00ADB5]" size={24} />,
                  title: 'Live Code Editor',
                  description: 'Practice coding in real-time alongside video tutorials'
                },
                {
                  icon: <Zap className="text-[#FFD700]" size={24} />,
                  title: 'Instant Feedback',
                  description: 'Get immediate results and debugging assistance'
                },
                {
                  icon: <Shield className="text-[#10B981]" size={24} />,
                  title: 'Progress Tracking',
                  description: 'Track your learning journey with detailed analytics'
                },
                {
                  icon: <Star className="text-[#8B5CF6]" size={24} />,
                  title: 'Expert Community',
                  description: 'Learn from experienced developers and mentors'
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="p-6 rounded-2xl backdrop-blur-sm group cursor-pointer"
                  style={{ 
                    backgroundColor: 'rgba(57, 62, 70, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#00ADB5] transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="p-6 rounded-2xl backdrop-blur-sm"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(0, 173, 181, 0.2) 0%, rgba(57, 62, 70, 0.4) 100%)',
                  border: '1px solid rgba(0, 173, 181, 0.3)'
                }}
              >
                <h3 className="text-xl font-bold mb-4 text-white text-center">
                  Join Our Community
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: '10K+', label: 'Active Learners' },
                    { value: '500+', label: 'Tutorials' },
                    { value: '4.9★', label: 'Rating' },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold mb-1 text-white">{stat.value}</div>
                      <div className="text-xs text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;