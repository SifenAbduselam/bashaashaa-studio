import { motion } from "framer-motion";
import Masonry from "react-masonry-css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { fullGallery } from "../data/fullGallery";

import "../styles/masonry.css";


const breakpointColumnsObj = {
  default: 3,
  1024: 3,
  768: 2,
  640: 1,
};


export default function FullGallery() {

  return (
    <>
      <Navbar />

      <main className="bg-ink min-h-screen pt-32 pb-24">

        <section className="max-w-7xl mx-auto px-6 md:px-10">


          {/* Heading */}
          <Reveal>

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


            <h1 className="
              font-display
              text-5xl
              md:text-7xl
              text-bone
              leading-tight
            ">
              Full Gallery
            </h1>


            <p className="
              mt-6
              text-smoke
              max-w-2xl
              leading-relaxed
            ">
              A collection of weddings, nikkah ceremonies, graduations,
              portraits, birthdays, cultural events, maternity sessions,
              and timeless moments captured by Bashaashaa Studio.
            </p>


          </Reveal>



          {/* Masonry Gallery */}
          <div className="mt-20">


            <Masonry

              breakpointCols={breakpointColumnsObj}

              className="my-masonry-grid"

              columnClassName="my-masonry-grid_column"

            >


              {fullGallery.map((photo, index) => (

                <Reveal
                  key={photo.id}
                  delay={(index % 6) * 0.05}
                >


                  <motion.div

                    whileHover={{
                      scale: 1.02,
                    }}

                    transition={{
                      duration:0.35,
                      ease:"easeOut",
                    }}

                    className="
                      overflow-hidden
                    "

                  >


                    <motion.img

                      src={photo.src}

                      alt={photo.alt}

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
                      "

                    />


                  </motion.div>


                </Reveal>


              ))}


            </Masonry>


          </div>


        </section>


      </main>


      <Footer />

    </>
  );
}