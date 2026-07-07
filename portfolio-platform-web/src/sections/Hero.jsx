import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { profile } from "../constants/profile";
import TechIcon from "../components/TechIcon";
import { api } from "../utils/api";
import { getVisitorId, detectDevice, detectBrowser } from "../utils/analytics";
import profilePic from "../assets/images/profile_pic.jpeg";
import styles from "./Hero.module.css";

const GITHUB_REPO_URL = "https://github.com/ali0311";

const GithubMark = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.93c.58.1.79-.25.79-.56v-2.05c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
  </svg>
);

const LinkedinMark = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.27V1.72C24 .77 23.21 0 22.22 0z" />
  </svg>
);

const ORBIT_OUTER = [
  { name: "react", angle: 0 },
  { name: "docker", angle: 90 },
  { name: "kubernetes", angle: 180 },
  { name: "github", angle: 270 },
];

const ORBIT_INNER = [
  { name: "aws", angle: 45 },
  { name: "javascript", angle: 225 },
];

function orbitStyle(angle, radius) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;
  return {
    transform: `translate(${x}px, ${y}px)`,
  };
}

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.gridBg} />
      <div className={styles.glow1} />
      <div className={styles.glow2} />

      <div className={styles.inner}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            SDET · QUALITY ENGINEER · FRONTEND · DEVOPS
          </span>

          <h1 className={styles.title}>
            Hi, I'm <span className={styles.titleAccent}>{profile.name}</span>
          </h1>

          <p className={styles.subtitle}>{profile.subtitle}</p>
          <p className={styles.intro}>{profile.intro}</p>

          <div className={styles.ctas}>
            <a
              href={profile.resumeUrl}
              className="btn btn-primary"
              download
              aria-label="Download resume"
              onClick={() => {
                api
                  .post("/api/analytics/resume-download", {
                    sessionId: getVisitorId(),
                    deviceType: detectDevice(),
                    browser: detectBrowser(),
                    sourcePage: window.location.pathname || "/",
                  })
                  .catch(() => {});
              }}
            >
              <Download size={16} />
              View Resume
            </a>
            <a
              href={profile.social.linkedin}
              className="btn btn-secondary"
              target="_blank"
              rel="noreferrer"
              aria-label="Connect"
            >
              <LinkedinMark width={16} height={16} />
              Connect
            </a>
            <a
              href={GITHUB_REPO_URL}
              className="btn btn-secondary"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
            >
              <GithubMark width={16} height={16} />
              GitHub Repo
            </a>
          </div>
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.visualRing} />

          <motion.div
            className={`${styles.orbit}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          >
            <div className={`${styles.orbitRing} ${styles.orbitRingOuter}`} />
            {ORBIT_OUTER.map((item) => (
              <div
                key={item.name}
                className={styles.orbitIcon}
                style={orbitStyle(item.angle, 220)}
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                >
                  <TechIcon name={item.name} size={32} />
                </motion.div>
              </div>
            ))}
          </motion.div>

          <motion.div
            className={`${styles.orbit}`}
            animate={{ rotate: -360 }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            <div className={`${styles.orbitRing} ${styles.orbitRingInner}`} />
            {ORBIT_INNER.map((item) => (
              <div
                key={item.name}
                className={styles.orbitIcon}
                style={orbitStyle(item.angle, 160)}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 28, ease: "linear", repeat: Infinity }}
                >
                  <TechIcon name={item.name} size={28} />
                </motion.div>
              </div>
            ))}
          </motion.div>

          <div className={styles.avatarWrap}>
            <div
              className={styles.avatar}
              role="img"
              aria-label={`${profile.name} portrait`}
              style={{ backgroundImage: `url(${profilePic})` }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
