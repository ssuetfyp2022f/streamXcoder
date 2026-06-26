// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom'; // Add useLocation
// import { motion } from 'framer-motion';
// import {
//   Code,
//   Github,
//   Twitter,
//   Linkedin,
//   Mail,
//   ExternalLink,
//   Heart,
//   Zap,
//   Video,
//   FileCode,
//   Youtube,
//   MessageSquare,
//   Award,
//   Globe,
//   Rocket,
//   ArrowUp,
//   Users,
//   Star,
//   Shield,
//   Coffee,
//   Terminal
// } from 'lucide-react';

// const Footer = () => {
//   const [email, setEmail] = useState('');
//   const currentYear = new Date().getFullYear();
//   const location = useLocation(); // Get current route
//   // Check if current page is editor
//   const isEditorPage = location.pathname.startsWith('/editor');
//   const isAdminPage = location.pathname.startsWith('/admin');
//   if (isAdminPage) return null;


//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     if (email) {
//       alert(`Thank you for subscribing with ${email}!`);
//       setEmail('');
//     }
//   };

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const socialLinks = [
//     { icon: Github, label: 'GitHub', color: '#6e5494', url: 'https://github.com' },
//     { icon: Twitter, label: 'Twitter', color: '#1DA1F2', url: 'https://twitter.com' },
//     { icon: Linkedin, label: 'LinkedIn', color: '#0077B5', url: 'https://linkedin.com' },
//     { icon: Youtube, label: 'YouTube', color: '#FF0000', url: 'https://youtube.com' },
//     { icon: MessageSquare, label: 'Discord', color: '#7289DA', url: 'https://discord.com' },
//   ];

//   const quickLinks = [
//     { label: 'Home', path: '/' },
//     { label: 'Browse Videos', path: '/videos' },
//     { label: 'Code Editor', path: '/editor' },
//     { label: 'Upload Video', path: '/upload' },
//     { label: 'Courses', path: '/courses' },
//     { label: 'Community', path: '/community' },
//   ];

//   const features = [
//     { icon: Video, label: 'Interactive Videos', count: '500+' },
//     { icon: Terminal, label: 'Code Challenges', count: '100+' },
//     { icon: Users, label: 'Active Community', count: '50K+' },
//     { icon: Award, label: 'Certifications', count: '25+' },
//   ];

//   // Check if current page is the editor page
//   // const isEditorPage = location.pathname === '/editor' || location.pathname.startsWith('/editor/');
//   const isHomePage = location.pathname === '/';

//   return (
//     <footer className="relative mt-auto overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 opacity-5"
//           style={{
//             backgroundImage: `radial-gradient(circle at 20% 80%, #00ADB5 0%, transparent 50%),
//                              radial-gradient(circle at 80% 20%, #393E46 0%, transparent 50%)`
//           }}
//         />

//         {/* Floating elements */}
//         {[...Array(5)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full opacity-10"
//             style={{
//               backgroundColor: '#00ADB5',
//               width: 40 + i * 20,
//               height: 40 + i * 20,
//               top: `${10 + i * 15}%`,
//               left: `${i * 20}%`,
//             }}
//             animate={{
//               y: [0, -30, 0],
//               rotate: [0, 360],
//             }}
//             transition={{
//               duration: 15 + i * 5,
//               repeat: Infinity,
//               ease: "linear",
//             }}
//           />
//         ))}
//       </div>

//       {/* Main Footer Content */}
//       <div className="relative z-10">
//         {/* Top Section */}
//         {isHomePage && (
//           <div className="py-16" style={{ backgroundColor: '#393E46' }}>
//             <div className="container mx-auto px-4">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
//                 {/* Brand Section */}
//                 <div className="space-y-6">
//                   <div className="flex items-center gap-4">
//                     <motion.div
//                       whileHover={{ rotate: 360 }}
//                       transition={{ duration: 0.5 }}
//                       className="relative"
//                     >
//                       <div className="w-16 h-16 rounded-xl flex items-center justify-center"
//                         style={{
//                           background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
//                         }}
//                       >
//                         <Code className="text-white" size={28} />
//                       </div>
//                       <motion.div
//                         className="absolute -top-2 -right-2"
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//                       >
//                         <Zap size={16} className="text-yellow-400" />
//                       </motion.div>
//                     </motion.div>

//                     <div>
//                       <h2 className="text-3xl font-bold bg-linear-to-r from-[#00ADB5] via-[#61DAFB] to-[#00ADB5] bg-clip-text text-transparent">
//                         StreamXCoder
//                       </h2>
//                       <p className="text-gray-300 mt-1">Learn. Code. Build.</p>
//                     </div>
//                   </div>

//                   <p className="text-gray-300 leading-relaxed max-w-lg">
//                     The ultimate platform for interactive coding tutorials. Watch videos,
//                     write code in real-time, and join a community of passionate developers
//                     transforming their skills.
//                   </p>
//                 </div>

//                 {/* Newsletter & Quick Links */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   {/* Quick Links */}
//                   <div>
//                     <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
//                       <ExternalLink size={18} />
//                       Quick Links
//                     </h3>
//                     <div className="grid grid-cols-2 gap-3">
//                       {quickLinks.map((link, index) => (
//                         <motion.div
//                           key={link.label}
//                           initial={{ opacity: 0, x: -20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.05 }}
//                         >
//                           <Link
//                             to={link.path}
//                             className="flex items-center gap-2 py-2 text-gray-300 hover:text-white group transition-all"
//                           >
//                             <div className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                               style={{ backgroundColor: '#00ADB5' }}
//                             />
//                             <span className="group-hover:translate-x-1 transition-transform">
//                               {link.label}
//                             </span>
//                           </Link>
//                         </motion.div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Newsletter */}
//                   <div>
//                     <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
//                       <Rocket size={18} />
//                       Stay Updated
//                     </h3>

//                     <form onSubmit={handleSubscribe} className="space-y-4">
//                       <p className="text-gray-300 text-sm">
//                         Get the latest tutorials, updates, and coding tips directly in your inbox.
//                       </p>

//                       <div className="relative">
//                         <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                         <input
//                           type="email"
//                           value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                           placeholder="Your email address"
//                           className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white placeholder-gray-400 outline-none border border-white/10 focus:border-[#00ADB5] transition-colors"
//                         />
//                       </div>

//                       <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         type="submit"
//                         className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
//                         style={{
//                           background: 'linear-gradient(135deg, #00ADB5 0%, #393E46 100%)',
//                           color: '#FFFFFF'
//                         }}
//                       >
//                         <Zap size={18} />
//                         Subscribe Now
//                       </motion.button>

//                       <p className="text-xs text-gray-400 text-center">
//                         No spam. Unsubscribe anytime.
//                       </p>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* Bottom Bar */}
//         <div style={{ backgroundColor: '#222831' }}>
//           <div className="container mx-auto px-4 py-6">
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//               {/* Copyright */}
//               <div className="flex items-center gap-3">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                 >
//                   <Heart size={16} className="text-[#00ADB5]" />
//                 </motion.div>
//                 <div className="text-gray-300 text-sm">
//                   <span>© {currentYear} StreamXCoder. All rights reserved.</span>
//                   <span className="mx-2">•</span>
//                   <span>Made with passion for developers worldwide</span>
//                 </div>
//               </div>

//               {/* Legal Links */}
//               <div className="flex items-center gap-6">
//                 {[
//                   { label: 'Privacy Policy', path: '/privacy' },
//                   { label: 'Terms of Service', path: '/terms' },
//                   { label: 'Cookie Policy', path: '/cookies' },
//                   { label: 'Contact', path: '/contact' },
//                 ].map((link) => (
//                   <Link
//                     key={link.label}
//                     to={link.path}
//                     className="text-sm text-gray-400 hover:text-white transition-colors"
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//               </div>

//               {/* Back to Top Button */}
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={scrollToTop}
//                 className="w-12 h-12 rounded-full flex items-center justify-center group"
//                 style={{
//                   background: 'linear-gradient(135deg, #00ADB5 0%, #393E46 100%)'
//                 }}
//               >
//                 <ArrowUp size={20} className="text-white group-hover:-translate-y-1 transition-transform" />
//               </motion.button>
//             </div>

//             {/* Trust Badges */}
//             <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-6 border-t"
//               style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
//             >
//               <div className="flex items-center gap-2 text-sm text-gray-400">
//                 <Shield size={16} className="text-green-400" />
//                 <span>SSL Secured</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-400">
//                 <Star size={16} className="text-yellow-400" />
//                 <span>4.9/5 Rating</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-400">
//                 <Coffee size={16} className="text-orange-400" />
//                 <span>24/7 Support</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-400">
//                 <FileCode size={16} className="text-purple-400" />
//                 <span>Open Source</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Floating CTA - Hidden on Editor Page */}
//       {!isEditorPage && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1 }}
//           className="fixed bottom-6 right-6 z-40"
//         >
//           <motion.div
//             animate={{ scale: [1, 1.05, 1] }}
//             transition={{ duration: 2, repeat: Infinity }}
//             className="relative"
//           >
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className="px-6 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2"
//               style={{
//                 background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
//                 color: '#FFFFFF'
//               }}
//               onClick={() => window.open('/editor', '_blank')}
//             >
//               <Terminal size={20} />
//               <span>Start Coding Free</span>
//               <Zap size={16} />
//             </motion.button>

//             {/* Glow effect */}
//             <div className="absolute inset-0 rounded-xl blur-xl opacity-50 -z-10"
//               style={{ backgroundColor: '#00ADB5' }}
//             />
//           </motion.div>
//         </motion.div>
//       )}
//     </footer>
//   );
// };

// export default Footer;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
  Heart,
  Zap,
  Video,
  FileCode,
  Youtube,
  MessageSquare,
  Award,
  Globe,
  Rocket,
  ArrowUp,
  Users,
  Star,
  Shield,
  Coffee,
  Terminal
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  const isEditorPage = location.pathname.startsWith('/editor');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';
  
  if (isAdminPage) return null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, label: 'GitHub', color: '#6e5494', url: 'https://github.com' },
    { icon: Twitter, label: 'Twitter', color: '#1DA1F2', url: 'https://twitter.com' },
    { icon: Linkedin, label: 'LinkedIn', color: '#0077B5', url: 'https://linkedin.com' },
    { icon: Youtube, label: 'YouTube', color: '#FF0000', url: 'https://youtube.com' },
    { icon: MessageSquare, label: 'Discord', color: '#7289DA', url: 'https://discord.com' },
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Browse Videos', path: '/videos' },
    { label: 'Code Editor', path: '/editor' },
    { label: 'Upload Video', path: '/upload' },
    { label: 'Courses', path: '/courses' },
    { label: 'Community', path: '/community' },
  ];

  const features = [
    { icon: Video, label: 'Interactive Videos', count: '500+' },
    { icon: Terminal, label: 'Code Challenges', count: '100+' },
    { icon: Users, label: 'Active Community', count: '50K+' },
    { icon: Award, label: 'Certifications', count: '25+' },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #00ADB5 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, #393E46 0%, transparent 50%)`
          }}
        />

        {/* Floating elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              backgroundColor: '#00ADB5',
              width: 40 + i * 20,
              height: 40 + i * 20,
              top: `${10 + i * 15}%`,
              left: `${i * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section */}
        {isHomePage && (
          <div className="py-16" style={{ backgroundColor: '#393E46' }}>
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                {/* Brand Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                        }}
                      >
                        <Code className="text-white" size={28} />
                      </div>
                      <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap size={16} className="text-yellow-400" />
                      </motion.div>
                    </motion.div>

                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00ADB5] via-[#61DAFB] to-[#00ADB5] bg-clip-text text-transparent">
                        StreamXCoder
                      </h2>
                      <p className="text-gray-300 mt-1">Learn. Code. Build.</p>
                    </div>
                  </div>

                  <p className="text-gray-300 leading-relaxed max-w-lg">
                    The ultimate platform for interactive coding tutorials. Watch videos,
                    write code in real-time, and join a community of passionate developers
                    transforming their skills.
                  </p>

                  {/* Social Links - Added from second file */}
                  <div className="flex items-center gap-4 pt-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.1, y: -3 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: social.color
                        }}
                      >
                        <social.icon size={18} />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Newsletter & Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Quick Links */}
                  <div>
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                      <ExternalLink size={18} />
                      Quick Links
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {quickLinks.map((link, index) => (
                        <motion.div
                          key={link.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={link.path}
                            className="flex items-center gap-2 py-2 text-gray-300 hover:text-white group transition-all"
                          >
                            <div className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: '#00ADB5' }}
                            />
                            <span className="group-hover:translate-x-1 transition-transform">
                              {link.label}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Newsletter */}
                  <div>
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                      <Rocket size={18} />
                      Stay Updated
                    </h3>

                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <p className="text-gray-300 text-sm">
                        Get the latest tutorials, updates, and coding tips directly in your inbox.
                      </p>

                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white placeholder-gray-400 outline-none border border-white/10 focus:border-[#00ADB5] transition-colors"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #00ADB5 0%, #393E46 100%)',
                          color: '#FFFFFF'
                        }}
                      >
                        <Zap size={18} />
                        Subscribe Now
                      </motion.button>

                      <p className="text-xs text-gray-400 text-center">
                        No spam. Unsubscribe anytime.
                      </p>
                    </form>
                  </div>
                </div>
              </div>

              {/* Features Grid - Added from second file */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <feature.icon className="mx-auto text-[#00ADB5] mb-2" size={24} />
                    <div className="text-2xl font-bold text-white">{feature.count}</div>
                    <div className="text-sm text-gray-400">{feature.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        {!isEditorPage && (
          <div style={{ backgroundColor: '#222831' }}>
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Copyright */}
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Heart size={16} className="text-[#00ADB5]" />
                  </motion.div>
                  <div className="text-gray-300 text-sm">
                    <span>© {currentYear} StreamXCoder. All rights reserved.</span>
                    <span className="mx-2">•</span>
                    <span>Made with passion for developers worldwide</span>
                  </div>
                </div>

                {/* Legal Links */}
                <div className="flex items-center gap-6">
                  {[
                    { label: 'Privacy Policy', path: '/privacy' },
                    { label: 'Terms of Service', path: '/terms' },
                    { label: 'Cookie Policy', path: '/cookies' },
                    { label: 'Contact', path: '/contact' },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Back to Top Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={scrollToTop}
                  className="w-12 h-12 rounded-full flex items-center justify-center group"
                  style={{
                    background: 'linear-gradient(135deg, #00ADB5 0%, #393E46 100%)'
                  }}
                >
                  <ArrowUp size={20} className="text-white group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-6 border-t"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Shield size={16} className="text-green-400" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Star size={16} className="text-yellow-400" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Coffee size={16} className="text-orange-400" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FileCode size={16} className="text-purple-400" />
                  <span>Open Source</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating CTA - Hidden on Editor Page */}
      {!isEditorPage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-6 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #00ADB5 0%, #61DAFB 100%)',
                color: '#FFFFFF'
              }}
              onClick={() => window.open('/editor', '_blank')}
            >
              <Terminal size={20} />
              <span>Start Coding Free</span>
              <Zap size={16} />
            </motion.button>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl blur-xl opacity-50 -z-10"
              style={{ backgroundColor: '#00ADB5' }}
            />
          </motion.div>
        </motion.div>
      )}
    </footer>
  );
};

export default Footer;