import { fullGallery } from "../data/fullGallery";
import Reveal from "./Reveal";

export default function FullGallery() {
  return (
    <section
      id="full-gallery"
      className="bg-ink py-28 md:py-36"
    >

      <div className="
        max-w-7xl
        mx-auto
        px-6
        md:px-10
      ">

        <Reveal className="mb-16">
          <p className="
            font-mono
            text-[11px]
            uppercase
            tracking-widest2
            text-smoke
          ">
            Full Gallery
          </p>

          <h2 className="
            font-display
            text-4xl
            md:text-6xl
            text-bone
            mt-4
          ">
            Moments we captured.
          </h2>

        </Reveal>


        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          gap-6
        ">

          {fullGallery.map((photo)=>(
            <Reveal key={photo.id}>

              <img
                src={photo.image}
                alt={photo.alt}
                className="
                  w-full
                  h-auto
                  object-contain
                  block
                "
              />

            </Reveal>
          ))}

        </div>


      </div>

    </section>
  );
}