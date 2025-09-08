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
      <header className="p-6 flex flex-col md:flex-row items-center justify-between backdrop-blur-md bg-white/5 shadow-lg border-b border-white/10">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4 md:mb-0">
          🤖 AI Code Assistant
        </h1>

        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="python">🐍 Python</option>
          <option value="javascript">⚡ JavaScript</option>
          <option value="java">☕ Java</option>
          <option value="cpp">💻 C++</option>
          <option value="csharp">#️⃣ C#</option>
          <option value="go">🐹 Go</option>
          <option value="ruby">💎 Ruby</option>
          <option value="php">🐘 PHP</option>
        </select>
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

        {/* Code + Output */}
        {mode === "commenter" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
              <CodeEditor code={code} setCode={setCode} language={language} />

            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
              {result?.commented_code ? (
                <OutputPanel commentedCode={result.commented_code} />
              ) : (
                <div className="text-gray-400 text-sm">
                  // AI output will appear here...
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
              <CodeEditor code={code} setCode={setCode} language={language} />

            </div>
            {result && !result.error && (
              <div className="mt-8">
                <ReviewPanel
                  summary={result.summary || "No summary available"}
                  suggestions={result.suggestions || []}
                />
              </div>
            )}
          </>
        )}

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

        {/* Errors */}
        {result?.error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            ⚠️ {result.error}
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
