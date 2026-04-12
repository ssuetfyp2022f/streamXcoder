export default function EditorPageSelect({ children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`
        px-3 py-2 mt-2 rounded-xl
        bg-[#0f1f3d]/80 backdrop-blur-md
        border border-white/10
        text-white
        shadow-md shadow-cyan-500/10
        transition-all duration-300
        ]hover:border-cyan-400/40
        focus:outline-none
        focus:ring-2 focus:ring-cyan-400
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </select>
  );
}