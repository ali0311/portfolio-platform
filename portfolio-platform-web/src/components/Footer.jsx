import { Layout, Server, Cloud } from "lucide-react";
import { profile } from "../constants/profile";
import ContactForm from "./ContactForm";
import styles from "./Footer.module.css";

const STACK = [
  {
    label: "Frontend",
    icon: Layout,
    items: ["React", "JavaScript", "CSS Modules", "Framer Motion"],
  },
  {
    label: "Backend",
    icon: Server,
    items: ["Node.js", "Express", "PostgreSQL", "Prisma"],
  },
  {
    label: "DevOps",
    icon: Cloud,
    items: [
      "Docker",
      "Nginx",
      "GitHub Actions",
      "AWS S3 + CloudFront",
      "EC2",
      "CloudWatch",
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className={styles.footer}>
      <div className="container">
        <ContactForm />

        <div className={styles.stackHead}>
          <span className={styles.stackEyebrow}>Built with</span>
          <h3 className={styles.stackTitle}>The tech behind this site</h3>
        </div>

        <div className={styles.stackGrid}>
          {STACK.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.label} className={styles.stackCol}>
                <div className={styles.stackHeader}>
                  <span className={styles.stackIcon}>
                    <Icon size={16} />
                  </span>
                  <h4 className={styles.stackLabel}>{group.label}</h4>
                </div>
                <ul className={styles.stackList}>
                  {group.items.map((item) => (
                    <li key={item} className={styles.stackItem}>
                      <span className={styles.stackDot} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © {year} {profile.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
