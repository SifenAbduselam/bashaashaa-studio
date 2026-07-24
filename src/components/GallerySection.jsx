import { motion } from 'framer-motion';
import { galleryCategories } from '../data/photos';
import Reveal from './Reveal';

const SIZE_CLASSES = {
  tall: 'md:row-span-2',
  wide: 'md:col-span-2',
  short: '',
};

export default function GallerySection() {
  return (
    <section id="gallery" className="bg-ink py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal className="mb-16 md:mb-20 max-w-2xl">
          <p className="font-mono text-[11px] tracking-widest2 uppercase text-smoke mb-4">
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-bone leading-tight text-balance">
            A collection of moments, not just photographs.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] md:auto-rows-[260px] gap-3 md:gap-4">
          {galleryCategories.map((cat, i) => (
            <Reveal
              key={cat.id}
              delay={(i % 4) * 0.08}
              amount={0.1}
              className={`relative group overflow-hidden frame-corners ${SIZE_CLASSES[cat.size]}`}
            >
              <motion.img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.06 }}
                style={{ transitionProperty: 'transform' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex items-end justify-between">
                <h3 className="font-display text-lg md:text-xl text-bone">{cat.title}</h3>
                <button className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-mono text-[10px] tracking-widest2 uppercase text-bone border border-bone/50 px-3 py-2 whitespace-nowrap">
                  View
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
