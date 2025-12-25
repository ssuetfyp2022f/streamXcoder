import React from 'react';
import { Link } from 'react-router-dom';
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
  Youtube
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      {/* Main Footer Section - #393E46 */}
      <div style={{ backgroundColor: '#393E46', color: '#FFFFFF' }}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand/Logo Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00ADB5' }}>
                  <Code size={24} />
                </div>
                <span className="text-xl font-bold">StreamXCoder</span>
              </div>
              <p className="text-sm opacity-90">
                Learn to code by watching videos and practicing in real-time.
              </p>
              <div className="flex gap-3 pt-2">
                <a href="https://github.com/example" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition hover:scale-110">
                  <Github size={20} />
                </a>
                <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition hover:scale-110">
                  <Twitter size={20} />
                </a>
                <a href="https://linkedin.com/in/example" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition hover:scale-110">
                  <Linkedin size={20} />
                </a>
                <a href="https://youtube.com/example" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition hover:scale-110">
                  <Youtube size={20} />
                </a>
                <a href="mailto:example@example.com" className="hover:opacity-80 transition hover:scale-110">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap size={18} />
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline hover:opacity-90 transition flex items-center gap-1">
                    <ExternalLink size={14} />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/videos" className="hover:underline hover:opacity-90 transition flex items-center gap-1">
                    <ExternalLink size={14} />
                    Browse Videos
                  </Link>
                </li>
                <li>
                  <Link to="/explore" className="hover:underline hover:opacity-90 transition flex items-center gap-1">
                    <ExternalLink size={14} />
                    Code Editor
                  </Link>
                </li>
                <li>
                  <Link to="/upload" className="hover:underline hover:opacity-90 transition flex items-center gap-1">
                    <ExternalLink size={14} />
                    Upload Video
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Video size={18} />
                Features
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00ADB5' }}></div>
                  <span>Video Tutorials</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00ADB5' }}></div>
                  <span>Real-time Code Editor</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00ADB5' }}></div>
                  <span>Practice Exercises</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00ADB5' }}></div>
                  <span>Community Support</span>
                </li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileCode size={18} />
                Built With
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: '#00ADB5' }}>
                  React
                </span>
                <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: '#00ADB5' }}>
                  Tailwind CSS
                </span>
                <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: '#00ADB5' }}>
                  Firebase
                </span>
                <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: '#00ADB5' }}>
                  Node.js
                </span>
                <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: '#00ADB5' }}>
                  MongoDB
                </span>
              </div>
              <div className="mt-6">
                <h4 className="font-bold mb-2">Newsletter</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 text-sm rounded-l-lg outline-none placeholder-gray-400"
                    style={{ backgroundColor: '#222831', color: '#FFFFFF' }}
                  />
                  <button 
                    className="px-4 py-2 text-sm rounded-r-lg font-medium hover:opacity-90 transition"
                    style={{ backgroundColor: '#00ADB5', color: '#FFFFFF' }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - #00ADB5 */}
      <div style={{ backgroundColor: '#00ADB5', color: '#FFFFFF' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart size={16} fill="#FFFFFF" />
              <span className="text-sm">
                Made with passion for the developer community
              </span>
            </div>
            
            <div className="text-sm text-center md:text-right">
              <p>© {currentYear} StreamXCoder. All rights reserved.</p>
              <p className="mt-1 opacity-90">
                <a href="https://example.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline mx-2">
                  Privacy Policy
                </a>
                <span>•</span>
                <a href="https://example.com/terms" target="_blank" rel="noopener noreferrer" className="hover:underline mx-2">
                  Terms of Service
                </a>
                <span>•</span>
                <a href="mailto:contact@example.com" className="hover:underline mx-2">
                  Contact Us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;