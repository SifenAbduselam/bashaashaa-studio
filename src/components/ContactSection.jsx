import Reveal from './Reveal';
import BookingForm from './BookingForm';

export default function ContactSection() {
  return (
    <section id="contact" className="bg-ink py-28 md:py-36 border-t border-hairline/60">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <Reveal>
          <p className="font-mono text-[11px] tracking-widest2 uppercase text-smoke mb-4">
            Get In Touch
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-bone leading-tight text-balance">
            Let&rsquo;s tell your story.
          </h2>
          <p className="font-body text-smoke text-base md:text-lg leading-relaxed mt-6 max-w-md">
            Tell us about your day and we&rsquo;ll reply within 24 hours to
            confirm availability and walk through the details.
          </p>

          <div className="mt-14 flex flex-col gap-8">
            <div>
              <p className="font-mono text-[10px] tracking-widest2 uppercase text-smoke mb-2">
                Studio
              </p>
              <p className="font-body text-bone">Jimma, Ethiopia</p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest2 uppercase text-smoke mb-2">
                Phone
              </p>
              <p className="font-body text-bone">0932 453 742</p>
              <p className="font-body text-bone">0900 946 999</p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest2 uppercase text-smoke mb-2">
                Follow
              </p>
              <div className="flex gap-5 font-body text-bone text-sm">
                <a
                  href="https://www.tiktok.com/@bashaashaastudiojimma"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-smoke transition-colors"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <BookingForm />
        </Reveal>
      </div>
    </section>
  );
}
