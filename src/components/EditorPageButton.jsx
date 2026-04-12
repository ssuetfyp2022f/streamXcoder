export default function EditorPageButton({ children, className = "", useFlex = true, ...props }) {
  return (
    <button
      {...props}
      className={`
        px-3 py-2 mt-2 rounded-xl font-medium 
        ${useFlex ? "flex items-center gap-2" : ""}
        bg-linear-to-r from-[#00ADB5] via-[#38bdf8] to-[#61DAFB]
        text-black shadow-md shadow-cyan-500/20
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-cyan-400/40 hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,173,181,0.5)]
        active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}