// src/components/VideoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, User, Eye, Code } from 'lucide-react';

const VideoCard = ({ video }) => {
  // Default values if video data is not provided
  const {
    id = 1,
    title = "Video Title",
    description = "Video description will appear here...",
    thumbnail = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=225&fit=crop&crop=center",
    duration = "10:30",
    author = "StreamXCoder",
    views = "1.2K",
    category = "React",
    level = "Beginner"
  } = video || {};

  return (
    <Link to={`/video/${id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Thumbnail Container */}
        <div className="relative">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#213555' }}>
                <Play className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock size={12} />
            <span>{duration}</span>
          </div>
          
          {/* Level Badge */}
          <div className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded" style={{ 
            backgroundColor: level === 'Beginner' ? '#D8C4B6' : 
                           level === 'Intermediate' ? '#3E5879' : '#213555',
            color: level === 'Beginner' ? '#000000' : '#FFFFFF'
          }}>
            {level}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <div className="flex items-center gap-1 mb-2">
            <Code size={14} style={{ color: '#213555' }} />
            <span className="text-xs font-medium" style={{ color: '#213555' }}>
              {category}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-1" style={{ color: '#000000' }}>
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
            </p>

          </div>
          
          {/* Meta Information */}
          <div className="flex items-center justify-between text-gray-500 text-sm pt-3 border-t" style={{ borderColor: '#D8C4B6' }}>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{views} views</span>
            </div>
          </div>
        </div>
      
    </Link>
  );
};

// Optional: Default Props
VideoCard.defaultProps = {
  video: {
    id: 1,
    title: "Learn React in 60 Minutes",
    description: "Complete React tutorial for beginners with hands-on coding exercises.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop&crop=center",
    duration: "10:30",
    author: "StreamXCoder",
    views: "1.2K",
    category: "React",
    level: "Beginner"
  }
};

export default VideoCard;