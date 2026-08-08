import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatMinutesLabel } from "./ExpirationSelector.jsx";

export default function ShareModal({ shareData, expirationMinutes, onClose }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!shareData) return null;

  const shareUrl = `${window.location.origin}/code/${shareData.accessCode}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (permissions, insecure context). The link
      // is still fully visible and selectable in the input, so this is
      // a soft failure — no need to interrupt the user.
    }
  }

  function handleOpenCode() {
    navigate(`/code/${shareData.accessCode}`);
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
      <div className="modal">
        <h2 id="share-modal-title" className="modal-title">
          Code Shared!
        </h2>
        <p className="modal-subtitle">Your code is ready to share</p>

        <div className="access-code-display">{shareData.accessCode}</div>

        <div className="share-url-row">
          <input
            className="share-url-input"
            type="text"
            readOnly
            value={shareUrl}
            aria-label="Share URL"
            onFocus={(e) => e.target.select()}
          />
        </div>

        <button type="button" className="btn btn-primary btn-block" onClick={handleCopy}>
          {copied ? "✓ Copied" : "Copy Link"}
        </button>

        <p className="modal-expiry">
          Expires in {formatMinutesLabel(expirationMinutes)}
        </p>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={handleOpenCode}>
            Open Code
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
