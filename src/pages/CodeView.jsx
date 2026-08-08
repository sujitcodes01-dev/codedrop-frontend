import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CodeEditor from "../components/CodeEditor.jsx";
import { getLanguageLabel } from "../components/LanguageSelector.jsx";
import { getCode, ApiError } from "../services/codeApi.js";
import { useCountdown } from "../hooks/useCountdown.js";

function formatCreatedAt(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export default function CodeView() {
  const { accessCode } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | ready | expired | not-found | error
  const [errorMessage, setErrorMessage] = useState("");
  const [codeData, setCodeData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setStatus("loading");
    setCodeData(null);

    getCode(accessCode)
      .then((data) => {
        if (cancelled) return;
        setCodeData(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setStatus("not-found");
        } else if (err instanceof ApiError && err.status === 410) {
          setStatus("expired");
        } else {
          setErrorMessage(
            err instanceof ApiError
              ? err.message
              : "Could not reach the server. Please check your connection and try again."
          );
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessCode]);

  const countdown = useCountdown(status === "ready" ? codeData?.expiresAt : null);

  // Stop showing the editor the moment the local countdown hits zero —
  // don't wait for the user to notice or reload.
  const effectiveStatus =
    status === "ready" && countdown.isExpired ? "expired" : status;

  async function handleCopyLink() {
    const shareUrl = `${window.location.origin}/code/${accessCode}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Soft failure — nothing to interrupt the user with.
    }
  }

  if (effectiveStatus === "loading") {
    return (
      <div className="centered-state">
        <p>Loading code...</p>
      </div>
    );
  }

  if (effectiveStatus === "not-found") {
    return (
      <div className="centered-state">
        <div className="state-card">
          <h1>Code Not Found</h1>
          <p>The code you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Create New Code
          </Link>
        </div>
      </div>
    );
  }

  if (effectiveStatus === "expired") {
    return (
      <div className="centered-state">
        <div className="state-card">
          <h1>Code Expired</h1>
          <p>This shared code is no longer available.</p>
          <Link to="/" className="btn btn-primary">
            Create New Code
          </Link>
        </div>
      </div>
    );
  }

  if (effectiveStatus === "error") {
    return (
      <div className="centered-state">
        <div className="state-card">
          <h1>Something Went Wrong</h1>
          <p>{errorMessage}</p>
          <Link to="/" className="btn btn-primary">
            Create New Code
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header view-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ◈
          </span>
          <span className="brand-name">CodeDrop</span>
        </div>

        <div className="view-meta">
          <span className="badge">{getLanguageLabel(codeData.language)}</span>
          <span className="view-meta-item">Code {accessCode}</span>
          <span className="view-meta-item view-meta-secondary">
            Created {formatCreatedAt(codeData.createdAt)}
          </span>
          <span className="view-meta-item countdown">
            Expires in {countdown.formatted}
          </span>
        </div>

        <div className="header-controls">
          <button type="button" className="btn btn-secondary" onClick={handleCopyLink}>
            {copied ? "✓ Copied" : "Copy Link"}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
            New
          </button>
        </div>
      </header>

      <main className="editor-area">
        <CodeEditor language={codeData.language} value={codeData.content} readOnly />
      </main>

      <footer className="status-bar">
        <span>◷ This code will expire in {countdown.formatted}</span>
      </footer>
    </div>
  );
}
