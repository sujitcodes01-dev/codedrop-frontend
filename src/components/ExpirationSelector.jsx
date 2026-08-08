export const EXPIRATION_OPTIONS = [
  { label: "5 Minutes", value: 5 },
  { label: "10 Minutes", value: 10 },
  { label: "30 Minutes", value: 30 },
  { label: "1 Hour", value: 60 },
  { label: "6 Hours", value: 360 },
  { label: "12 Hours", value: 720 },
  { label: "24 Hours", value: 1440 }
];

/** Turns a raw minute count into a readable phrase, e.g. "29 minutes" or "1 hour". */
export function formatMinutesLabel(minutes) {
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }
  const hours = Math.round((minutes / 60) * 10) / 10;
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

export default function ExpirationSelector({ value, onChange, disabled }) {
  return (
    <div className="control">
      <label htmlFor="expiration-select" className="sr-only">
        Expiration
      </label>
      <select
        id="expiration-select"
        className="select"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Select expiration duration"
      >
        {EXPIRATION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
