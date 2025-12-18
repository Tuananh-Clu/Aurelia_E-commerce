import { motion, type Variants } from "framer-motion";
import { useContext, useMemo } from "react";
import { AdminContext } from "../../contexts/AdminContext";


export const Story = () => {
  const { StoryBanner } = useContext(AdminContext);
  const banner=useMemo(
    () => (Array.isArray(StoryBanner) ? StoryBanner : []),
    [StoryBanner]
  );
  const fade = (delay: number = 0): Variants => ({
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.8, ease: "easeOut" },
    },
  });

 const styleByLayoutStory: Record<string, any> = {
    A: {
      wrapper:
        "relative flex flex-col justify-center items-center text-center h-[750px] bg-black text-white overflow-hidden",
      image:
        "absolute inset-0 w-full h-full object-cover brightness-[0.45] scale-110 hover:scale-115 transition-transform duration-[1200ms] ease-[cubic-bezier(.4,0,.2,1)]",
      text: "relative z-10 max-w-3xl space-y-6 backdrop-blur-sm bg-white/5 px-10 py-8 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.1)]",
    },
    B: {
      wrapper:
        "relative flex flex-col items-center gap-24 py-40 px-10 bg-gradient-to-b from-white to-gray-50 rounded-[3rem] overflow-hidden",
      image:
        "w-[full] md:w-[60%] h-[450px] object-cover rounded-[2rem] shadow-xl hover:scale-105 transition-transform duration-700",
      text: "max-w-3xl text-center md:text-left space-y-4 bg-white/80 backdrop-blur-sm p-10 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)]",
    },
    C: {
      wrapper:
        "relative flex flex-col justify-end items-start h-[750px] text-white overflow-hidden",
      image:
        "absolute inset-0 w-full h-full object-cover brightness-[0.4] hover:brightness-[0.5] transition duration-700",
      text: "relative z-10 p-20 max-w-2xl space-y-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-[3rem]",
    },
    D: {
      wrapper:
        "relative  bg-white overflow-hidden rounded-[3rem] flex items-center justify-center bg-black ",
      image:
        "absolute w-[60%] h-[80%] object-cover rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.25)] left-[10%] top-[10%] rotate-[-3deg] hover:rotate-0 transition-all duration-700",
      text: "absolute right-[8%] bottom-[15%] max-w-md bg-black text-white px-10 py-8 rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.3)] leading-relaxed space-y-4",
    },
  };
  return (
    <>
      {banner
        .filter((b) => b.active)
        .map((banner) => {
          const layoutKey = (banner.layout || "A").toUpperCase() as keyof typeof styleByLayoutStory;
          const style = styleByLayoutStory[layoutKey] || styleByLayoutStory.A;

          return (
            <section
              key={banner.id}
              className={`${style.wrapper} mb-16  shadow-lg overflow-hidden relative`}
            >
              {/* 🌆 Background */}
              <div className="absolute inset-0">
                <img
                  src={banner.linkUrl}
                  alt={banner.mainTitle}
                  className={style.image}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${style.overlay}`} />
              </div>


              {/* 📝 Content */}
              <div className={style.text}>
                <motion.h2
                  variants={fade(0)}
                  initial="hidden"
                  animate="show"
                  className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r bg-clip-text text-transparent tracking-tight"
                  style={{ color: banner.colorMainTitle }}
                >
                  {banner.mainTitle}
                </motion.h2>

                {banner.h1 && (
                  <motion.h3
                    variants={fade(0.2)}
                    initial="hidden"
                    animate="show"
                    className={`text-xl md:text-2xl font-medium mb-4 ${banner.colorText}`}
                    style={{color:banner.colorText}}
                  >
                    {banner.h1}
                  </motion.h3>
                )}

                {banner.pagaraph && (
                  <motion.p
                    variants={fade(0.3)}
                    initial="hidden"
                    animate="show"
                    className="text-base md:text-lg leading-relaxed text-gray-100/90 mb-6"
                    style={{color:banner.colorText}}
                  >
                    {banner.pagaraph}
                  </motion.p>
                )}

                {banner.H2 && (
                  <motion.div
                    variants={fade(0.5)}
                    initial="hidden"
                    animate="show"
                    className="mt-8"
                  >
                    <h3
                      className={`text-lg md:text-xl italic ${style.quote} font-light tracking-wide`}
                    >
                      “{banner.H2}”
                    </h3>
                  </motion.div>
                )}
              </div>
            </section>
          );
        })}
    </>
  );
};
