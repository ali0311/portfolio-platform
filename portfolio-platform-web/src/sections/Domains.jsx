import { motion } from "framer-motion";
import { domains } from "../constants/domains";
import Icon from "../components/Icon";
import styles from "./Domains.module.css";

export default function Domains() {
  return (
    <section id="domains" className={`section ${styles.domains}`}>
      <div className="container">
        <motion.div
          className={styles.head}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-eyebrow">Domains</span>
          <h2 className="section-title">Product Domains I've Worked With</h2>
        </motion.div>

        <div className={styles.grid}>
          {domains.map((d, i) => (
            <motion.div
              key={d.id}
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
              <div className={styles.iconWrap}>
                <Icon name={d.icon} size={26} />
              </div>
              <h3 className={styles.title}>{d.title}</h3>
              <p className={styles.description}>{d.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
