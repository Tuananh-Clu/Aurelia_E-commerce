import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { AdminContext } from "../../contexts/AdminContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const HeroBanner = () => {
  const { MainBanner } = useContext(AdminContext);
  const [index, setIndex] = useState(0);
  const banners = MainBanner.filter((b) => b.active);
  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  const data = banners[index];

  const fadeUp = (delay: number = 0): Variants => ({
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: "easeOut" },
    },
  });

  const styleByLayoutMain: Record<string, any> = {
    A: {
      wrapper:
        "relative flex flex-col-reverse md:flex-row-reverse items-center justify-around px-6 md:px-20 gap-6",
      image:
        "w-[80vw] md:w-[25vw] h-[40vh] md:h-[65vh] object-cover brightness-75 hover:brightness-90 transition-transform duration-700 rounded-3xl shadow-2xl",
      text: "w-full md:w-[45%] flex flex-col gap-4 text-gray-900 text-center md:text-left",
      btn: "from-gray-700 to-black text-white hover:from-black hover:to-gray-800 border-gray-400",
    },

    B: {
      wrapper:
        "relative flex flex-col md:flex-row items-center justify-around px-6 md:px-20 gap-6",
      image:
        "w-[80vw] md:w-[25vw] h-[40vh] md:h-[65vh] object-cover rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-700",
      text: "w-full md:w-[45%] flex flex-col gap-4 text-gray-900 text-center md:text-left",
      btn: "mt-4 px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition",
    },

    C: {
      wrapper: "relative items-center overflow-hidden h-[80vh] md:h-[100vh]",
      image:
        "absolute inset-0 w-full h-full object-cover opacity-80 transition",
      text: "z-10 w-full h-full flex flex-col justify-center items-center text-center space-y-6 px-4",
      btn: "mt-4 bg-white/15 border border-white/30 rounded-full hover:bg-white hover:text-indigo-900 transition",
    },

    D: {
      wrapper:
        "relative overflow-hidden bg-black text-white flex flex-col items-center justify-center rounded-[2rem] md:rounded-[3rem] px-6 py-12 md:py-20",
      image:
        "absolute inset-0 w-full h-full object-cover opacity-70 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] transition-transform duration-1000 hover:scale-110",
      text: "relative z-10 flex flex-col items-center text-center gap-6 backdrop-blur-sm bg-white/10 px-6 md:px-12 py-10 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.2)]",
      btn: "mt-6 px-10 py-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white hover:text-black transition-all duration-300",
    },

    E: {
      wrapper:
        "relative overflow-hidden h-[80vh] md:h-[90vh] flex flex-col items-center justify-center text-white rounded-[2rem] md:rounded-[3rem] px-6",
      image:
        "absolute inset-0 w-full h-full object-cover opacity-70 [clip-path:polygon(0_0,100%_10%,100%_90%,0_100%)] transition-transform duration-1000 hover:scale-110",
      text: "relative z-10 max-w-3xl text-center space-y-6 transform -skew-y-2 bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(255,255,255,0.15)]",
      btn: "mt-4 px-10 py-3 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white rounded-full hover:scale-105 hover:shadow-[0_10px_30px_rgba(192,132,252,0.5)] transition-all duration-300",
    },
  };

  const style = styleByLayoutMain[data.layout];
  const slideVariants: Variants = {
    enter: { opacity: 0, x: 100 },
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.5, ease: "easeIn" },
    },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={data.id}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className={`relative flex flex-col md:flex-row items-center justify-center gap-10 w-full h-full px-8  ${style.wrapper}`}
        >
          {/* Text Section */}
          <motion.div
            variants={fadeUp()}
            initial="hidden"
            animate="show"
            className="text-center md:text-left max-w-lg z-10"
          >
            <motion.h1
              variants={fadeUp(0.1)}
              className="font-heading text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
              style={{
                background: data.colorMainTitle
                  ? `linear-gradient(to right, ${data.colorMainTitle})`
                  : undefined,
                color: data.colorMainTitle ? "transparent" : "#111",
                WebkitBackgroundClip: data.colorMainTitle ? "text" : "unset",
              }}
            >
              {data.mainTitle}
            </motion.h1>

            {data.h1 && (
              <motion.h2
                variants={fadeUp(0.2)}
                className={`text-xl md:text-2xl mb-4 ${
                  data.colorText || "text-gray-500"
                }`}
              >
                {data.h1}
              </motion.h2>
            )}

            {data.pagaraph && (
              <motion.p
                variants={fadeUp(0.3)}
                className="mb-8 leading-relaxed"
                style={{ color: data.colorText || "#555" }}
              >
                {data.pagaraph}
              </motion.p>
            )}

            <motion.a
              href={data.linkUrl}
              variants={fadeUp(0.4)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`inline-block px-7 py-3 rounded-xl border bg-gradient-to-r ${style.btn} transition`}
            >
              {data.textInButton}
            </motion.a>
          </motion.div>

          {/* Image */}
          <motion.img
            src={data.linkUrl}
            alt="Hero Banner"
            className={style.image}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={() =>
          setIndex((prev) => (prev - 1 + banners.length) % banners.length)
        }
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white rounded-full p-2 shadow-md cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      <button
        onClick={() => setIndex((prev) => (prev + 1) % banners.length)}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white rounded-full p-2 shadow-md cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-gray-800 scale-125"
                : "bg-gray-400/50 hover:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
