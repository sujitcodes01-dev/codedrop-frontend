import LanguageSelector from "./LanguageSelector.jsx";
import ExpirationSelector from "./ExpirationSelector.jsx";
import ShareButton from "./ShareButton.jsx";

export default function Header({
  language,
  onLanguageChange,
  expirationMinutes,
  onExpirationChange,
  onShare,
  sharing
}) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          ◈
        </span>
        <span className="brand-name">CodeDrop</span>
      </div>

      <div className="header-controls">
        <LanguageSelector
          value={language}
          onChange={onLanguageChange}
          disabled={sharing}
        />
        <ExpirationSelector
          value={expirationMinutes}
          onChange={onExpirationChange}
          disabled={sharing}
        />
        <ShareButton onClick={onShare} loading={sharing} />
      </div>
    </header>
  );
}
