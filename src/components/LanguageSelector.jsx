// The full list of Monaco language identifiers this app exposes,
// shared by the selector and by the view page (to show a readable label).
export const LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Java", value: "java" },
  { label: "Python", value: "python" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "JSON", value: "json" },
  { label: "SQL", value: "sql" },
  { label: "XML", value: "xml" },
  { label: "Markdown", value: "markdown" },
  { label: "Plain Text", value: "plaintext" }
];

export function getLanguageLabel(value) {
  const match = LANGUAGES.find((lang) => lang.value === value);
  return match ? match.label : value;
}

export default function LanguageSelector({ value, onChange, disabled }) {
  return (
    <div className="control">
      <label htmlFor="language-select" className="sr-only">
        Language
      </label>
      <select
        id="language-select"
        className="select"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select programming language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
