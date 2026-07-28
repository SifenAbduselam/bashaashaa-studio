import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-css";

import { galleryCategories } from "../data/photos";
import Reveal from "./Reveal";

import "../styles/masonry.css";

export default function GallerySection() {

  const breakpointColumnsObj = {
    default: 3,
    1024: 3,
    768: 2,
    640: 1,
  };


  return (
    <section id="gallery" className="bg-ink py-28 md:py-36">

      <div className="max-w-7xl mx-auto px-6 md:px-10">


        {/* Heading */}
        <Reveal className="mb-16 md:mb-20 max-w-2xl">

          <p className="
            font-mono
            text-[11px]
            tracking-widest2
            uppercase
            text-smoke
            mb-4
          ">
            Portfolio
          </p>


          <h2 className="
            font-display
            text-4xl
            md:text-6xl
            text-bone
            leading-tight
            text-balance
          ">
            A collection of moments, not just photographs.
          </h2>

        </Reveal>



        {/* Masonry Gallery */}

 <Masonry
  breakpointCols={breakpointColumnsObj}
  className="my-masonry-grid"
  columnClassName="my-masonry-grid_column"
>
          {galleryCategories.map((cat, index) => (

            <Reveal
              key={cat.id}
              delay={(index % 6) * 0.08}
            >

              <motion.div

                whileHover={{
                  scale: 1.025,
                }}

                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}

                className="
                  overflow-hidden
                  bg-transparent
                "

              >

                <motion.img

                  src={cat.image}
                  alt={cat.alt}

                  loading="lazy"

                  initial={{
                    opacity:0,
                    y:30,
                  }}

                  whileInView={{
                    opacity:1,
                    y:0,
                  }}

                  viewport={{
                    once:true,
                  }}

                  transition={{
                    duration:0.8,
                    ease:[0.16,1,0.3,1],
                  }}

                  className="
                    w-full
                    h-auto
                    block
                    object-cover
                  "

                />

              </motion.div>

            </Reveal>

          ))}


        </Masonry>




        {/* View More */}

        <div className="flex justify-center mt-16 md:mt-20">


          <Link

            to="/gallery"

            className="
              border
              border-bone/60
              text-bone
              px-10
              py-4
              uppercase
              tracking-[0.25em]
              text-xs
              hover:bg-bone
              hover:text-ink
              transition-all
              duration-500
            "

          >

            View Full Gallery

          </Link>


        </div>


      </div>

    </section>
  );
}