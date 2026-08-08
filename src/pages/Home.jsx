import { useState } from "react";
import Header from "../components/Header.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import ShareModal from "../components/ShareModal.jsx";
import { getLanguageLabel } from "../components/LanguageSelector.jsx";
import { createCode, ApiError } from "../services/codeApi.js";

export default function Home() {
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [expirationMinutes, setExpirationMinutes] = useState(30);
  const [loading, setLoading] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");
  const [cursor, setCursor] = useState({ line: 1, column: 1 });

  async function handleShare() {
    setApiError("");

    if (!content.trim()) {
      setValidationError("Please enter some code before sharing.");
      return;
    }
    setValidationError("");

    setLoading(true);
    try {
      const response = await createCode({
        content,
        language,
        expirationMinutes
      });
      setShareData(response);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Could not reach the server. Please check your connection and try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        expirationMinutes={expirationMinutes}
        onExpirationChange={setExpirationMinutes}
        onShare={handleShare}
        sharing={loading}
      />

      {(validationError || apiError) && (
        <div className="inline-banner inline-banner-error">
          {validationError || apiError}
        </div>
      )}

      <main className="editor-area">
        <CodeEditor
          language={language}
          value={content}
          onChange={(value) => setContent(value ?? "")}
          onCursorPositionChange={setCursor}
        />
      </main>

      <footer className="status-bar">
        <span>{getLanguageLabel(language)}</span>
        <span>
          Ln {cursor.line}, Col {cursor.column}
        </span>
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span className="status-ready">● Ready</span>
      </footer>

      {shareData && (
        <ShareModal
          shareData={shareData}
          expirationMinutes={expirationMinutes}
          onClose={() => setShareData(null)}
        />
      )}
    </div>
  );
}
