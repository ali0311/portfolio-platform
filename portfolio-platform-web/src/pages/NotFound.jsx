import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="section">
      <div className="container" style={{ textAlign: "center" }}>
        <h1 className="glow-text">404</h1>
        <p>This page got lost in the cloud.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
          Back home
        </Link>
      </div>
    </main>
  );
}
