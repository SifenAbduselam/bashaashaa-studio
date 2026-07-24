import { testimonials } from '../data/photos';
import Reveal from './Reveal';

export default function TestimonialsSection() {
  return (
    <section className="bg-ink py-28 md:py-36 border-t border-hairline/60">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal className="mb-16 md:mb-20 max-w-2xl">
          <p className="font-mono text-[11px] tracking-widest2 uppercase text-smoke mb-4">
            Testimonials
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-bone leading-tight text-balance">
            Words from those we&rsquo;ve photographed.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.id}
              delay={(i % 2) * 0.15}
              className="border border-hairline/60 p-8 md:p-10 flex flex-col justify-between hover:border-bone/40 transition-colors duration-500"
            >
              <p className="font-display italic text-xl md:text-2xl text-bone leading-relaxed text-balance">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4 mt-10">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-body text-sm text-bone">{t.name}</p>
                  <p className="font-mono text-[10px] tracking-widest2 uppercase text-smoke mt-1">
                    {t.role}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
