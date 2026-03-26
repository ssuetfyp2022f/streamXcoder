import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import Split from "react-split";

const CodingEditor = () => {
  const { videoId } = useParams(); // Get video ID from URL
  const [videoUrl, setVideoUrl] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [code, setCode] = useState("// Start coding here");
  const [videoSourceOption, setVideoSourceOption] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  // Helper: Extract YouTube video ID
  const extractYoutubeId = (url) => {
    const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Load saved code per video
  useEffect(() => {
    if (videoId) {
      const savedCode = localStorage.getItem(`code-${videoId}`);
      if (savedCode) setCode(savedCode);
    }
  }, [videoId]);

  // Save code per video
  useEffect(() => {
    if (videoId) localStorage.setItem(`code-${videoId}`, code);
  }, [code, videoId]);

  // Load video when videoId or videoUrl changes (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setError("");

      if (videoId) {
        setVideoSrc(`https://www.youtube.com/embed/${videoId}`);
        return;
      }

      if (videoSourceOption === "youtube" && videoUrl) {
        const id = extractYoutubeId(videoUrl);
        if (id) setVideoSrc(`https://www.youtube.com/embed/${id}`);
        else {
          setVideoSrc("");
          setError("Invalid YouTube URL");
        }
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [videoId, videoUrl, videoSourceOption]);

  // Load local video
  const loadLocalVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  };

  return (
    <div className="h-full flex flex-col bg-[#1b2b55] text-white">

      {/* TOP BAR */}
      <div className="p-4 flex flex-wrap gap-4 items-center mt-4 bg-[#0f1f3d] border-b border-white/10 rounded-b-xl">

        <div className="relative flex items-center gap-2">
          {/* Video Source Selector */}
          <select
            className="text-sm px-3 py-2 rounded-lg text-[#00ADB5] bg-[#1b2b55] border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50 transition"
            value={videoSourceOption}
            onChange={(e) => setVideoSourceOption(e.target.value)}
          >
            <option value="" hidden disabled>Select Video Source</option>
            <option value="youtube">YouTube / Video URL</option>
            <option value="local">Local Video</option>
          </select>

          {/* Help Icon */}
          {!videoSourceOption && (
            <div className="relative group cursor-pointer">
              <span className="text-[#00ADB5] font-bold">?</span>
              <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-64 bg-gray-800 text-white text-xs p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Select a video source: choose from courses, paste a YouTube URL, paste a URL from other platforms, or upload a local file.
              </div>
            </div>
          )}
        </div>

        {/* YouTube URL Input */}
        {videoSourceOption === "youtube" && (
          <div className="flex items-end gap-3">
            <input
              type="text"
              placeholder="Paste YouTube or video URL..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#1b2b55] border border-white/20 text-white w-72 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50 transition"
            />
          </div>
        )}

        {/* Local Video Upload */}
        {videoSourceOption === "local" && (
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              loadLocalVideo(e);
              setVideoUrl("");
            }}
            className="text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00ADB5] file:text-black hover:file:bg-[#01979e] cursor-pointer"
          />
        )}

        {/* Language Selector */}
        <select
          className="text-sm px-3 py-2 rounded-lg text-[#00ADB5] bg-[#1b2b55] border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50 transition"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>

        {/* Copy Code Button */}
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="px-3 py-2 bg-[#00ADB5] text-black rounded-lg"
        >
          Copy Code
        </button>

      </div>

      {/* MAIN LAYOUT */}
      <Split className="flex flex-1" sizes={[50, 50]} minSize={200} gutterSize={8}>

        {/* VIDEO SIDE */}
        <div className="h-full flex items-center justify-center bg-black relative">
          {error && <p className="absolute text-red-500 top-2">{error}</p>}
          {videoSrc.includes("youtube") ? (
            <iframe
              src={videoSrc}
              title="YouTube Player"
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            videoSrc && (
              <video
                src={videoSrc}
                controls
                className="w-full h-full object-contain"
              />
            )
          )}
        </div>

        {/* EDITOR SIDE */}
        <div className="h-full border-l border-white/10 bg-[#0f1f3d]">
          <Editor
            height="100%"
            defaultLanguage={language}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>

      </Split>

    </div>
  );
};

export default CodingEditor;