import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="centered-state">
      <div className="state-card">
        <h1>Page Not Found</h1>
        <p>There's nothing here.</p>
        <Link to="/" className="btn btn-primary">
          Go to CodeDrop
        </Link>
      </div>
    </div>
  );
}
