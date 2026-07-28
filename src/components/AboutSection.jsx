import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { stats } from '../data/photos';
import Reveal from './Reveal';
import about from "../assets/images/about.webp";

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-4xl md:text-5xl text-bone">
      {display}
      {suffix}
    </span>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="bg-ink py-28 md:py-36 border-t border-hairline/60">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center">
        <Reveal className="overflow-hidden frame-corners">
          <img
            src={about}
            alt="Bashaashaa Studio, photography and video production team"
            className="w-full h-[420px] md:h-[560px] object-cover"
          />
        </Reveal>

        <div>
          <Reveal>
            <p className="font-mono text-[11px] tracking-widest2 uppercase text-smoke mb-4">
              About Bashaashaa Studio
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-bone leading-tight text-balance">
              Every photograph tells a story.
            </h2>
            <p className="font-body text-smoke text-base md:text-lg leading-relaxed mt-6 max-w-lg">
              At Bashaashaa Studio, we don&rsquo;t just capture images. We
              preserve emotions, memories, and moments that last generations
              &mdash; the quiet look between vows, the laugh no one planned
              for, the hand held one second longer than usual.
            </p>
            <p className="font-body text-smoke text-base md:text-lg leading-relaxed mt-4 max-w-lg">
              Based in Jimma, the studio has spent over a decade photographing
              and filming weddings, families, and milestones across the region
              &mdash; always in black and white, always in service of the
              story.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-hairline/60">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <p className="font-body text-xs md:text-sm text-smoke mt-2 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
