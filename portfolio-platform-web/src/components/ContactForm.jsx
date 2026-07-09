import { useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { api } from "../utils/api";
import styles from "./ContactForm.module.css";

const INITIAL = { linkedinUrl: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = useState(INITIAL);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("submitting");
    try {
      await api.post("/api/contact", {
        linkedinUrl: values.linkedinUrl.trim(),
        message: values.message.trim(),
      });
      setStatus("success");
      setValues(INITIAL);
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "Failed to send. Please try again.");
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h3 className={styles.title}>Get in touch</h3>
        <p className={styles.subtitle}>
          Quick note, role inquiry, or just to say hi — I read every message.
        </p>
      </div>

      {status === "success" ? (
        <div className={styles.success}>
          <CheckCircle2 size={18} />
          <div>
            <strong>Thanks — message sent!</strong>
            <span>I'll follow up shortly.</span>
          </div>
        </div>
      ) : (
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.field}>
            <label htmlFor="cf-linkedin" className={styles.label}>
              LinkedIn / Email *
            </label>
            <input
              id="cf-linkedin"
              type="text"
              required
              maxLength={300}
              value={values.linkedinUrl}
              onChange={update("linkedinUrl")}
              placeholder="Provide LinkedIn profile url or email so I can follow up"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="cf-message" className={styles.label}>
              Message *
            </label>
            <textarea
              id="cf-message"
              required
              rows={4}
              maxLength={5000}
              value={values.message}
              onChange={update("message")}
              placeholder="What's on your mind?"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={`btn btn-primary ${styles.submit}`}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send size={16} />
                Send message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
