import Editor from "@monaco-editor/react";

export default function OutputPanel({ commentedCode }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
      <Editor
        height="400px"
        defaultLanguage="python"
        value={commentedCode || "// AI output will appear here..."}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
