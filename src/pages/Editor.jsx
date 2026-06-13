import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Copy, Trash, Download, X, Loader, Terminal, Loader2 } from "lucide-react";
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

  // ✅ Prevent memory leak (revoke object URL)
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

  // ✅ Fixed handleResult to properly show all errors
  const handleResult = (result) => {
    console.log("FULL RESULT:", result);

    const statusId = result.status_id;

    // Clear previous outputs
    setOutput("");
    setRuntimeError("");

    // Handle different status codes
    if (statusId === 6) {
      // Compilation Error
      const compileError = result.compile_output || "Compilation Error";
      setRuntimeError(compileError);
      console.error("Compilation Error:", compileError);
    }
    else if (statusId === 7 || statusId === 8 || statusId === 9) {
      // Runtime Error
      const runtimeErr = result.stderr || "Runtime Error";
      setRuntimeError(runtimeErr);
      console.error("Runtime Error:", runtimeErr);
    }
    else if (result.stdout) {
      // Success - show output
      setOutput(result.stdout.trim());
    }
    else if (result.stderr) {
      // Error output
      setRuntimeError(result.stderr);
    }
    else {
      setOutput("No output");
    }

    setIsRunning(false);
  };

  // ✅ Fixed getResult with proper error handling
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
      // ✅ Fixed: result is defined here
      setRuntimeError("Execution timeout - code took too long to run");
      setIsRunning(false);
    } catch (err) {
      console.error("Error fetching result:", err);
      setRuntimeError(`Error fetching result: ${err.message}`);
      setIsRunning(false);
    }
  };

  // ✅ Fixed language ID mapping
  const languageIdMap = {
    javascript: 63,
    python: 71,
    cpp: 54,
    csharp: 51,
    // HTML is handled separately
  };

  // RUN CODE HANDLER with loading & output panel
  const runCode = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput("");
    setRuntimeError("");
    setShowOutput(true);

    // ✅ HTML special case
    if (language === "html") {
      renderLivePreview();
      setIsRunning(false);
      setOutput("HTML preview updated");
      return;
    }

    // ✅ Check if language has valid Judge0 ID
    if (!languageIdMap[language]) {
      setRuntimeError(`Language "${language}" is not supported for code execution`);
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
            stdin: input || "", // Ensure stdin is not undefined
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
      setIsRunning(false);
    }
  };

  // Watch HTML/CSS live preview
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

  return (
    <div className="flex flex-col flex-1 bg-[#1b2b55] text-white z-50">
      {/* TOP BAR */}
      <div className="pt-2 pb-2 px-4 min-h-16 flex flex-col md:flex-row md:items-center gap-3 bg-[#1b2b55] border-b border-white/10 justify-between">
        {/* Left side: video source inputs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:items-center w-full md:w-auto">
          <CustomSelect
            value={videoSourceOption}
            onChange={(e) => setVideoSourceOption(e.target.value)}
            className="w-full sm:w-auto"
          >
            <option value="" hidden>Select Video Source</option>
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

        {/* Right side: language selector + run button */}
        <div className="flex gap-4 items-center">
          <CustomSelect
            value={language}
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
            disabled={isRunning || !code}
            className={language === "html" ? "hidden" : ""}
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
          </CustomButton>

          <CustomButton onClick={() => setCode("")} disabled={!code}>
            <Trash size={18} />
          </CustomButton>

          <CustomButton
            disabled={!code}
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

      {/* MAIN CONTENT: Video + Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: VIDEO */}
        <div className="w-1/2 lg:h-170.5 sm:h-211 bg-black flex items-center justify-center relative">
          {error && (
            <div className="absolute top-4 left-4 bg-red-500/80 text-white px-3 py-1 rounded-lg text-sm z-10">
              {error}
            </div>
          )}
          {videoSrc?.includes("youtube") ? (
            <iframe
              src={videoSrc}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              title="video"
            />
          ) : videoSrc ? (
            <video src={videoSrc} controls className="w-full h-full object-contain" />
          ) : (
            <div className="text-gray-500 text-center">
              <Terminal size={48} className="mx-auto mb-2 opacity-50" />
              <p>No video selected</p>
              <p className="text-sm mb-1.5">Choose a video source above or select one from Courses</p>
              <CustomButton useFlex={false} onClick={() => navigate("/courses")}>
                Go to Courses
              </CustomButton>
            </div>
          )}
        </div>

        {/* RIGHT: EDITOR */}
        <div className="w-1/2 lg:h-170.5 sm:h-211 bg-[#0f1f3d]">
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

      {/* Error display for non-HTML languages */}
      {language !== "html" && runtimeError && (
        <div className="rounded bg-gray-400 p-1">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
              {runtimeError}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING OUTPUT PANEL */}
      {language !== "html" && showOutput && (
        <div
          ref={outputRef}
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f1f3d] border-t-2 border-[#00ADB5] shadow-2xl"
          style={{ animation: "slideUp 0.3s ease-out" }}
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
            <button onClick={() => setShowOutput(false)} className="p-1 hover:bg-white/10 rounded-lg transition">
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
            <div className="bg-black/40 rounded-lg p-3 border border-white/10">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                {output || "Click 'Run' to see output..."}
              </pre>
            </div>
            
            {/* Error display in output panel */}
            {runtimeError && (
              <div className="mt-3 bg-red-500/20 rounded-lg p-3 border border-red-500/30">
                <pre className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                  {runtimeError}
                </pre>
              </div>
            )}
          </div>
          
          <div className="h-1 w-full bg-linear-to-r from-[#00ADB5] to-transparent"></div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#00ADB5] animate-spin mx-auto mb-4" />
            <p className="text-gray-200">Loading Editor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingEditor;

// import React, { useState, useEffect, useRef } from "react";
// import Editor from "@monaco-editor/react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Play, Copy, Trash, Download, X, Loader, Terminal, Loader2 } from "lucide-react"; // ✅ Added Loader2
// import CustomButton from "../components/EditorPageButton";
// import CustomSelect from "../components/EditorPageSelect";
// // 
// // 
// // 
// // 

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

// // 
// // 
// // 
// // 
// //   

// const [panelHeight, setPanelHeight] = useState(300);
// const [activeTab, setActiveTab] = useState("output");
// const [followOutput, setFollowOutput] = useState(true);
// const [isResizing, setIsResizing] = useState(false);
// const startResize = () => {
//   setIsResizing(true);
// };

// const stopResize = () => {
//   setIsResizing(false);
// };

// const resize = (e) => {
//   if (!isResizing) return;
//   const newHeight = window.innerHeight - e.clientY;
//   if (newHeight > 150 && newHeight < 600) {
//     setPanelHeight(newHeight);
//   }
// };
// useEffect(() => {
//   window.addEventListener("mousemove", resize);
//   window.addEventListener("mouseup", stopResize);

//   return () => {
//     window.removeEventListener("mousemove", resize);
//     window.removeEventListener("mouseup", stopResize);
//   };
// }, [isResizing]);


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

//   // ✅ Prevent memory leak (revoke object URL)
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

//   // ✅ Fixed handleResult to properly show all errors
//   const handleResult = (result) => {
//     console.log("FULL RESULT:", result);

//     const statusId = result.status_id;

//     // Clear previous outputs
//     setOutput("");
//     setRuntimeError("");

//     // Handle different status codes
//     if (statusId === 6) {
//       // Compilation Error
//       const compileError = result.compile_output || "Compilation Error";
//       setRuntimeError(compileError);
//       console.error("Compilation Error:", compileError);
//     }
//     else if (statusId === 7 || statusId === 8 || statusId === 9) {
//       // Runtime Error
//       const runtimeErr = result.stderr || "Runtime Error";
//       setRuntimeError(runtimeErr);
//       console.error("Runtime Error:", runtimeErr);
//     }
//     else if (result.stdout) {
//       // Success - show output
//       setOutput(result.stdout.trim());
//     }
//     else if (result.stderr) {
//       // Error output
//       setRuntimeError(result.stderr);
//     }
//     else {
//       setOutput("No output");
//     }

//     setIsRunning(false);
//   };

//   // ✅ Fixed getResult with proper error handling
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
//       // ✅ Fixed: result is defined here
//       setRuntimeError("Execution timeout - code took too long to run");
//       setIsRunning(false);
//     } catch (err) {
//       console.error("Error fetching result:", err);
//       setRuntimeError(`Error fetching result: ${err.message}`);
//       setIsRunning(false);
//     }
//   };

//   // ✅ Fixed language ID mapping
//   const languageIdMap = {
//     javascript: 63,
//     python: 71,
//     cpp: 54,
//     csharp: 51,
//     // HTML is handled separately
//   };

//   // RUN CODE HANDLER with loading & output panel
//   const runCode = async () => {
//     if (isRunning) return;

//     setIsRunning(true);
//     setOutput("");
//     setRuntimeError("");
//     setShowOutput(true);

//     // ✅ HTML special case
//     if (language === "html") {
//       renderLivePreview();
//       setIsRunning(false);
//       setOutput("HTML preview updated");
//       return;
//     }

//     // ✅ Check if language has valid Judge0 ID
//     if (!languageIdMap[language]) {
//       setRuntimeError(`Language "${language}" is not supported for code execution`);
//       setIsRunning(false);
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
//             stdin: input || "", // Ensure stdin is not undefined
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
//       setIsRunning(false);
//     }
//   };

//   // Watch HTML/CSS live preview
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

//   return (
//     <div className="flex flex-col flex-1 bg-[#1b2b55] text-white z-50">
//       {/* TOP BAR */}
//       <div className="pt-2 pb-2 px-4 min-h-16 flex flex-col md:flex-row md:items-center gap-3 bg-[#1b2b55] border-b border-white/10 justify-between">
//         {/* Left side: video source inputs */}
//         <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:items-center w-full md:w-auto">
//           <CustomSelect
//             value={videoSourceOption}
//             onChange={(e) => setVideoSourceOption(e.target.value)}
//             className="w-full sm:w-auto"
//           >
//             <option value="" hidden>Select Video Source</option>
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

//         {/* Right side: language selector + run button */}
//         <div className="flex gap-4 items-center">
//           <CustomSelect
//             value={language}
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
//             disabled={isRunning || !code}
//             className={language === "html" ? "hidden" : ""}
//           >
//             {isRunning ? (
//               <>
//                 <Loader className="animate-spin" size={18} />
//                 Running...
//               </>
//             ) : (
//               <>
//                 <Play size={18} />
//                 Run
//               </>
//             )}
//           </CustomButton>

//           <CustomButton onClick={() => setCode("")} disabled={!code}>
//             <Trash size={18} />
//           </CustomButton>

//           <CustomButton
//             disabled={!code}
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

//       {/* MAIN CONTENT: Video + Editor */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* LEFT: VIDEO */}
//         <div className="w-1/2 lg:h-170.5 sm:h-211 bg-black flex items-center justify-center relative">
//           {error && (
//             <div className="absolute top-4 left-4 bg-red-500/80 text-white px-3 py-1 rounded-lg text-sm z-10">
//               {error}
//             </div>
//           )}
//           {videoSrc?.includes("youtube") ? (
//             <iframe
//               src={videoSrc}
//               className="w-full h-full"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               referrerPolicy="strict-origin-when-cross-origin"
//               allowFullScreen
//               title="video"
//             />
//           ) : videoSrc ? (
//             <video src={videoSrc} controls className="w-full h-full object-contain" />
//           ) : (
//             <div className="text-gray-500 text-center">
//               <Terminal size={48} className="mx-auto mb-2 opacity-50" />
//               <p>No video selected</p>
//               <p className="text-sm mb-1.5">Choose a video source above or select one from Courses</p>
//               <CustomButton useFlex={false} onClick={() => navigate("/courses")}>
//                 Go to Courses
//               </CustomButton>
//             </div>
//           )}
//         </div>

//         {/* RIGHT: EDITOR */}
//         <div className="w-1/2 lg:h-170.5 sm:h-211 bg-[#0f1f3d]">
//           <Editor
//             height="100%"
//             language={language}
//             value={code}
//             theme="vs-dark"
//             onChange={(value) => setCode(value || "")}
//             options={{
//               fontSize: 14,
//               fontFamily: "Fira Code, monospace",
//               minimap: { enabled: false },
//               scrollBeyondLastLine: false,
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

//       {/* Error display for non-HTML languages */}
//       {language !== "html" && runtimeError && (
//         <div className="rounded bg-gray-400 p-1">
//           <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
//             <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
//               {runtimeError}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* FLOATING OUTPUT PANEL */}
//       {/* FLOATING OUTPUT PANEL (Terminal Style) */}
//       {language !== "html" && showOutput && (
//   <div
//     ref={outputRef}
//     className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1c] border-t border-[#00ADB5] shadow-2xl font-mono"
//     style={{ height: panelHeight }}
//   >
//     {/* 🔼 Resize Handle */}
//     <div
//       onMouseDown={startResize}
//       className="h-2 cursor-ns-resize bg-[#00ADB5]/30 hover:bg-[#00ADB5]/60 transition"
//     />

//     {/* HEADER */}
//     <div className="flex items-center justify-between px-3 py-2 bg-[#1b2b55] border-b border-white/10">
      
//       {/* Tabs */}
//       <div className="flex gap-3 text-sm">
//         {["output", "errors", "input"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`capitalize px-2 py-1 rounded ${
//               activeTab === tab
//                 ? "bg-[#00ADB5] text-black"
//                 : "text-gray-300 hover:bg-white/10"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-2">
        
//         {/* Follow toggle */}
//         <button
//           onClick={() => setFollowOutput(!followOutput)}
//           className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20"
//         >
//           {followOutput ? "Follow ON" : "Follow OFF"}
//         </button>

//         {/* Clear */}
//         <button
//           onClick={() => {
//             setOutput("");
//             setRuntimeError("");
//             setInput("");
//           }}
//           className="text-xs px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/40"
//         >
//           Clear
//         </button>

//         {/* Close */}
//         <button
//           onClick={() => setShowOutput(false)}
//           className="p-1 hover:bg-white/10 rounded"
//         >
//           ✕
//         </button>
//       </div>
//     </div>

//     {/* BODY */}
//     <div className="p-3 h-full overflow-auto bg-black/80">
      
//       {/* OUTPUT TAB */}
//       {activeTab === "output" && (
//         <pre className="text-green-400 text-sm whitespace-pre-wrap">
//           {output || "No output yet..."}
//         </pre>
//       )}

//       {/* ERROR TAB */}
//       {activeTab === "errors" && (
//         <pre className="text-red-400 text-sm whitespace-pre-wrap">
//           {runtimeError || "No errors"}
//         </pre>
//       )}

//       {/* INPUT TAB */}
//       {activeTab === "input" && (
//         <div className="flex flex-col gap-2">
//           <textarea
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             className="w-full bg-[#111827] border border-white/10 p-2 text-white text-sm rounded"
//             rows={4}
//             placeholder="Enter stdin input..."
//             onKeyDown={(e) => {
//               if (e.ctrlKey && e.key === "Enter") {
//                 runCode();
//               }
//             }}
//           />

//           <CustomButton onClick={runCode}>
//             ▶ Run with Input
//           </CustomButton>
//         </div>
//       )}
//     </div>

//     {/* STATUS BAR */}
//     <div className="h-1 bg-gradient-to-r from-[#00ADB5] to-transparent" />
//   </div>
// )}

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