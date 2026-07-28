import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import GallerySection from "../components/GallerySection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function Home() {

  const location = useLocation();

  useEffect(() => {

    const scrollTarget = location.state?.scrollTo;

    if (scrollTarget) {

      setTimeout(() => {

        const element = document.querySelector(scrollTarget);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

      }, 300);


      // remove old state
      window.history.replaceState({}, document.title);

    }

  }, [location]);


  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <AboutSection />
        <GallerySection />
        <ServicesSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}