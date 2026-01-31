import { Collection } from "@/Features/Home/components/Collection";
import { DanhMucSanPham } from "@/Features/Home/components/DanhMucSanPham";
import { Footer } from "@/Features/Home/components/Footer";
import { HeroBanner } from "@/Features/Home/components/HeroBanner";
import { Navbar } from "@/Features/Home/components/Navbar";
import { Story } from "@/Features/Home/components/Story";
import { HotProducts } from "@/Features/Home/components/HotProducts";
import { DiscountProducts } from "@/Features/Home/components/DiscountProducts";
import { BrandMarquee } from "@/Features/Home/components/BrandMarquee";
import { DynamicMetaTags } from "@/services/SEO/DynamicMetaTags";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";


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
    <>
      <DynamicMetaTags
        title="Aurelia - Thời Trang Cao Cấp | Trang Chủ"
        description="Khám phá bộ sưu tập thời trang cao cấp tại Aurelia. AI đo số đo thông minh, gợi ý size chính xác và hệ thống loyalty points hấp dẫn."
        keywords="thời trang, mua sắm online, quần áo, fashion, AI đo số đo, Aurelia"
        url={window.location.href}
      />
      <motion.div
        initial={{ opacity: 0, left: "24px", bottom: "-24px" }}
        animate={{ opacity: 1, left: "0px", bottom: "0px" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen w-full relative"
      >
      <div className="relative z-10">
        {/* Background gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
          }}
        />

        <button
        
          onClick={() => window.open(`https://${import.meta.env.VITE_URL_MESSENGER}`, "_blank")}
          className="fixed right-5 bottom-10 w-11 h-11 rounded-full bg-blue-500 shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all z-50 cursor-pointer"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>

        {isScroll && (
          <div
            onClick={handleClick}
            className="fixed bottom-25 right-5 cursor-pointer z-50 bg-black text-white w-11 h-11 flex items-center justify-center rounded-full"
          >
            <ArrowUp />
          </div>
        )}
      </div>

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
        transition={{ duration: 0.5, delay: 0.05 }}
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
      </motion.div>
    </>
  );
};
