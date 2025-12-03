import { Collection } from "../Components/HomeLayoutComponent/Collection";
import { DanhMucSanPham } from "../Components/HomeLayoutComponent/DanhMucSanPham";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { HeroBanner } from "../Components/HomeLayoutComponent/HeroBanner";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Story } from "../Components/HomeLayoutComponent/Story";
import { HotProducts } from "../Components/HomeLayoutComponent/HotProducts";
import { DiscountProducts } from "../Components/HomeLayoutComponent/DiscountProducts";
import { BrandMarquee } from "../Components/HomeLayoutComponent/BrandMarquee";
import { LimitedOfferBanner } from "../Components/HomeLayoutComponent/LimitedOfferBanner";
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
