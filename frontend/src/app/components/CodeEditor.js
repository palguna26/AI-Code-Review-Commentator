"use client";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode, language = "python" }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
      <Editor
        height="400px"
        defaultLanguage={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          roundedSelection: true,
          padding: { top: 10, bottom: 10 },
        }}
      />
    </div>
  );
}
