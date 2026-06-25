import { motion } from "framer-motion";
import { aiTools } from "../constants/aiTools";
import Icon from "../components/Icon";
import styles from "./AITools.module.css";

export default function AITools() {
  return (
    <section id="ai-tools" className={`section ${styles.aiTools}`}>
      <div className="container">
        <motion.div
          className={styles.head}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-eyebrow">AI Tools</span>
          <h2 className="section-title">AI Assisted Engineering</h2>
        </motion.div>

        <div className={styles.grid}>
          {aiTools.map((tool, i) => (
            <motion.div
              key={tool.id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className={styles.iconWrap}>
                <Icon name={tool.icon} size={22} />
              </div>
              <h3 className={styles.title}>{tool.title}</h3>
              <p className={styles.description}>{tool.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
