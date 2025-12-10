import { motion } from "framer-motion";

export const LayoutPreview = ({
  current,
  statusState,
}: any) => {

  const styleByLayoutMain: Record<string, any> = {
    A: {
      wrapper:
        "relative flex flex-row-reverse items-center justify-around px-20 gap-4",
      image:
        "w-full h-[65vh]  object-cover brightness-75 hover:brightness-90 transition-transform duration-700 rounded-3xl shadow-2xl",
      text: "w-[45%] flex flex-col gap-4 text-gray-900 ",
      btn: "from-gray-700 to-black text-white hover:from-black hover:to-gray-800 border-gray-400",
    },
    B: {
      wrapper:
        "relative flex flex-row items-center  justify-around px-20 gap-4 ",
      image:
        "w-full h-[65vh]  object-cover rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-700",
      text: "w-[45%] flex flex-col gap-4 text-gray-900",
      btn: "mt-4 px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition",
    },
    C: {
      wrapper: "relative items-center overflow-hidden",
      image: "absolute  w-full h-full object-cover opacity-80  transition",
      text: "z-10 col-start-1 space-y-6 text-center w-full h-full justify-center items-center flex flex-col",
      btn: "mt-4  bg-white/15 border border-white/30 rounded-full hover:bg-white hover:text-indigo-900 transition",
    },
    D: {
      wrapper:
        "relative  overflow-hidden bg-black text-white flex flex-col items-center justify-center rounded-[3rem]",
      image:
        "absolute inset-0 w-full h-full object-cover opacity-70 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] transition-transform duration-1000 hover:scale-110",
      text: "relative z-10 flex flex-col items-center text-center gap-6 backdrop-blur-sm bg-white/10 px-12 py-10 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.2)]",
      btn: "mt-6 px-10 py-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white hover:text-black transition-all duration-300",
    },

    E: {
      wrapper:
        "relative overflow-hidden h-[90vh] flex flex-col items-center justify-center bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#334155] text-white rounded-[3rem] ",
      image:
        "absolute inset-0 w-full h-full object-cover opacity-70 [clip-path:polygon(0_0,100%_10%,100%_90%,0_100%)] transition-transform duration-1000 hover:scale-110",
      text: "relative z-10 max-w-3xl text-center space-y-6 transform -skew-y-2 bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-[0_0_40px_rgba(255,255,255,0.15)]",
      btn: "mt-4 px-10 py-3 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white rounded-full hover:scale-105 hover:shadow-[0_10px_30px_rgba(192,132,252,0.5)] transition-all duration-300",
    },
  };

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
        "w-full md:w-[60%] h-[450px] object-cover rounded-[2rem] shadow-xl hover:scale-105 transition-transform duration-700",
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

  const style =
    statusState === "Main" || statusState.includes("Main")
      ? styleByLayoutMain[current?.layout]
      : styleByLayoutStory[current?.layout];
 
  return (
    <div>
      <div className="flex flex-row justify-between gap-8 items-start">
        {/* Preview */}
        <motion.div
          key={current?.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl  w-full h-[80vh]  shadow-xl  bg-gray-100/70 backdrop-blur-lg ${style?.wrapper}  bg-gradient-to-r from-gray-50 via-white to-gray-100 rounded-[3rem] overflow-hidden`}
        >
          <div>
            <img
              src={current?.linkUrl}
              alt={current?.mainTitle}
              className={`${style?.image}`}
            />
          </div>

          <div
            className={` ${style?.text}`}
            style={{ color: current?.colorText }}
          >
            <h2
              className="text-5xl font-extrabold drop-shadow-md tracking-tight"
              style={{ color: current?.colorMainTitle }}
            >
              {current?.mainTitle}
            </h2>
            {current?.h1 && (
              <p className="text-xl font-medium mt-2 opacity-90">
                {current?.h1}
              </p>
            )}
            {current?.h2 && (
              <p className="text-base mt-1 opacity-80">{current?.h2}</p>
            )}
            {current?.paragraph && (
              <p className="text-base mt-4 max-w-2xl opacity-90">
                {current?.paragraph}
              </p>
            )}
            {statusState === "Main" || statusState.includes("Main") && (
              <button
                className={`mt-6 px-6 py-3 rounded-full font-semibold bg-gradient-to-r ${style.btn} border-2 border-solid`}
              >
                {current?.textInButton}
              </button>
            )}
          </div>
        </motion.div>


      </div>
     
    </div>
  );
};
