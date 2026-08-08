import { useRef } from "react";
import Editor from "@monaco-editor/react";

/**
 * Thin wrapper around @monaco-editor/react.
 * Reports cursor position changes upward so a status bar can display
 * "Ln X, Col Y" without every parent needing to know about Monaco's API.
 */
export default function CodeEditor({
  language,
  value,
  onChange,
  readOnly = false,
  onCursorPositionChange
}) {
  const editorRef = useRef(null);

  function handleMount(editor) {
    editorRef.current = editor;

    if (onCursorPositionChange) {
      editor.onDidChangeCursorPosition((e) => {
        onCursorPositionChange({
          line: e.position.lineNumber,
          column: e.position.column
        });
      });
    }
  }

  return (
    <div className="editor-wrapper">
      <Editor
        height="100%"
        language={language}
        value={value}
        theme="vs-dark"
        onChange={onChange}
        onMount={handleMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          renderWhitespace: "selection",
          tabSize: 4
        }}
      />
    </div>
  );
}
