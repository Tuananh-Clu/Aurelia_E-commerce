import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 6000); // 3s loading
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1, top: 0 }}
        animate={{ opacity: 1, top: 0 }}
        exit={{ opacity: 0, top: -50 }}
        transition={{ duration: 7, ease: "easeInOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-[2000] overflow-hidden"
      >
        {/* Floating Particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              y: -50 - Math.random() * 50,
              x: Math.random() * 100 - 50,
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-2 h-2 bg-gray-300 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(156,163,175,0.3)]" />
            <span className="absolute inset-0 rounded-full bg-white/20 animate-light-move blur-lg"></span>
            <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-5xl font-serif text-gray-800 tracking-wider">
                A
              </span>
            </div>
          </div>

          <h1 className="text-5xl font-serif font-extrabold tracking-widest relative overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300">
            AURELIA
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-shimmer"></span>
          </h1>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }

          @keyframes lightMove {
            0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 0.2; }
            50% { transform: translate(-50%, -50%) rotate(180deg); opacity: 0.5; }
            100% { transform: translate(-50%, -50%) rotate(360deg); opacity: 0.2; }
          }
          .animate-light-move {
            animation: lightMove 3s infinite linear;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

