import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Copy,
  Trash,
  Download,
  X,
  Loader,
  Terminal,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  GripHorizontal,
} from "lucide-react";
import CustomButton from "../components/EditorPageButton";
import CustomSelect from "../components/EditorPageSelect";

const CodingEditor = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [runStatus, setRunStatus] = useState(null);
  const [hasNewError, setHasNewError] = useState(false); // for blinking dot

  // New states for requested features
  const [showInput, setShowInput] = useState(false);
  const [activeTab, setActiveTab] = useState("output");
  const [consoleHeight, setConsoleHeight] = useState(250);
  const [isDraggingConsole, setIsDraggingConsole] = useState(false);
  const consoleResizeRef = useRef(null);
  const consoleStartHeightRef = useRef(0);
  const consoleStartYRef = useRef(0);

  // Resizable split state (video vs editor)
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Monaco editor refs for error markers
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

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
    <h1>Hello World!</h1>
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

      if (videoSourceOption === "youtube" && videoUrl) {
        const id = extractYoutubeId(videoUrl);
        if (id) {
          setVideoSrc(`https://www.youtube.com/embed/${id}`);
        } else {
          setVideoSrc("");
          setError("Invalid YouTube URL");
        }
      } else if (videoSourceOption === "local") {
        // handled separately
      } else if (videoId) {
        setVideoSrc(`https://www.youtube.com/embed/${videoId}`);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [videoId, videoUrl, videoSourceOption]);

  // Revoke object URL on cleanup
  useEffect(() => {
    return () => {
      if (videoSrc && !videoSrc.includes("youtube")) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

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

  // Resize drag handlers for video/editor split
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Console resize handlers
  const handleConsoleResizeMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingConsole(true);
    consoleStartYRef.current = e.clientY;
    consoleStartHeightRef.current = consoleHeight;
  };

  useEffect(() => {
    const handleConsoleResizeMouseMove = (e) => {
      if (!isDraggingConsole) return;
      const deltaY = consoleStartYRef.current - e.clientY;
      const newHeight = Math.min(500, Math.max(150, consoleStartHeightRef.current + deltaY));
      setConsoleHeight(newHeight);
    };

    const handleConsoleResizeMouseUp = () => {
      setIsDraggingConsole(false);
    };

    if (isDraggingConsole) {
      window.addEventListener("mousemove", handleConsoleResizeMouseMove);
      window.addEventListener("mouseup", handleConsoleResizeMouseUp);
    } else {
      window.removeEventListener("mousemove", handleConsoleResizeMouseMove);
      window.removeEventListener("mouseup", handleConsoleResizeMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleConsoleResizeMouseMove);
      window.removeEventListener("mouseup", handleConsoleResizeMouseUp);
    };
  }, [isDraggingConsole, consoleHeight]);

  // Clear editor markers
  const clearEditorMarkers = () => {
    if (monacoRef.current && editorRef.current) {
      monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), "owner", []);
    }
  };

  // Parse line number from error message
  const parseLineNumber = (errorMsg) => {
    const patterns = [
      /line (\d+)/i,
      /:(\d+):/,
      /\((\d+)\)/,
      /at line (\d+)/i,
    ];
    for (const pattern of patterns) {
      const match = errorMsg.match(pattern);
      if (match && match[1]) return parseInt(match[1], 10);
    }
    return null;
  };

  // Set error marker in editor and optionally jump to line
  const setErrorMarker = (lineNumber, errorMsg) => {
    if (!monacoRef.current || !editorRef.current || !lineNumber) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    const endLineNumber = lineNumber;
    const startColumn = 1;
    const endColumn = model.getLineMaxColumn(lineNumber);

    monacoRef.current.editor.setModelMarkers(model, "owner", [
      {
        severity: monacoRef.current.MarkerSeverity.Error,
        message: errorMsg,
        startLineNumber: lineNumber,
        startColumn,
        endLineNumber,
        endColumn,
      },
    ]);

    // Reveal the line
    editorRef.current.revealLineInCenter(lineNumber);
  };

  // Click handler for error line number
  const handleErrorLineClick = (lineNumber, errorMsg) => {
    if (lineNumber) {
      clearEditorMarkers();
      setErrorMarker(lineNumber, errorMsg);
      editorRef.current.focus();
    }
  };

  const handleResult = (result) => {
    console.log("FULL RESULT:", result);
    const statusId = result.status_id;

    // Clear previous outputs and markers
    setOutput("");
    setRuntimeError("");
    clearEditorMarkers();

    if (statusId === 6) {
      // Compilation Error
      const compileError = result.compile_output || "Compilation Error";
      setRuntimeError(compileError);
      console.error("Compilation Error:", compileError);
      setRunStatus("error");
      setHasNewError(true);
      setActiveTab("errors"); // Auto-switch to error tab

      // Try to parse line number and set marker
      const lineNum = parseLineNumber(compileError);
      if (lineNum) setErrorMarker(lineNum, compileError);
    } else if (statusId === 7 || statusId === 8 || statusId === 9) {
      // Runtime Error
      const runtimeErr = result.stderr || "Runtime Error";
      setRuntimeError(runtimeErr);
      console.error("Runtime Error:", runtimeErr);
      setRunStatus("error");
      setHasNewError(true);
      setActiveTab("errors"); // Auto-switch to error tab

      const lineNum = parseLineNumber(runtimeErr);
      if (lineNum) setErrorMarker(lineNum, runtimeErr);
    } else if (result.stdout) {
      // Success
      setOutput(result.stdout.trim());
      setRunStatus("success");
      setActiveTab("output"); // Auto-switch to output tab
      setHasNewError(false);
    } else if (result.stderr) {
      setRuntimeError(result.stderr);
      setRunStatus("error");
      setHasNewError(true);
      setActiveTab("errors");
      const lineNum = parseLineNumber(result.stderr);
      if (lineNum) setErrorMarker(lineNum, result.stderr);
    } else {
      setOutput("No output");
      setRunStatus("success");
      setActiveTab("output");
      setHasNewError(false);
    }

    setIsRunning(false);
    // Reset run status after 2 seconds
    setTimeout(() => setRunStatus(null), 2000);
  };

  const getResult = async (token) => {
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status_id,compile_output,message`;

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
      setRuntimeError("Execution timeout - code took too long to run");
      setRunStatus("error");
      setHasNewError(true);
      setActiveTab("errors");
      setIsRunning(false);
      setTimeout(() => setRunStatus(null), 2000);
    } catch (err) {
      console.error("Error fetching result:", err);
      setRuntimeError(`Error fetching result: ${err.message}`);
      setRunStatus("error");
      setHasNewError(true);
      setActiveTab("errors");
      setIsRunning(false);
      setTimeout(() => setRunStatus(null), 2000);
    }
  };

  const languageIdMap = {
    javascript: 63,
    python: 71,
    cpp: 54,
    csharp: 51,
  };

  const runCode = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setRunStatus("running");
    setOutput("");
    setRuntimeError("");
    setShowOutput(true);
    setHasNewError(false); // reset error indicator on new run
    clearEditorMarkers();

    if (language === "html") {
      renderLivePreview();
      setIsRunning(false);
      setOutput("HTML preview updated");
      setRunStatus("success");
      setActiveTab("output");
      setTimeout(() => setRunStatus(null), 2000);
      return;
    }

    if (!languageIdMap[language]) {
      setRuntimeError(`Language "${language}" is not supported for code execution`);
      setRunStatus("error");
      setHasNewError(true);
      setActiveTab("errors");
      setIsRunning(false);
      setTimeout(() => setRunStatus(null), 2000);
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
            stdin: input || "",
          }),
        }
      );

      const data = await res.json();

      if (!data.token) {
        throw new Error("No token received from Judge0");
      }

      getResult(data.token);
    } catch (err) {
      console.error("Error running code:", err);
      setRuntimeError(`Error running code: ${err.message}`);
      setRunStatus("error");
      setHasNewError(true);
      setActiveTab("errors");
      setIsRunning(false);
      setTimeout(() => setRunStatus(null), 2000);
    }
  };

  const renderLivePreview = () => {
    const iframe = document.getElementById("output-frame");
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();

    if (language === "html") {
      doc.write(code);
    } else if (language === "css") {
      doc.write(`<!DOCTYPE html>
<html>
<head><style>${code}</style></head>
<body><h1>CSS Preview</h1><p>Your CSS is applied to this content</p></body>
</html>`);
    }

    doc.close();
  };

  useEffect(() => {
    if (language === "html" || language === "css") {
      renderLivePreview();
    }
  }, [code, language]);

  // Monaco editor mount handler
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  // Clear console function (resets output & error, and clears indicator)
  const clearConsole = () => {
    setOutput("");
    setRuntimeError("");
    setHasNewError(false);
    setActiveTab("output");
  };

  // Get button text and icon based on status
  const getRunButtonContent = () => {
    if (runStatus === "running") {
      return {
        text: "Executing...",
        icon: <Loader className="animate-spin" size={18} />,
        disabled: true,
      };
    }
    if (runStatus === "success") {
      return {
        text: "Success",
        icon: <CheckCircle size={18} />,
        disabled: false,
      };
    }
    if (runStatus === "error") {
      return {
        text: "Failed",
        icon: <XCircle size={18} />,
        disabled: false,
      };
    }
    return {
      text: "Run Code",
      icon: <Play size={18} />,
      disabled: false,
    };
  };

  const { text: runButtonText, icon: runButtonIcon, disabled: runButtonDisabled } = getRunButtonContent();

  return (
    <div className="flex flex-col flex-1 bg-[#1b2b55] text-white z-50 ">
      {/* TOP BAR - unchanged */}
      <div className="pt-2 pb-2 px-4 min-h-16 flex flex-col md:flex-row md:items-center gap-3 bg-[#1b2b55] border-b border-white/10 justify-between">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:items-center w-full md:w-auto">
          <CustomSelect
            value={videoSourceOption}
            onChange={(e) => setVideoSourceOption(e.target.value)}
            className="w-full sm:w-auto"
          >
            <option value="" hidden>
              Select Video Source
            </option>
            <option value="youtube">YouTube URL</option>
            <option value="local">Local</option>
          </CustomSelect>

          {videoSourceOption === "youtube" && (
            <input
              type="text"
              placeholder="Paste YouTube URL..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="px-3 py-2 mt-2 rounded-xl font-medium bg-linear-to-r from-[#00ADB5] via-[#38bdf8] to-[#61DAFB] text-black shadow-md shadow-cyan-500/20"
            />
          )}

          {videoSourceOption === "local" && (
            <input
              type="file"
              accept="video/*"
              onChange={loadLocalVideo}
              className="w-full sm:w-auto text-sm text-gray-300 mt-2 file:px-3 file:py-2 file:rounded-xl file:font-medium file:border-0 file:bg-linear-to-r file:from-[#00ADB5] file:via-[#38bdf8] file:to-[#61DAFB] file:text-black file:shadow-md file:shadow-cyan-500/20 file:transition-all file:duration-300 file:ease-out hover:file:scale-105 hover:file:shadow-cyan-400/40 hover:file:brightness-110 active:file:scale-95 disabled:file:opacity-40 disabled:file:cursor-not-allowed"
            />
          )}
        </div>

        <div className="flex gap-4 items-center">
          <CustomSelect
            value={language}
            title="Select language"
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="html">HTML</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
          </CustomSelect>

          <CustomButton
            onClick={runCode}
            title="Run code"
            disabled={runButtonDisabled || !code}
            className={`${language === "html" ? "hidden" : ""} ${runStatus === "success"
              ? "bg-green-600 hover:bg-green-700"
              : runStatus === "error"
                ? "bg-red-600 hover:bg-red-700"
                : ""
              } transition-all duration-200`}
          >
            {runButtonIcon}
            {runButtonText}
          </CustomButton>

          <CustomButton
            disabled={!code}
            title="Clear code"
            onClick={() => setCode("")}
          >
            <Trash size={18} />
          </CustomButton>

          <CustomButton
            disabled={!code}
            title="Download code"
            onClick={async () => {
              const extensions = {
                javascript: "js",
                python: "py",
                cpp: "cpp",
                csharp: "cs",
                html: "html",
                css: "css",
              };

              const ext = extensions[language] || "txt";

              try {
                const handle = await window.showSaveFilePicker({
                  suggestedName: `code.${ext}`,
                  types: [
                    {
                      description: "Code File",
                      accept: {
                        "text/plain": [`.${ext}`],
                      },
                    },
                  ],
                });

                const writable = await handle.createWritable();
                await writable.write(code);
                await writable.close();
              } catch (err) {
                console.log("Save cancelled or not supported", err);
              }
            }}
          >
            <Download size={18} />
          </CustomButton>

          <CustomButton
            disabled={!code}
            title="Copy code"
            aria-label="Copy code to clipboard"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(code);
                alert("Code copied to clipboard!");
              } catch (err) {
                console.log("Copy failed", err);
              }
            }}
          >
            <Copy size={18} />
          </CustomButton>
        </div>
      </div>

      {/* RESIZABLE MAIN CONTENT */}
      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden  relative"
        style={{ cursor: isDragging ? "col-resize" : "default" }}
      >
        {/* LEFT: VIDEO PANEL */}
        <div
          className="bg-black min-w-0 flex lg:h-170.5 sm:h-211 items-center justify-center relative overflow-hidden"
          style={{ width: `${leftWidth}%` }}
        >
          {error && (
            <div className="absolute top-4 left-4 bg-red-500/80 text-white px-3 py-1 rounded-lg text-sm z-10">
              {error}
            </div>
          )}
          {videoSrc?.includes("youtube") ? (
            <div className="w-full h-full overflow-hidden">
              <iframe
                src={videoSrc}
                className={`w-full h-full ${isDragging ? "pointer-events-none" : ""
                  }`}
                allowFullScreen
                title="video"
              />
            </div>
          ) : videoSrc ? (
            <video src={videoSrc} controls className="w-full h-full object-contain" />
          ) : (
            /* Improved Empty State Card */
            <div className="max-w-md mx-4 p-6 bg-[#1b2b55] rounded-2xl shadow-2xl border border-white/10 text-center">
              <div className="text-6xl mb-4">🎥</div>
              <h3 className="text-xl font-bold mb-2">No Lesson Loaded</h3>
              <p className="text-gray-300 mb-4">Start by:</p>
              <ul className="text-left text-gray-300 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-[#00ADB5] font-bold">1.</span> Opening a Course
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00ADB5] font-bold">2.</span> Pasting a YouTube URL
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00ADB5] font-bold">3.</span> Uploading a Local Video
                </li>
              </ul>
              <CustomButton useFlex={false} onClick={() => navigate("/courses")}>
                Browse Courses
              </CustomButton>
            </div>
          )}
        </div>

        {/* DRAG HANDLE */}
        <div
          className="w-1.5 bg-[#00ADB5]/80 hover:bg-[#00ADB5] transition-colors cursor-col-resize active:bg-[#00ADB5] z-20"
          onMouseDown={handleMouseDown}
        />

        {/* RIGHT: EDITOR PANEL */}
        <div
          className="bg-[#0f1f3d] min-w-0 lg:h-170.5 sm:h-211"
          style={{
            flexBasis: `${100 - leftWidth}%`,
            flexShrink: 0,
          }}
        >
          <Editor
            height="100%"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              fontFamily: "Fira Code, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontLigatures: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
              wordWrap: "on",
            }}
          />
        </div>
      </div>

      {/* HTML output */}
      {language === "html" && (
        <div className="rounded bg-gray-400 p-1">
          <iframe
            id="output-frame"
            className="w-full h-270 bg-white p-0 m-0"
            title="output"
          />
        </div>
      )}

      {/* Add the following <style> for blinking dot animation */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .blinking-dot {
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          display: inline-block;
          animation: blink 1s ease-in-out infinite;
          margin-left: 6px;
        }
      `}</style>

      {/* ... existing top bar and main editor ... */}

      {/* OUTPUT CONSOLE (non-HTML languages) */}
      {language !== "html" && showOutput && (
        <div
          ref={outputRef}
          className="flex-shrink-0 bg-[#0f1f3d] border-t-2 border-[#00ADB5] flex flex-col"
          style={{ height: consoleHeight }}
        >
          {/* Resize handle */}
          <div
            className="h-2 bg-[#1b2b55] hover:bg-[#00ADB5]/50 cursor-row-resize flex items-center justify-center transition-colors"
            onMouseDown={handleConsoleResizeMouseDown}
          >
            <GripHorizontal size={16} className="text-gray-400" />
          </div>

          {/* Console Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#1b2b55] border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-[#00ADB5]" />
                <span className="font-semibold">Console</span>
              </div>
              {/* Tabs with optional error indicator */}
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("output")}
                  className={`px-3 py-1 rounded-md text-sm transition ${activeTab === "output"
                      ? "bg-[#00ADB5] text-white"
                      : "text-gray-300 hover:bg-white/10"
                    }`}
                >
                  Output
                </button>
                <button
                  onClick={() => {
                    setActiveTab("errors");
                    // Optional: mark error as "seen" when manually opening
                    setHasNewError(false);
                  }}
                  className={`px-3 py-1 rounded-md text-sm transition flex items-center gap-1 ${activeTab === "errors"
                      ? "bg-[#00ADB5] text-white"
                      : "text-gray-300 hover:bg-white/10"
                    }`}
                >
                  Errors
                  {hasNewError && runtimeError && (
                    <span className="blinking-dot" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Input Toggle Button */}
              <button
                onClick={() => setShowInput(!showInput)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition flex items-center gap-1 text-sm"
                title="Toggle input"
              >
                {showInput ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span className="hidden sm:inline">Input</span>
              </button>
              {/* Clear Console Button */}
              <button
                onClick={clearConsole}
                className="p-1.5 hover:bg-white/10 rounded-lg transition"
                title="Clear console"
              >
                <Trash size={16} />
              </button>
              {/* Close Button */}
              <button
                onClick={() => setShowOutput(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Collapsible Input Area */}
          {showInput && (
            <div className="px-4 py-2 border-b border-white/10 bg-[#1b2f4b]">
              <label className="text-sm text-gray-300 block mb-1">Program Input (stdin):</label>
              <textarea
                placeholder="Enter input here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-2 rounded bg-[#0f1f3d] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#00ADB5]"
                rows={2}
              />
            </div>
          )}

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === "output" && (
              <div className="bg-black/40 rounded-lg p-3 border border-white/10">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  {output || "Click 'Run Code' to see output..."}
                </pre>
              </div>
            )}

            {activeTab === "errors" && (
              <div className="bg-red-500/10 rounded-lg p-3 border-l-4 border-red-500">
                {runtimeError ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                      <div className="flex-1">
                        <p className="text-red-500 font-semibold mb-1">
                          {runtimeError.includes("Compilation") ? "Compilation Error" : "Runtime Error"}
                        </p>
                        <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                          {(() => {
                            const lineNum = parseLineNumber(runtimeError);
                            if (lineNum) {
                              const parts = runtimeError.split(/(line \d+)/i);
                              return parts.map((part, idx) => {
                                const match = part.match(/line (\d+)/i);
                                if (match) {
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => handleErrorLineClick(lineNum, runtimeError)}
                                      className="text-yellow-400 underline hover:text-yellow-300 font-bold"
                                    >
                                      {part}
                                    </button>
                                  );
                                }
                                return part;
                              });
                            }
                            return runtimeError;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No errors to display.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* loading overlay ... */}
    </div>
  );
};

export default CodingEditor;


// import React, { useState, useEffect, useRef } from "react";
// import Editor from "@monaco-editor/react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Play,
//   Copy,
//   Trash,
//   Download,
//   X,
//   Loader,
//   Terminal,
//   Loader2,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import CustomButton from "../components/EditorPageButton";
// import CustomSelect from "../components/EditorPageSelect";

// const CodingEditor = () => {
//   const navigate = useNavigate();
//   const { videoId } = useParams();
//   const [videoUrl, setVideoUrl] = useState("");
//   const [videoSrc, setVideoSrc] = useState("");
//   const [code, setCode] = useState("// Start coding here");
//   const [videoSourceOption, setVideoSourceOption] = useState("");
//   const [language, setLanguage] = useState("javascript");
//   const [error, setError] = useState("");
//   const debounceRef = useRef(null);
//   const [output, setOutput] = useState("");
//   const [runtimeError, setRuntimeError] = useState("");
//   const [input, setInput] = useState("");
//   const [isRunning, setIsRunning] = useState(false);
//   const [showOutput, setShowOutput] = useState(false);
//   const outputRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [runStatus, setRunStatus] = useState(null); // null, 'running', 'success', 'error'

//   // Resizable split state
//   const [leftWidth, setLeftWidth] = useState(50); // percentage
//   const [isDragging, setIsDragging] = useState(false);
//   const containerRef = useRef(null);

//   // Monaco editor refs for error markers
//   const editorRef = useRef(null);
//   const monacoRef = useRef(null);

//   useEffect(() => {
//     const templates = {
//       javascript: "// JS code here",
//       python: "# Python code here",
//       cpp: `#include <iostream>
// using namespace std;

// int main() {
//   cout << "Hello World!";
//   return 0;
// }`,
//       csharp: `using System;

// namespace HelloWorld
// {
//   class Program
//   {
//     static void Main(string[] args)
//     {
//       Console.WriteLine("Hello World!");
//     }
//   }
// }`,
//       html: `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Document</title>
// </head>
// <body>
//     <h1>Hello World!</h1>
// </body>
// </html>`,
//     };

//     setCode(templates[language] || "");
//   }, [language]);

//   // Extract YouTube ID
//   const extractYoutubeId = (url) => {
//     const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/;
//     const match = url.match(regExp);
//     return match ? match[1] : null;
//   };

//   // Load saved code
//   useEffect(() => {
//     if (videoId) {
//       const savedCode = localStorage.getItem(`code-${videoId}`);
//       if (savedCode) setCode(savedCode);
//     }
//   }, [videoId]);

//   // Save code
//   useEffect(() => {
//     if (videoId) localStorage.setItem(`code-${videoId}`, code);
//   }, [code, videoId]);

//   // Load video
//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);

//     debounceRef.current = setTimeout(() => {
//       setError("");

//       if (videoSourceOption === "youtube" && videoUrl) {
//         const id = extractYoutubeId(videoUrl);
//         if (id) {
//           setVideoSrc(`https://www.youtube.com/embed/${id}`);
//         } else {
//           setVideoSrc("");
//           setError("Invalid YouTube URL");
//         }
//       } else if (videoSourceOption === "local") {
//         // handled separately
//       } else if (videoId) {
//         setVideoSrc(`https://www.youtube.com/embed/${videoId}`);
//       }
//     }, 500);

//     return () => clearTimeout(debounceRef.current);
//   }, [videoId, videoUrl, videoSourceOption]);

//   // Revoke object URL on cleanup
//   useEffect(() => {
//     return () => {
//       if (videoSrc && !videoSrc.includes("youtube")) {
//         URL.revokeObjectURL(videoSrc);
//       }
//     };
//   }, [videoSrc]);

//   const loadLocalVideo = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const url = URL.createObjectURL(file);
//     setVideoSrc(url);
//   };

//   // Scroll to output when shown
//   useEffect(() => {
//     if (showOutput && outputRef.current) {
//       outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   }, [showOutput]);

//   // Resize drag handlers
//   const handleMouseDown = () => {
//     setIsDragging(true);
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging || !containerRef.current) return;
//     const containerRect = containerRef.current.getBoundingClientRect();
//     const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
//     if (newLeftWidth >= 20 && newLeftWidth <= 80) {
//       setLeftWidth(newLeftWidth);
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   useEffect(() => {
//     if (isDragging) {
//       window.addEventListener("mousemove", handleMouseMove);
//       window.addEventListener("mouseup", handleMouseUp);
//     } else {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     }
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging]);

//   // Clear editor markers
//   const clearEditorMarkers = () => {
//     if (monacoRef.current && editorRef.current) {
//       monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), "owner", []);
//     }
//   };

//   // Parse line number from error message
//   const parseLineNumber = (errorMsg) => {
//     const patterns = [
//       /line (\d+)/i,
//       /:(\d+):/,
//       /\((\d+)\)/,
//       /at line (\d+)/i,
//     ];
//     for (const pattern of patterns) {
//       const match = errorMsg.match(pattern);
//       if (match && match[1]) return parseInt(match[1], 10);
//     }
//     return null;
//   };

//   // Set error marker in editor
//   const setErrorMarker = (lineNumber, errorMsg) => {
//     if (!monacoRef.current || !editorRef.current || !lineNumber) return;

//     const model = editorRef.current.getModel();
//     if (!model) return;

//     const endLineNumber = lineNumber;
//     const startColumn = 1;
//     const endColumn = model.getLineMaxColumn(lineNumber);

//     monacoRef.current.editor.setModelMarkers(model, "owner", [
//       {
//         severity: monacoRef.current.MarkerSeverity.Error,
//         message: errorMsg,
//         startLineNumber: lineNumber,
//         startColumn,
//         endLineNumber,
//         endColumn,
//       },
//     ]);

//     // Reveal the line
//     editorRef.current.revealLineInCenter(lineNumber);
//   };

//   const handleResult = (result) => {
//     console.log("FULL RESULT:", result);
//     const statusId = result.status_id;

//     // Clear previous outputs and markers
//     setOutput("");
//     setRuntimeError("");
//     clearEditorMarkers();

//     if (statusId === 6) {
//       // Compilation Error
//       const compileError = result.compile_output || "Compilation Error";
//       setRuntimeError(compileError);
//       console.error("Compilation Error:", compileError);
//       setRunStatus("error");

//       // Try to parse line number and set marker
//       const lineNum = parseLineNumber(compileError);
//       if (lineNum) setErrorMarker(lineNum, compileError);
//     } else if (statusId === 7 || statusId === 8 || statusId === 9) {
//       // Runtime Error
//       const runtimeErr = result.stderr || "Runtime Error";
//       setRuntimeError(runtimeErr);
//       console.error("Runtime Error:", runtimeErr);
//       setRunStatus("error");

//       const lineNum = parseLineNumber(runtimeErr);
//       if (lineNum) setErrorMarker(lineNum, runtimeErr);
//     } else if (result.stdout) {
//       // Success
//       setOutput(result.stdout.trim());
//       setRunStatus("success");
//     } else if (result.stderr) {
//       setRuntimeError(result.stderr);
//       setRunStatus("error");
//       const lineNum = parseLineNumber(result.stderr);
//       if (lineNum) setErrorMarker(lineNum, result.stderr);
//     } else {
//       setOutput("No output");
//       setRunStatus("success");
//     }

//     setIsRunning(false);
//     // Reset run status after 2 seconds
//     setTimeout(() => setRunStatus(null), 2000);
//   };

//   const getResult = async (token) => {
//     const url = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=stdout,stderr,status_id,compile_output,message`;

//     try {
//       for (let i = 0; i < 10; i++) {
//         const res = await fetch(url, {
//           headers: {
//             "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
//             "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//           },
//         });

//         const result = await res.json();

//         if (result.status_id === 1 || result.status_id === 2) {
//           await new Promise((r) => setTimeout(r, 1000));
//         } else {
//           handleResult(result);
//           return;
//         }
//       }
//       setRuntimeError("Execution timeout - code took too long to run");
//       setRunStatus("error");
//       setIsRunning(false);
//       setTimeout(() => setRunStatus(null), 2000);
//     } catch (err) {
//       console.error("Error fetching result:", err);
//       setRuntimeError(`Error fetching result: ${err.message}`);
//       setRunStatus("error");
//       setIsRunning(false);
//       setTimeout(() => setRunStatus(null), 2000);
//     }
//   };

//   const languageIdMap = {
//     javascript: 63,
//     python: 71,
//     cpp: 54,
//     csharp: 51,
//   };

//   const runCode = async () => {
//     if (isRunning) return;

//     setIsRunning(true);
//     setRunStatus("running");
//     setOutput("");
//     setRuntimeError("");
//     setShowOutput(true);
//     clearEditorMarkers();

//     if (language === "html") {
//       renderLivePreview();
//       setIsRunning(false);
//       setOutput("HTML preview updated");
//       setRunStatus("success");
//       setTimeout(() => setRunStatus(null), 2000);
//       return;
//     }

//     if (!languageIdMap[language]) {
//       setRuntimeError(`Language "${language}" is not supported for code execution`);
//       setRunStatus("error");
//       setIsRunning(false);
//       setTimeout(() => setRunStatus(null), 2000);
//       return;
//     }

//     try {
//       const res = await fetch(
//         "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
//             "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//           },
//           body: JSON.stringify({
//             source_code: code,
//             language_id: languageIdMap[language],
//             stdin: input || "",
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!data.token) {
//         throw new Error("No token received from Judge0");
//       }

//       getResult(data.token);
//     } catch (err) {
//       console.error("Error running code:", err);
//       setRuntimeError(`Error running code: ${err.message}`);
//       setRunStatus("error");
//       setIsRunning(false);
//       setTimeout(() => setRunStatus(null), 2000);
//     }
//   };

//   const renderLivePreview = () => {
//     const iframe = document.getElementById("output-frame");
//     if (!iframe) return;

//     const doc = iframe.contentDocument || iframe.contentWindow.document;
//     doc.open();

//     if (language === "html") {
//       doc.write(code);
//     } else if (language === "css") {
//       doc.write(`<!DOCTYPE html>
// <html>
// <head><style>${code}</style></head>
// <body><h1>CSS Preview</h1><p>Your CSS is applied to this content</p></body>
// </html>`);
//     }

//     doc.close();
//   };

//   useEffect(() => {
//     if (language === "html" || language === "css") {
//       renderLivePreview();
//     }
//   }, [code, language]);

//   // Monaco editor mount handler
//   const handleEditorDidMount = (editor, monaco) => {
//     editorRef.current = editor;
//     monacoRef.current = monaco;
//   };

//   // Get button text and icon based on status
//   const getRunButtonContent = () => {
//     if (runStatus === "running") {
//       return {
//         text: "Executing...",
//         icon: <Loader className="animate-spin" size={18} />,
//         disabled: true,
//       };
//     }
//     if (runStatus === "success") {
//       return {
//         text: "Success",
//         icon: <CheckCircle size={18} />,
//         disabled: false,
//       };
//     }
//     if (runStatus === "error") {
//       return {
//         text: "Failed",
//         icon: <XCircle size={18} />,
//         disabled: false,
//       };
//     }
//     return {
//       text: "Run Code",
//       icon: <Play size={18} />,
//       disabled: false,
//     };
//   };

//   const { text: runButtonText, icon: runButtonIcon, disabled: runButtonDisabled } = getRunButtonContent();

//   return (
//     <div className="flex flex-col flex-1 bg-[#1b2b55] text-white z-50">
//       {/* TOP BAR */}
//       <div className="pt-2 pb-2 px-4 min-h-16 flex flex-col md:flex-row md:items-center gap-3 bg-[#1b2b55] border-b border-white/10 justify-between">
//         <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:items-center w-full md:w-auto">
//           <CustomSelect
//             value={videoSourceOption}
//             onChange={(e) => setVideoSourceOption(e.target.value)}
//             className="w-full sm:w-auto"
//           >
//             <option value="" hidden>
//               Select Video Source
//             </option>
//             <option value="youtube">YouTube URL</option>
//             <option value="local">Local</option>
//           </CustomSelect>

//           {videoSourceOption === "youtube" && (
//             <input
//               type="text"
//               placeholder="Paste YouTube URL..."
//               value={videoUrl}
//               onChange={(e) => setVideoUrl(e.target.value)}
//               className="px-3 py-2 mt-2 rounded-xl font-medium bg-linear-to-r from-[#00ADB5] via-[#38bdf8] to-[#61DAFB] text-black shadow-md shadow-cyan-500/20"
//             />
//           )}

//           {videoSourceOption === "local" && (
//             <input
//               type="file"
//               accept="video/*"
//               onChange={loadLocalVideo}
//               className="w-full sm:w-auto text-sm text-gray-300 mt-2 file:px-3 file:py-2 file:rounded-xl file:font-medium file:border-0 file:bg-linear-to-r file:from-[#00ADB5] file:via-[#38bdf8] file:to-[#61DAFB] file:text-black file:shadow-md file:shadow-cyan-500/20 file:transition-all file:duration-300 file:ease-out hover:file:scale-105 hover:file:shadow-cyan-400/40 hover:file:brightness-110 active:file:scale-95 disabled:file:opacity-40 disabled:file:cursor-not-allowed"
//             />
//           )}
//         </div>

//         <div className="flex gap-4 items-center">
//           <CustomSelect
//             value={language}
//             title = "Select language"
//             onChange={(e) => setLanguage(e.target.value)}
//           >
//             <option value="html">HTML</option>
//             <option value="javascript">JavaScript</option>
//             <option value="python">Python</option>
//             <option value="cpp">C++</option>
//             <option value="csharp">C#</option>
//           </CustomSelect>

//           <CustomButton
//             onClick={runCode}
//             title="Run code"
//             disabled={runButtonDisabled || !code}
//             className={`${language === "html" ? "hidden" : ""} ${runStatus === "success"
//               ? "bg-green-600 hover:bg-green-700"
//               : runStatus === "error"
//                 ? "bg-red-600 hover:bg-red-700"
//                 : ""
//               } transition-all duration-200`}
//           >
//             {runButtonIcon}
//             {runButtonText}
//           </CustomButton>

//           <CustomButton
//           disabled={!code}
//           title="Clear code"
//           onClick={() => setCode("")}
//           >
//             <Trash size={18} />
//           </CustomButton>

//           <CustomButton
//             disabled={!code}
//             title="Download code"
//             onClick={async () => {
//               const extensions = {
//                 javascript: "js",
//                 python: "py",
//                 cpp: "cpp",
//                 csharp: "cs",
//                 html: "html",
//                 css: "css",
//               };

//               const ext = extensions[language] || "txt";

//               try {
//                 const handle = await window.showSaveFilePicker({
//                   suggestedName: `code.${ext}`,
//                   types: [
//                     {
//                       description: "Code File",
//                       accept: {
//                         "text/plain": [`.${ext}`],
//                       },
//                     },
//                   ],
//                 });

//                 const writable = await handle.createWritable();
//                 await writable.write(code);
//                 await writable.close();
//               } catch (err) {
//                 console.log("Save cancelled or not supported", err);
//               }
//             }}
//           >
//             <Download size={18} />
//           </CustomButton>

//           <CustomButton
//             disabled={!code}
//             title="Copy code"
//             aria-label="Copy code to clipboard"
//             onClick={async () => {
//               try {
//                 await navigator.clipboard.writeText(code);
//                 alert("Code copied to clipboard!");
//               } catch (err) {
//                 console.log("Copy failed", err);
//               }
//             }}
//           >
//             <Copy size={18} />
//           </CustomButton>
//         </div>
//       </div>

//       {/* RESIZABLE MAIN CONTENT */}
//       <div
//         ref={containerRef}
//         className="flex flex-1 overflow-hidden  relative"
//         style={{ cursor: isDragging ? "col-resize" : "default" }}
//       >
//         {/* LEFT: VIDEO PANEL */}
//         <div
//           className="bg-black min-w-0 flex lg:h-170.5 sm:h-211 items-center justify-center relative overflow-hidden"
//           style={{ width: `${leftWidth}%` }}
//         >
//           {error && (
//             <div className="absolute top-4 left-4 bg-red-500/80 text-white px-3 py-1 rounded-lg text-sm z-10">
//               {error}
//             </div>
//           )}
//           {videoSrc?.includes("youtube") ? (
//             <div className="w-full h-full overflow-hidden">
//               <iframe
//                 src={videoSrc}
//                 className={`w-full h-full ${isDragging ? "pointer-events-none" : ""
//                   }`}
//                 allowFullScreen
//                 title="video"
//               />
//             </div>
//           ) : videoSrc ? (
//             <video src={videoSrc} controls className="w-full h-full object-contain" />
//           ) : (
//             /* Improved Empty State Card */
//             <div className="max-w-md mx-4 p-6 bg-[#1b2b55] rounded-2xl shadow-2xl border border-white/10 text-center">
//               <div className="text-6xl mb-4">🎥</div>
//               <h3 className="text-xl font-bold mb-2">No Lesson Loaded</h3>
//               <p className="text-gray-300 mb-4">Start by:</p>
//               <ul className="text-left text-gray-300 space-y-2 mb-6">
//                 <li className="flex items-center gap-2">
//                   <span className="text-[#00ADB5] font-bold">1.</span> Opening a Course
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <span className="text-[#00ADB5] font-bold">2.</span> Pasting a YouTube URL
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <span className="text-[#00ADB5] font-bold">3.</span> Uploading a Local Video
//                 </li>
//               </ul>
//               <CustomButton useFlex={false} onClick={() => navigate("/courses")}>
//                 Browse Courses
//               </CustomButton>
//             </div>
//           )}
//         </div>

//         {/* DRAG HANDLE */}
//         <div
//           className="w-1.5 bg-[#00ADB5]/80 hover:bg-[#00ADB5] transition-colors cursor-col-resize active:bg-[#00ADB5] z-20"
//           onMouseDown={handleMouseDown}
//         />

//         {/* RIGHT: EDITOR PANEL */}
//         <div
//           className="bg-[#0f1f3d] min-w-0 lg:h-170.5 sm:h-211"
//           style={{
//             flexBasis: `${100 - leftWidth}%`,
//             flexShrink: 0,
//           }}
//         >
//           <Editor
//             height="100%"
//             language={language}
//             value={code}
//             theme="vs-dark"
//             onChange={(value) => setCode(value || "")}
//             onMount={handleEditorDidMount}
//             options={{
//               fontSize: 14,
//               fontFamily: "Fira Code, monospace",
//               minimap: { enabled: false },
//               scrollBeyondLastLine: false,
//               fontLigatures: true,
//               cursorBlinking: "smooth",
//               smoothScrolling: true,
//               wordWrap: "on",
//             }}
//           />
//         </div>
//       </div>

//       {/* HTML output */}
//       {language === "html" && (
//         <div className="rounded bg-gray-400 p-1">
//           <iframe
//             id="output-frame"
//             className="w-full h-270 bg-white p-0 m-0"
//             title="output"
//           />
//         </div>
//       )}

//       {/* FLOATING OUTPUT PANEL */}
//       {language !== "html" && showOutput && (
//         <div
//           ref={outputRef}
//           className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f1f3d] border-t-2 border-[#00ADB5] shadow-2xl"
//           style={{ animation: "slideUp 0.3s ease-out" }}
//         >
//           <div className="flex items-center justify-between px-4 py-2 bg-[#1b2b55] border-b border-white/10">
//             <div className="flex items-center gap-2">
//               <Terminal size={18} className="text-[#00ADB5]" />
//               <span className="font-semibold">Output Console</span>
//               {isRunning && (
//                 <span className="text-xs text-yellow-400 flex items-center gap-1">
//                   <Loader size={12} className="animate-spin" />
//                   Executing...
//                 </span>
//               )}
//             </div>
//             <button
//               onClick={() => setShowOutput(false)}
//               className="p-1 hover:bg-white/10 rounded-lg transition"
//             >
//               <X size={18} />
//             </button>
//           </div>

//           <div className="p-4 max-h-64 overflow-auto">
//             <div className="mb-3">
//               <label className="text-sm text-gray-300 block mb-1">
//                 Program Input (stdin):
//               </label>
//               <textarea
//                 placeholder="Enter input here..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 className="w-full p-2 rounded bg-[#1b2f4b] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#00ADB5]"
//                 rows={2}
//               />
//             </div>

//             <div className="bg-black/40 rounded-lg p-3 border border-white/10">
//               <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
//                 {output || "Click 'Run Code' to see output..."}
//               </pre>
//             </div>

//             {runtimeError && (
//               <div className="mt-3 bg-red-500/10 rounded-lg p-3 border-l-4 border-red-500">
//                 <div className="flex items-start gap-2">
//                   <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
//                   <div className="flex-1">
//                     <p className="text-red-500 font-semibold mb-1">
//                       {runtimeError.includes("Compilation") ? "Compilation Error" : "Runtime Error"}
//                     </p>
//                     <pre className="text-red-400 font-mono text-sm whitespace-pre-wrap">
//                       {runtimeError}
//                     </pre>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="h-1 w-full bg-linear-to-r from-[#00ADB5] to-transparent"></div>
//         </div>
//       )}

//       {loading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//           <div className="text-center">
//             <Loader2 className="w-12 h-12 text-[#00ADB5] animate-spin mx-auto mb-4" />
//             <p className="text-gray-200">Loading Editor...</p>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default CodingEditor;