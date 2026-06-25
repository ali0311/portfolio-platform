import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.glow} />
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>AK</span>
          <div>
            <div className={styles.title}>Author Login</div>
          </div>
        </Link>
        <p className={styles.subtitle}>
          Private dashboard access. Site visitors don't need to log in.
        </p>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={`btn btn-primary ${styles.submit}`}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign in
              </>
            )}
          </button>
        </form>

        <p className={styles.helper}>
          <Link to="/">← Back to portfolio</Link>
        </p>
      </motion.div>
    </div>
  );
}
