import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Chapter } from "../content/chapters";

type ChapterSectionProps = {
  chapter: Chapter;
  index: number;
  children: ReactNode;
};

const toneClass = (tone: Chapter["visualTone"]) => `tone-${tone}`;

export const ChapterSection = ({ chapter, index, children }: ChapterSectionProps) => (
  <section className={`chapter ${toneClass(chapter.visualTone)}`} id={chapter.id} tabIndex={-1}>
    <div className="chapter__inner">
      <motion.div
        className="chapter__copy"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <p className="chapter__kicker">
          {String(index + 1).padStart(2, "0")} / {chapter.shortLabel}
        </p>
        {index === 0 ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}
        <p className="chapter__question">{chapter.question}</p>
        <p className="chapter__summary">{chapter.summary}</p>
        <ul className="chapter__beats">
          {chapter.beats.map((beat) => (
            <li key={beat}>{beat}</li>
          ))}
        </ul>
        {chapter.transitionQuestion ? (
          <p className="transition-question">{chapter.transitionQuestion}</p>
        ) : null}
      </motion.div>
      <div className="chapter__stage">{children}</div>
    </div>
  </section>
);
