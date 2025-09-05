"use client";
import { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import OutputPanel from "./components/OutputPanel";
import ReviewPanel from "./components/ReviewPanel";
import { processCode } from "./api";

export default function App() {
  const [mode, setMode] = useState("commenter");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleRun() {
    setLoading(true);
    const response = await processCode({ code, language, mode });
    setResult(response);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="p-6 text-center backdrop-blur-md bg-white/5 shadow-lg border-b border-white/10">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          🤖 AI Code {mode === "commenter" ? "Commenter" : "Reviewer"}
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {/* Mode Switch */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={() => setMode("commenter")}
            className={`px-5 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
              mode === "commenter"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white scale-105"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            📝 Commenter
          </button>
          <button
            onClick={() => setMode("reviewer")}
            className={`px-5 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
              mode === "reviewer"
                ? "bg-gradient-to-r from-green-500 to-teal-600 text-white scale-105"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            🔍 Reviewer
          </button>
        </div>

        {/* Code Input */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
          <CodeEditor code={code} setCode={setCode} />
        </div>

        {/* Run Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleRun}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "✨ Processing..." : "🚀 Run AI"}
          </button>
        </div>

        {/* Output */}
        {result?.error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            ⚠️ {result.error}
          </div>
        )}

        {!result?.error && result && (
          <div className="mt-8 space-y-6">
            {mode === "commenter" && result.commented_code && (
              <OutputPanel commentedCode={result.commented_code} />
            )}
            {mode === "reviewer" && (
              <ReviewPanel
                summary={result.summary || "No summary available"}
                suggestions={result.suggestions || []}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-400 text-sm border-t border-white/10">
        Made with ❤️ using FastAPI + Next.js + Gemini
      </footer>
    </div>
  );
}
