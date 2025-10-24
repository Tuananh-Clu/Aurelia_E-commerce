import { Collection } from "../Components/HomeComponent/Collection";
import { DanhMucSanPham } from "../Components/HomeComponent/DanhMucSanPham";
import { Footer } from "../Components/HomeComponent/Footer";
import { HeroBanner } from "../Components/HomeComponent/HeroBanner";
import { Navbar } from "../Components/HomeComponent/Navbar";
import { Story } from "../Components/HomeComponent/Story";
import { HotProducts } from "../Components/HomeComponent/HotProducts";
import { DiscountProducts } from "../Components/HomeComponent/DiscountProducts";
import { BrandMarquee } from "../Components/HomeComponent/BrandMarquee";
import { LimitedOfferBanner } from "../Components/HomeComponent/LimitedOfferBanner";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export const Home = () => {
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full relative">
      {isScroll ? (
        <div
          onClick={handleClick}
          className="fixed bg-black px-2 rounded-full text-white py-2 bottom-10 z-100 right-10"
        >
          <ArrowUp />
        </div>
      ) : (
        ""
      )}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
        }}
      />
      <Navbar />
      <HeroBanner />
            <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Story />
      </motion.section>
      <BrandMarquee />
      <LimitedOfferBanner />
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <HotProducts />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <DiscountProducts />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <DanhMucSanPham />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Collection />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      ></motion.section>

      <Footer />
    </div>
  );
};
