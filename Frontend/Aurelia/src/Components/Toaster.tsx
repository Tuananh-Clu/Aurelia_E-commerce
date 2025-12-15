import toast from "react-hot-toast";
import { Check, X, Info, Loader2 } from "lucide-react";
import { motion, easeOut} from "framer-motion";

const motionBase = {
  initial: { y: -6, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -6, opacity: 0 },
  transition: { duration: 0.18, ease: easeOut },
};

const baseClass =
  "flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.06)]";

export const Toaster = {
  success(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          {...motionBase}
          animate={t.visible ? motionBase.animate : motionBase.exit}
          className={`${baseClass} border-zinc-200`}
        >
          <Check size={14} className="text-gray-600" />
          <span className="text-xs font-medium flex-1">{msg}</span>
          <button onClick={() => toast.dismiss(t.id)}>
            <X size={14} className="text-gray-400 hover:text-gray-600" />
          </button>
        </motion.div>
      ),
      { position: "top-center", duration: 2800 }
    );
  },

  error(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          {...motionBase}
          animate={t.visible ? motionBase.animate : motionBase.exit}
          className={`${baseClass} border-zinc-300`}
        >
          <X size={14} className="text-gray-600" />
          <span className="text-xs font-medium flex-1">{msg}</span>
          <button onClick={() => toast.dismiss(t.id)}>
            <X size={14} className="text-gray-400 hover:text-gray-600" />
          </button>
        </motion.div>
      ),
      { position: "top-center", duration: 3000 }
    );
  },

  info(msg: string) {
    toast.custom(
      (t) => (
        <motion.div
          {...motionBase}
          animate={t.visible ? motionBase.animate : motionBase.exit}
          className={`${baseClass} border-slate-200`}
        >
          <Info size={14} className="text-gray-500" />
          <span className="text-xs font-medium flex-1">{msg}</span>
          <button onClick={() => toast.dismiss(t.id)}>
            <X size={14} className="text-gray-400 hover:text-gray-600" />
          </button>
        </motion.div>
      ),
      { position: "top-center", duration: 2800 }
    );
  },

  loading(msg: string) {
    return toast.custom(
      () => (
        <motion.div {...motionBase} className={`${baseClass} border-zinc-200`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          >
            <Loader2 size={14} className="text-gray-500" />
          </motion.div>
          <span className="text-xs font-medium">{msg}</span>
        </motion.div>
      ),
      { position: "top-right", duration: Infinity }
    );
  },
};
