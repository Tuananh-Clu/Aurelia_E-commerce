import toast from "react-hot-toast";
import { CheckCircle, XCircle, Info, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Toaster = {
  success(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ 
            x: t.visible ? 0 : 400, 
            opacity: t.visible ? 1 : 0,
            scale: t.visible ? 1 : 0.8
          }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 text-gray-800 shadow-2xl backdrop-blur-xl border-2 border-green-300/60 overflow-hidden"
          style={{
            boxShadow: "0 20px 60px rgba(34, 197, 94, 0.3), 0 0 0 1px rgba(34, 197, 94, 0.1)",
          }}
        >
          {/* Animated background gradient */}
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-emerald-400/10 to-green-400/10"
            style={{ backgroundSize: "200% 200%" }}
          />
          
          {/* Icon with glow effect */}
          <div className="relative flex-shrink-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"
              style={{
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle className="text-white" size={22} strokeWidth={2.5} />
              </motion.div>
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-green-400"
            />
          </div>

          {/* Message */}
          <div className="flex-1 relative z-10">
            <p className="font-semibold text-gray-900 text-sm leading-tight">{msg}</p>
          </div>

          {/* Close button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-white/50"
          >
            <XCircle size={18} />
          </button>

          {/* Success sparkles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: 20, 
                y: 20, 
                opacity: 0, 
                scale: 0 
              }}
              animate={{ 
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="absolute"
            >
              <Sparkles size={12} className="text-green-400" />
            </motion.div>
          ))}
        </motion.div>
      ),
      {
        position: "top-right",
        duration: 4000,
        style: {
          background: "transparent",
          boxShadow: "none",
        },
      }
    );
  },

  error(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ 
            x: t.visible ? 0 : 400, 
            opacity: t.visible ? 1 : 0,
            scale: t.visible ? 1 : 0.8
          }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-br from-red-50 via-rose-50 to-red-100 text-gray-800 shadow-2xl backdrop-blur-xl border-2 border-red-300/60 overflow-hidden"
          style={{
            boxShadow: "0 20px 60px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.1)",
          }}
        >
          {/* Animated background gradient */}
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-rose-400/10 to-red-400/10"
            style={{ backgroundSize: "200% 200%" }}
          />
          
          {/* Icon with shake effect */}
          <div className="relative flex-shrink-0">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                x: [0, -2, 2, -2, 2, 0]
              }}
              transition={{ 
                scale: { type: "spring", delay: 0.1 },
                rotate: { type: "spring", delay: 0.1 },
                x: { delay: 0.3, duration: 0.5 }
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg"
              style={{
                boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
              }}
            >
              <XCircle className="text-white" size={22} strokeWidth={2.5} />
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-red-400"
            />
          </div>

          {/* Message */}
          <div className="flex-1 relative z-10">
            <p className="font-semibold text-gray-900 text-sm leading-tight">{msg}</p>
          </div>

          {/* Close button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-white/50"
          >
            <XCircle size={18} />
          </button>
        </motion.div>
      ),
      {
        position: "top-right",
        duration: 4000,
        style: {
          background: "transparent",
          boxShadow: "none",
        },
      }
    );
  },

  info(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ 
            x: t.visible ? 0 : 400, 
            opacity: t.visible ? 1 : 0,
            scale: t.visible ? 1 : 0.8
          }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 text-gray-800 shadow-2xl backdrop-blur-xl border-2 border-blue-300/60 overflow-hidden"
          style={{
            boxShadow: "0 20px 60px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)",
          }}
        >
          {/* Animated background gradient */}
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-cyan-400/10 to-blue-400/10"
            style={{ backgroundSize: "200% 200%" }}
          />
          
          {/* Icon with pulse effect */}
          <div className="relative flex-shrink-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg"
              style={{
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Info className="text-white" size={22} strokeWidth={2.5} />
              </motion.div>
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-blue-400"
            />
          </div>

          {/* Message */}
          <div className="flex-1 relative z-10">
            <p className="font-semibold text-gray-900 text-sm leading-tight">{msg}</p>
          </div>

          {/* Close button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-white/50"
          >
            <XCircle size={18} />
          </button>
        </motion.div>
      ),
      {
        position: "top-right",
        duration: 4000,
        style: {
          background: "transparent",
          boxShadow: "none",
        },
      }
    );
  },

  loading(msg: string) {
    return toast.custom(
      (t) => (
        <motion.div
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ 
            x: t.visible ? 0 : 400, 
            opacity: t.visible ? 1 : 0,
            scale: t.visible ? 1 : 0.8
          }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 text-gray-800 shadow-2xl backdrop-blur-xl border-2 border-purple-300/60 overflow-hidden"
          style={{
            boxShadow: "0 20px 60px rgba(147, 51, 234, 0.3), 0 0 0 1px rgba(147, 51, 234, 0.1)",
          }}
        >
          {/* Animated background gradient */}
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-indigo-400/10 to-purple-400/10"
            style={{ backgroundSize: "200% 200%" }}
          />
          
          {/* Spinning icon */}
          <div className="relative flex-shrink-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg"
              style={{
                boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                <Loader2 className="text-white" size={22} strokeWidth={2.5} />
              </motion.div>
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-purple-400"
            />
          </div>

          {/* Message */}
          <div className="flex-1 relative z-10">
            <p className="font-semibold text-gray-900 text-sm leading-tight">{msg}</p>
          </div>
        </motion.div>
      ),
      {
        position: "top-right",
        duration: Infinity,
        style: {
          background: "transparent",
          boxShadow: "none",
        },
      }
    );
  },
};
