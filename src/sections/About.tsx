import { Section } from "../components/Section";
import { motion } from "framer-motion";
import { personal } from "../data/cv";

export function About() {
  return (
    <Section
      id="about"
      title="About Me"
      intro="A quick story of who I am beyond the CV bullets."
    >
      <div className="card p-6 md:p-8">
        <motion.p
          className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-[15px] md:text-base"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Hi, I’m <span className="font-semibold">{personal.name}</span>, a{" "}
          <span className="font-semibold">
            {personal.role}
          </span>{" "}
          based in {personal.location}. I graduated with{" "}
          <span className="font-semibold">First Class Honours</span> in Software
          Engineering from the University of Westminster, where I built a strong
          foundation in full-stack development, cloud infrastructure, and
          real-time systems.
        </motion.p>

        <motion.p
          className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-[15px] md:text-base mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          My projects range from{" "}
          <span className="italic">AI-powered news verification</span> to{" "}
          <span className="italic">inventory management platforms</span> and{" "}
          <span className="italic">Java desktop apps</span>. I enjoy building
          products end-to-end, from elegant UIs with React, to reliable APIs in
          Node, and automating deployments with AWS and GitHub Actions.
        </motion.p>

        <motion.p
          className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-[15px] md:text-base mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Outside of code, I've served as a{" "}
          <span className="font-semibold">Student Union Representative</span>{" "}
          and <span className="font-semibold">FANS mentor</span>, helping new
          students settle into university life. These experiences sharpened my
          leadership, teamwork, and communication skills, qualities I bring
          into every role I take on.
        </motion.p>

        <motion.p
          className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-[15px] md:text-base mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          I’m motivated by solving real problems with technology and am always
          exploring how{" "}
          <span className="font-semibold">AI, security, and scalable
          systems</span> can shape the future. Right now, I’m looking for{" "}
          <span className="font-semibold">graduate software engineering
          opportunities</span> where I can grow, contribute, and make an impact.
        </motion.p>
      </div>
    </Section>
  );
}
