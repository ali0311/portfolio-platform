import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { devopsFlow } from "../constants/devops";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import styles from "./DevOps.module.css";

const ARCH_DIAGRAM = `         Users
            ↓
      CloudFront CDN
            ↓
   S3 Static Frontend Hosting
            ↓
       Browser → React
            ↓
         REST API
            ↓
         EC2 Instance
   ├── Nginx Reverse Proxy
   ├── Backend Docker Container
   └── PostgreSQL Docker Container`;

const ARCH_STEPS = [
  {
    label: "Source",
    text: "Code is pushed to GitHub. Branch protections and PR reviews enforce quality.",
  },
  {
    label: "Build",
    text: "GitHub Actions runs lint, tests, and produces production artifacts (Docker images for backend, static bundle for frontend).",
  },
  {
    label: "Ship",
    text: "Frontend uploads to S3 and invalidates CloudFront. Backend image deploys to EC2 via SSH + docker compose up.",
  },
  {
    label: "Run",
    text: "Nginx fronts the backend container, which talks to a Postgres container over a private Docker network.",
  },
  {
    label: "Observe",
    text: "Application logs and metrics ship to CloudWatch. Alerts notify on error spikes or downtime.",
  },
];

export default function DevOps() {
  const [open, setOpen] = useState(false);

  return (
    <section id="devops" className={`section ${styles.devops}`}>
      <div className="container">
        <motion.div
          className={styles.head}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-eyebrow">DevOps</span>
          <h2 className="section-title">DevOps &amp; Delivery</h2>
          <p className={styles.subtitle}>
            The toolchain I work with at scale — and how this site is deployed.
          </p>
        </motion.div>

        <motion.div
          className={styles.flowCard}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.flow}>
            {devopsFlow.map((step, i) => (
              <div key={step.id} style={{ display: "contents" }}>
                <motion.div
                  className={styles.node}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className={styles.nodeIcon}>
                    <Icon name={step.icon} size={26} />
                  </div>
                  <div className={styles.nodeLabel}>{step.label}</div>
                </motion.div>
                {i < devopsFlow.length - 1 && (
                  <div className={styles.connector} />
                )}
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setOpen(true)}
            >
              <ExternalLink size={16} />
              How this site deployed!
            </button>
          </div>
        </motion.div>
      </div>

      <Modal
        open={open}
        title="Deployment Architecture"
        onClose={() => setOpen(false)}
      >
        <div className={styles.modalBody}>
          <p className={styles.modalIntro}>
            This is the actual architecture this portfolio platform runs on:
            independent frontend and backend deployments, containerized services,
            and a production-grade CI/CD pipeline driven by GitHub Actions.
          </p>

          <pre className={styles.archDiagram}>{ARCH_DIAGRAM}</pre>

          <div className={styles.archList}>
            {ARCH_STEPS.map((step) => (
              <div key={step.label} className={styles.archStep}>
                <strong>{step.label}.</strong>
                <span>{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </section>
  );
}
