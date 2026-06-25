import { useState } from "react";
import { motion } from "framer-motion";
import { experience } from "../constants/experience";
import styles from "./Experience.module.css";

const VISIBLE_BULLETS = 5;

export default function Experience() {
  const [expandedDetails, setExpandedDetails] = useState({});

  function toggleDetails(key) {
    setExpandedDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <section id="experience" className={`section ${styles.experience}`}>
      <div className="container">
        <motion.div
          className={styles.head}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-eyebrow">Experience</span>
          <h2 className="section-title">My Professional Journey</h2>
        </motion.div>

        <div className={styles.timeline}>
          {experience.map((org, i) => (
            <motion.article
              key={`${org.company}-${i}`}
              className={styles.item}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className={styles.dot} aria-hidden="true" />
              <div className={styles.card}>
                <header className={styles.orgHead}>
                  <h3 className={styles.company}>{org.company}</h3>
                  <div className={styles.orgMeta}>
                    <span>{org.tenure}</span>
                    {org.location && (
                      <>
                        <span className={styles.dotSep} />
                        <span>{org.location}</span>
                      </>
                    )}
                  </div>
                </header>

                {org.stack && org.stack.length > 0 && (
                  <div className={styles.stack}>
                    {org.stack.map((s) => (
                      <span key={s} className={styles.chip}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.roles}>
                  {org.roles.map((role, j) => {
                    const key = `${i}-${j}`;
                    const showAll = expandedDetails[key];
                    const visible =
                      showAll || role.details.length <= VISIBLE_BULLETS
                        ? role.details
                        : role.details.slice(0, VISIBLE_BULLETS);
                    const hasMore = role.details.length > VISIBLE_BULLETS;
                    return (
                      <div key={key} className={styles.role}>
                        <div className={styles.roleHead}>
                          <h4 className={styles.roleTitle}>{role.title}</h4>
                          <span className={styles.roleDuration}>
                            {role.duration}
                          </span>
                        </div>
                        <div className={styles.detailsInner}>
                          {visible.map((d, idx) => (
                            <div key={idx} className={styles.bullet}>
                              {d}
                            </div>
                          ))}
                          {hasMore && (
                            <button
                              type="button"
                              className={styles.seeMore}
                              onClick={() => toggleDetails(key)}
                            >
                              {showAll ? "See less" : "See more…"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
