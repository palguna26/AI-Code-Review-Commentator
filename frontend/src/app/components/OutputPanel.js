export default function OutputPanel({ commentedCode }) {
  return (
    <div className="p-4 rounded-2xl bg-gray-900 border border-white/10 shadow-lg font-mono text-sm text-green-300 whitespace-pre-wrap">
      {commentedCode || "// AI output will appear here..."}
    </div>
  );
}
