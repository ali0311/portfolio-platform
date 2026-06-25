import { motion } from "framer-motion";
import { aboutParagraphs, hobbies } from "../constants/about";
import Icon from "../components/Icon";
import styles from "./About.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function About() {
  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className="container">
        <motion.div
          className={styles.head}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <span className="section-eyebrow">About</span>
          <h2 className="section-title">Beyond Testing</h2>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            className={styles.story}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            {aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </motion.div>

          <div>
            <p className={styles.hobbiesTitle}>Hobbies & Interests</p>
            <div className={styles.hobbies}>
              {hobbies.map((h, i) => (
                <motion.div
                  key={h.title}
                  className={styles.card}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  custom={i}
                  variants={fadeUp}
                >
                  <div className={styles.iconWrap}>
                    <Icon name={h.icon} size={20} />
                  </div>
                  <div className={styles.cardBody}>
                    <h4>{h.title}</h4>
                    <p>{h.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
