import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Rocket, Sparkles, Code, User, Mail, Lock, Eye, EyeOff,
  Check, Shield, Terminal, Zap, Globe, Star, AlertCircle,
  ArrowRight, ChevronRight, Brain, Fingerprint
} from 'lucide-react';

// PROGRAMMING LANGUAGES
const PROGRAMMING_LANGUAGES = [
  { id: 'html', name: 'HTML', icon: '🌐', color: '#E34F26' },
  { id: 'css', name: 'CSS', icon: '🎨', color: '#1572B6' },
  { id: 'js', name: 'JavaScript', icon: '⚡', color: '#F7DF1E' },
  { id: 'python', name: 'Python', icon: '🐍', color: '#3776AB' },
  { id: 'csharp', name: 'C#', icon: '🔷', color: '#68217A' },
  { id: 'cpp', name: 'C++', icon: '⚙️', color: '#00599C' }
];

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
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [localError, setLocalError] = useState('');
  const [languageError, setLanguageError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

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
    setLocalError('');
    setLanguageError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleLanguage = (langId) => {
    setLanguageError('');
    if (selectedLanguages.includes(langId)) {
      setSelectedLanguages(selectedLanguages.filter(id => id !== langId));
    } else if (selectedLanguages.length < 2) {
      setSelectedLanguages([...selectedLanguages, langId]);
    } else {
      setLanguageError('Maximum 2 languages can be selected');
      setTimeout(() => setLanguageError(''), 3000);
    }
  };

  const validateStep1 = () => {
    if (!formData.displayName.trim()) {
      setLocalError('Full name is required');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setLocalError('Valid email address is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (selectedLanguages.length === 0) {
      setLanguageError('Please select at least one language');
      return;
    }
    try {
      await signup(formData.email, formData.password, formData.displayName, selectedLanguages);
      sessionStorage.setItem('justLoggedIn', 'true');
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      sessionStorage.setItem('justLoggedIn', 'true'); 
      navigate('/select-languages');
    } catch (err) {
      console.error('Google signup error:', err);
    }
  };

  const displayError = error || localError || languageError;

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
            
            {/* Left Column - Hero Section */}
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
                  Start Your <br />
                  <span className="bg-gradient-to-r from-[#00ADB5] via-[#61DAFB] to-[#00ADB5] bg-clip-text text-transparent">
                    Coding Journey
                  </span>
                </h1>
                <p className="text-gray-400 text-lg">
                  Join thousands of developers learning through interactive tutorials and real-time coding.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-6">
                {[
                  { icon: <Terminal className="text-[#00ADB5]" size={20} />, text: 'Live Code Editor' },
                  { icon: <Brain className="text-[#FFD700]" size={20} />, text: 'Track your learning progress' },
                  { icon: <Rocket className="text-[#FF6B35]" size={20} />, text: 'Project-based learning' },
                  { icon: <Shield className="text-[#10B981]" size={20} />, text: 'Secure & private environment' }
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
                    { value: '10K+', label: 'Active Learners' },
                    { value: '500+', label: 'Tutorials' },
                    { value: '4.9★', label: 'Rating' },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold mb-1 text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Signup Form */}
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
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        formStep >= step ? 'scale-110' : ''
                      }`}
                        style={{
                          backgroundColor: formStep >= step ? '#00ADB5' : 'rgba(255,255,255,0.1)',
                          border: formStep >= step ? 'none' : '1px solid rgba(255,255,255,0.2)'
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
                      <span className={`text-sm mt-2 ${formStep >= step ? 'text-white' : 'text-gray-400'}`}>
                        {step === 1 ? 'Account' : step === 2 ? 'Languages' : 'Confirm'}
                      </span>
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-0.5 mx-4 ${formStep > step ? 'bg-[#00ADB5]' : 'bg-white/10'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Error Message */}
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl flex items-center gap-3"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                >
                  <AlertCircle className="text-red-400" size={20} />
                  <span className="text-red-300 text-sm flex-1">{displayError}</span>
                  <button onClick={() => { clearError(); setLocalError(''); setLanguageError(''); }} className="text-red-400">✕</button>
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
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
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
                            className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300"
                            placeholder="Enter your full name"
                          />
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]" size={18} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
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
                            className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300"
                            placeholder="you@example.com"
                          />
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ADB5]" size={18} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
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
                        <div className="relative group">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
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
                        <div className="mt-2 h-2 rounded-full overflow-hidden bg-white/10">
                          <motion.div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              backgroundColor: passwordStrength === 100 ? '#10B981' : passwordStrength >= 75 ? '#3B82F6' : passwordStrength >= 50 ? '#F59E0B' : '#EF4444',
                              width: `${passwordStrength}%`
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
                      </div>

                      <motion.button
                        type="button"
                        onClick={() => validateStep1() && setFormStep(2)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 relative overflow-hidden group mt-4"
                        style={{
                          background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                          color: '#FFFFFF'
                        }}
                      >
                        <span className="relative z-10">Continue to Select Languages</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        <motion.div
                          className="absolute inset-0"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                          initial={{ x: '-100%' }}
                          animate={{ x: isHovered ? 0 : '-100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Step 2: Languages */}
                  {formStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-5"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Terminal size={20} />
                            Select Programming Languages
                          </h3>
                          <span className={`text-sm ${selectedLanguages.length === 2 ? 'text-orange-400' : 'text-gray-400'}`}>
                            {selectedLanguages.length}/2 selected
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Choose up to 2 languages to start your journey</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {PROGRAMMING_LANGUAGES.map((lang) => (
                            <motion.button
                              key={lang.id}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => toggleLanguage(lang.id)}
                              className={`p-4 rounded-xl flex items-center gap-3 transition-all ${
                                selectedLanguages.includes(lang.id) ? 'border-2' : 'border border-white/10'
                              }`}
                              style={{ 
                                backgroundColor: selectedLanguages.includes(lang.id) ? `${lang.color}20` : 'rgba(255,255,255,0.05)',
                                borderColor: selectedLanguages.includes(lang.id) ? lang.color : ''
                              }}
                            >
                              <span className="text-2xl">{lang.icon}</span>
                              <div className="flex-1 text-left">
                                <div className={`font-bold ${selectedLanguages.includes(lang.id) ? 'text-white' : 'text-gray-300'}`}>
                                  {lang.name}
                                </div>
                              </div>
                              {selectedLanguages.includes(lang.id) && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                  <Check size={16} style={{ color: lang.color }} />
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
                          onClick={() => selectedLanguages.length > 0 ? setFormStep(3) : setLanguageError('Please select at least one language')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-[#00ADB5] to-[#61DAFB] text-white"
                        >
                          Continue
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Confirm */}
                  {formStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-5"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                          style={{
                            backgroundColor: 'rgba(0, 173, 181, 0.1)',
                            border: '2px solid rgba(0, 173, 181, 0.3)'
                          }}
                        >
                          <Shield size={32} className="text-[#00ADB5]" />
                        </motion.div>
                        
                        <h3 className="text-2xl font-bold mb-2 text-white">Almost There!</h3>
                        <p className="text-gray-400 mb-4">Confirm your password to complete registration</p>

                        <div className="mb-4 p-3 rounded-xl bg-white/5">
                          <p className="text-gray-300 text-sm mb-2">You will learn:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {selectedLanguages.map(langId => {
                              const lang = PROGRAMMING_LANGUAGES.find(l => l.id === langId);
                              return (
                                <span key={langId} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${lang.color}30`, color: lang.color }}>
                                  {lang.icon} {lang.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-[#00ADB5] transition-all duration-300"
                          />
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <input type="checkbox" id="terms" required className="w-4 h-4" />
                          <label htmlFor="terms" className="text-sm text-gray-300">
                            I agree to the <a href="#" className="text-[#00ADB5] hover:underline">Terms of Service</a>
                          </label>
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
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 relative overflow-hidden group"
                          style={{
                            background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                            color: '#FFFFFF'
                          }}
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Rocket size={18} />
                              <span>Create Account</span>
                              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-gray-400" style={{ backgroundColor: 'rgba(57, 62, 70, 0.6)' }}>
                    Or sign up with
                  </span>
                </div>
              </div>

              {/* Google Signup */}
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
              <div className="text-center mt-6 pt-4 border-t border-white/10">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#00ADB5] font-bold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
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
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)',
              color: '#FFFFFF'
            }}
          >
            <Sparkles size={20} />
            <span>Already a Member?</span>
            <Rocket size={16} />
          </motion.button>
          <div className="absolute inset-0 rounded-xl blur-xl opacity-50 -z-10" style={{ backgroundColor: '#FF6B35' }} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;