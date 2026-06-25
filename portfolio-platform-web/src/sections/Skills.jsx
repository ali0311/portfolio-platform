import { useState } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { skillCategories, radarSnapshot } from "../constants/skills";
import styles from "./Skills.module.css";

export default function Skills() {
  const [activeId, setActiveId] = useState(skillCategories[0].id);
  const active = skillCategories.find((c) => c.id === activeId);

  return (
    <section id="skills" className={`section ${styles.skills}`}>
      <div className="container">
        <motion.div
          className={styles.head}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-eyebrow">Skills</span>
          <h2 className="section-title">Technologies I Work With</h2>
        </motion.div>

        <div className={styles.layout}>
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.tabs} role="tablist">
              {skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeId === cat.id}
                  className={`${styles.tab} ${
                    activeId === cat.id ? styles.active : ""
                  }`}
                  onClick={() => setActiveId(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className={styles.bars}>
              {active.items.map((item, i) => (
                <div key={item.name} className={styles.barRow}>
                  <div className={styles.barHead}>
                    <span className={styles.barName}>{item.name}</span>
                    <span className={styles.barLevel}>{item.level}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <motion.div
                      key={`${activeId}-${item.name}`}
                      className={styles.barFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.level}%` }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className={`${styles.panel} ${styles.radarPanel}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className={styles.radarHead}>Skill Footprint</div>
            <div className={styles.radarHost}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarSnapshot} outerRadius="75%">
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fill: "#b8b8c8", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Skill"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
