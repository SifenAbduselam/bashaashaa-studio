import { services } from '../data/photos';
import Reveal from './Reveal';

export default function ServicesSection() {
  return (
    <section id="services" className="bg-ink py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal className="mb-20 md:mb-28 max-w-2xl">
          <p className="font-mono text-[11px] tracking-widest2 uppercase text-smoke mb-4">
            Services
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-bone leading-tight text-balance">
            Every occasion, told with the same care.
          </h2>
        </Reveal>

        <div className="flex flex-col gap-24 md:gap-32">
          {services.map((service, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={service.id}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
                  reversed ? 'md:[direction:rtl]' : ''
                }`}
              >
                <Reveal className={`overflow-hidden frame-corners ${reversed ? 'md:[direction:ltr]' : ''}`}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[340px] md:h-[460px] object-cover hover:scale-105 transition-transform duration-[1200ms] ease-cinematic"
                  />
                </Reveal>

                <Reveal delay={0.15} className={reversed ? 'md:[direction:ltr]' : ''}>
                  <span className="font-mono text-[11px] tracking-widest2 uppercase text-smoke">
                    {String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-3xl md:text-4xl text-bone mt-4 mb-5">
                    {service.title}
                  </h3>
                  <p className="font-body text-smoke text-base md:text-lg leading-relaxed max-w-md">
                    {service.description}
                  </p>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-block mt-7 font-body text-xs tracking-[0.2em] uppercase text-bone border-b border-bone/50 pb-1 hover:border-bone transition-colors"
                  >
                    Inquire About This Service
                  </a>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
