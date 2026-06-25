import { motion } from "framer-motion";
import { aiWork } from "../constants/aiTools";
import styles from "./AIWork.module.css";

export default function AIWork() {
  return (
    <section id="ai-work" className={`section ${styles.aiWork}`}>
      <div className="container">
        <motion.div
          className={styles.head}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-eyebrow">AI Work</span>
          <h2 className="section-title">What I've Built Using AI</h2>
        </motion.div>

        <div className={styles.grid}>
          {aiWork.map((item, i) => (
            <motion.div
              key={item.id}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className={styles.cardHead}>
                <span className={styles.dot} />
                <span className={styles.tag}>AI Project</span>
              </div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
              <div className={styles.tags}>
                {item.tags.map((t) => (
                  <span key={t} className={styles.chip}>{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
