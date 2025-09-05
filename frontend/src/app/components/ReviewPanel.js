export default function ReviewPanel({ summary, suggestions }) {
  if (!summary && (!suggestions || suggestions.length === 0)) {
    return null;
  }

  return (
    <div className="p-6 rounded-2xl bg-gray-800/80 border border-white/10 shadow-xl">
      <h3 className="text-xl font-bold mb-3 text-purple-400">📋 Review Summary</h3>
      <p className="mb-4 text-gray-200">{summary}</p>

      <h4 className="text-lg font-semibold mb-2 text-teal-400">✅ Suggestions</h4>
      <ul className="list-disc pl-6 space-y-1 text-gray-300">
        {suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
