import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { Play, Trash, Download, X, Loader, Terminal } from "lucide-react";

const CodingEditor = () => {
  const { videoId } = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [code, setCode] = useState("// Start coding here");
  const [videoSourceOption, setVideoSourceOption] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState("");
  const debounceRef = useRef(null);
  const [output, setOutput] = useState("");
  const [runtimeError, setRuntimeError] = useState("");
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const outputRef = useRef(null);


  useEffect(() => {
    const templates = {
      javascript: "// JS code here",
      python: "# Python code here",
      cpp: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello World!";
  return 0;
}`,

      csharp: `using System;

namespace HelloWorld
{
  class Program
  {
    static void Main(string[] args)
    {
      Console.WriteLine("Hello World!");  
    }
  }
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
</head>
<body>
    
</body>
</html>`,
    };

    setCode(templates[language] || "");
  }, [language]);

  // Extract YouTube ID
  const extractYoutubeId = (url) => {
    const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Load saved code
  useEffect(() => {
    if (videoId) {
      const savedCode = localStorage.getItem(`code-${videoId}`);
      if (savedCode) setCode(savedCode);
    }
  }, [videoId]);

  // Save code
  useEffect(() => {
    if (videoId) localStorage.setItem(`code-${videoId}`, code);
  }, [code, videoId]);

  // Load video
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

  const loadLocalVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  };

  // Scroll to output when shown
  useEffect(() => {
    if (showOutput && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showOutput]);


  // Handle result properly
  const handleResult = (result) => {
    if (result.compile_output) {
      setRuntimeError(result.compile_output);
    } else if (result.stderr) {
      setRuntimeError(result.stderr);
    } else if (result.stdout) {
      setOutput(result.stdout.trim());
    } else {
      setOutput("No output");
    }
    setIsRunning(false);
  };

  const getResult = async (token) => {
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status_id,compile_output`;

    try {
      for (let i = 0; i < 10; i++) {
        const res = await fetch(url, {
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
        });

        const result = await res.json();

        if (result.status_id === 1 || result.status_id === 2) {
          await new Promise((r) => setTimeout(r, 1000));
        } else {
          handleResult(result);
          return;
        }
      }

      setRuntimeError("Execution timeout");
      setIsRunning(false);
    } catch (err) {
      console.error(err);
      setRuntimeError("Error fetching result");
      setIsRunning(false);
    }
  };


  // RUN CODE HANDLER with loading & output panel
  const runCode = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput("");
    setRuntimeError("");
    setShowOutput(true); // Show output panel

    const languageIdMap = {
      javascript: 63,
      python: 71,
      cpp: 54,
      csharp: 51,
    };

    // ✅ HTML / CSS (local render)
    if (language === "html" || language === "css") {
      const iframe = document.getElementById("output-frame");
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        if (language === "html") {
          doc.write(code);
        } else {
          doc.write(`<style>${code}</style><h1>CSS Output</h1>`);
        }
        doc.close();
      }
      setIsRunning(false);
      return;
    }

    try {
      const res = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            source_code: code,
            language_id: languageIdMap[language],
            stdin: input,
          }),
        }
      );

      const data = await res.json();

      if (!data.token) {
        throw new Error("No token received");
      }

      getResult(data.token);
    } catch (err) {
      console.error(err);
      setRuntimeError("Error running code");
      setIsRunning(false);
    }

  };

  return (
    <div className="h-screen flex flex-col bg-[#1b2b55] text-white">
      {/* TOP BAR */}
      <div className="p-4 flex flex-wrap items-center mt-4 bg-[#0f1f3d] border-b border-white/10 rounded-b-xl justify-between">
        {/* Left side: video source inputs */}
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={videoSourceOption}
            onChange={(e) => setVideoSourceOption(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#1b2b55] border border-white/20 focus:outline-none focus:border-[#00ADB5]"
          >
            <option value="" hidden>Select Video Source</option>
            <option value="youtube">YouTube</option>
            <option value="local">Local</option>
          </select>

          {videoSourceOption === "youtube" && (
            <input
              type="text"
              placeholder="Paste YouTube URL..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#1b2b55] border border-white/20 focus:outline-none focus:border-[#00ADB5] w-80"
            />
          )}

          {videoSourceOption === "local" && (
            <input
              type="file"
              accept="video/*"
              onChange={loadLocalVideo}
              className="text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00ADB5] file:text-white hover:file:bg-[#0099a8]"
            />
          )}
        </div>

        {/* Right side: language selector + run button */}
        <div className="flex gap-4 items-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-2 rounded-lg bg-[#1b2b55] border border-white/20 focus:outline-none focus:border-[#00ADB5] "
          >
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
          </select>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="px-2 py-2 bg-linear-to-r from-[#00ADB5] to-[#61DAFB] text-black rounded-lg font-semibold flex items-center gap-1 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Loader className="animate-spin" size={18} />
                Running...
              </>
            ) : (
              <>
                <Play size={18} />
                Run
              </>
            )}
          </button>

          <button
            onClick={() => setCode("")}
            disabled={!code}
            className="px-2 py-2 bg-linear-to-r from-[#00ADB5] to-[#61DAFB] text-black rounded-lg font-semibold flex items-center gap-1 hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Trash size={18} />
            Clear
          </button>

          <button
            onClick={() => setCode("")}
            disabled={!code}
            className="px-2 py-2 bg-linear-to-r from-[#00ADB5] to-[#61DAFB] text-black rounded-lg font-semibold flex items-center gap-1 hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Download size={18} />
            Save
          </button>
        </div>
      </div>

      {/* MAIN CONTENT: Video + Editor take full remaining height */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: VIDEO */}
        <div className="w-1/2 bg-black flex items-center justify-center relative">
          {error && (
            <div className="absolute top-4 left-4 bg-red-500/80 text-white px-3 py-1 rounded-lg text-sm z-10">
              {error}
            </div>
          )}
          {videoSrc?.includes("youtube") ? (
            <iframe
              src={videoSrc}
              className="w-full h-full"
              allowFullScreen
              title="video"
            />
          ) : videoSrc ? (
            <video
              src={videoSrc}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-gray-500 text-center">
              <Terminal size={48} className="mx-auto mb-2 opacity-50" />
              <p>No video selected</p>
              <p className="text-sm">Choose a video source above</p>
            </div>
          )}
        </div>

        {/* RIGHT: EDITOR */}
        <div className="w-1/2 bg-[#0f1f3d]">
          <Editor
            height="100%"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              fontFamily: "Fira Code, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>

      {/* FLOATING OUTPUT PANEL (appears only when showOutput is true) */}
      {showOutput && (
        <div
          ref={outputRef}
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f1f3d] border-t-2 border-[#00ADB5] shadow-2xl animate-slideUp"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-[#1b2b55] border-b border-white/10">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-[#00ADB5]" />
              <span className="font-semibold">Output Console</span>
              {isRunning && (
                <span className="text-xs text-yellow-400 flex items-center gap-1">
                  <Loader size={12} className="animate-spin" />
                  Executing...
                </span>
              )}
            </div>
            <button
              onClick={() => setShowOutput(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 max-h-64 overflow-auto">
            {/* Input field */}
            <div className="mb-3">
              <label className="text-sm text-gray-300 block mb-1">Program Input (stdin):</label>
              <textarea
                placeholder="Enter input here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-2 rounded bg-[#1b2b55] border border-white/10 text-white font-mono text-sm"
                rows={2}
              />
            </div>

            {/* Output display */}
            {language === "html" || language === "css" ? (
              <div className="bg-white rounded-lg p-2">
                <iframe
                  id="output-frame"
                  className="w-full h-48 bg-white rounded"
                  title="output"
                />
              </div>
            ) : runtimeError ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                  {runtimeError}
                </div>
              </div>
            ) : (
              <div className="bg-black/40 rounded-lg p-3 border border-white/10">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  {output || "Click 'Run Code' to see output..."}
                </pre>
              </div>
            )}
          </div>

          {/* Small handle to drag? (optional) */}
          <div className="h-1 w-full bg-linear-to-r from-[#00ADB5] to-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default CodingEditor;
