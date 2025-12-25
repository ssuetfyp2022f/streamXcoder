import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Video, Code, User, LogIn, Menu, X, LogOut, Upload, Search 
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <nav className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: '#393E46' }}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00ADB5' }}>
              <Code className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-white">
              StreamXCoder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition">
              <Home size={18} />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link to="/videos" className="flex items-center gap-2 text-gray-300 hover:text-white transition">
              <Video size={18} />
              <span className="font-medium">Videos</span>
            </Link>
            
            <Link to="/explore" className="flex items-center gap-2 text-gray-300 hover:text-white transition">
              <Code size={18} />
              <span className="font-medium">Code Editor</span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            
            {/* Search Bar - #222831 */}
            <div className="hidden md:flex items-center rounded-lg px-3 py-2" style={{ backgroundColor: '#222831' }}>
              <Search className="text-gray-300" size={20} />
              <input 
                type="text" 
                placeholder="Search videos..." 
                className="bg-transparent ml-2 outline-none w-48 text-white placeholder-gray-400"
              />
            </div>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/upload" className="hidden md:flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition" style={{ backgroundColor: '#00ADB5' }}>
                  <Upload size={18} />
                  <span>Upload</span>
                </Link>
                
                <div className="relative">
                  <button className="w-8 h-8 rounded-full text-white" style={{ backgroundColor: '#00ADB5' }}>
                    {user.name?.charAt(0) || 'U'}
                  </button>
                </div>
                
                <button className="hidden md:flex items-center gap-2 text-red-400 hover:text-red-300 transition">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                  <LogIn size={18} />
                  <span className="hidden md:inline">Login</span>
                </Link>
                
                <Link to="/signup" className="px-4 py-2 rounded-lg hover:opacity-90 transition" style={{ backgroundColor: '#00ADB5', color: '#FFFFFF' }}>
                  <span className="font-medium">Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 pt-4" style={{ borderTop: '1px solid #222831' }}>
            <div className="flex flex-col gap-3">
              <Link to="/" className="flex items-center gap-3 py-2 text-gray-300 hover:text-white transition" onClick={() => setIsMenuOpen(false)}>
                <Home size={20} />
                <span>Home</span>
              </Link>
              
              <Link to="/videos" className="flex items-center gap-3 py-2 text-gray-300 hover:text-white transition" onClick={() => setIsMenuOpen(false)}>
                <Video size={20} />
                <span>Videos</span>
              </Link>
              
              <Link to="/explore" className="flex items-center gap-3 py-2 text-gray-300 hover:text-white transition" onClick={() => setIsMenuOpen(false)}>
                <Code size={20} />
                <span>Code Editor</span>
              </Link>

              {/* Mobile Search Bar - #222831 */}
              <div className="flex items-center rounded-lg px-3 py-2 mt-2" style={{ backgroundColor: '#222831' }}>
                <Search className="text-gray-300" size={20} />
                <input 
                  type="text" 
                  placeholder="Search videos..." 
                  className="bg-transparent ml-2 outline-none flex-1 text-white placeholder-gray-400"
                />
              </div>

              {user ? (
                <>
                  <Link to="/upload" className="flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg mt-2 hover:opacity-90 transition" onClick={() => setIsMenuOpen(false)} style={{ backgroundColor: '#00ADB5' }}>
                    <Upload size={18} />
                    <span>Upload Video</span>
                  </Link>
                  
                  <Link to="/dashboard" className="flex items-center gap-3 py-2 text-gray-300 hover:text-white transition" onClick={() => setIsMenuOpen(false)}>
                    <User size={20} />
                    <span>Dashboard</span>
                  </Link>
                  
                  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg mt-2 hover:opacity-90 transition" onClick={() => setIsMenuOpen(false)} style={{ backgroundColor: '#00ADB5', color: '#FFFFFF' }}>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg mt-2 hover:opacity-90 transition" onClick={() => setIsMenuOpen(false)} style={{ backgroundColor: '#00ADB5' }}>
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                  
                  <Link to="/signup" className="px-4 py-2 rounded-lg hover:opacity-90 transition text-center" onClick={() => setIsMenuOpen(false)} style={{ backgroundColor: '#00ADB5', color: '#FFFFFF' }}>
                    <span className="font-medium">Create Account</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;