/**
 * Presentational share trigger. All the actual logic — reading editor
 * content, validating it, calling the API, tracking loading/error state —
 * lives in Home.jsx and is passed down as props. Keeping this component
 * "dumb" makes it trivial to reuse or restyle without touching the flow.
 */
export default function ShareButton({ onClick, loading, disabled }) {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? "Sharing…" : "↗ Share Code"}
    </button>
  );
}
