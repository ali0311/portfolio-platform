import { useMemo } from "react";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Experience from "../sections/Experience";
import Skills from "../sections/Skills";
import Domains from "../sections/Domains";
import DevOps from "../sections/DevOps";
import AITools from "../sections/AITools";
import AIWork from "../sections/AIWork";
import { useSectionTracking } from "../hooks/useSectionTracking";
import { getVisitorId } from "../utils/analytics";

const SECTION_MAP = {
  home: "Hero",
  about: "About",
  experience: "Experience",
  skills: "Skills",
  domains: "Domains",
  devops: "DevOps",
  "ai-tools": "AI Tools",
  "ai-work": "AI Work",
  contact: "Contact",
};

export default function Home() {
  const sessionId = useMemo(() => getVisitorId(), []);
  useSectionTracking(SECTION_MAP, { sessionId });

  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Domains />
      <DevOps />
      <AITools />
      <AIWork />
    </main>
  );
}
