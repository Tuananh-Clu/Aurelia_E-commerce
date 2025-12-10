import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/Author";

export const FormAuthor = () => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const { logIn, register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (type: "login" | "register") => {
    if (type === "login") {
      logIn(email, password);
    } else {
      register(username, email, password);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <main className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center mb-8 text-gray-900 tracking-tight">
          {tab === "login" ? "Đăng nhập" : "Đăng ký"}
        </h1>

        {/* Tab switch */}
        <div className="flex mb-8 border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 text-sm font-medium transition ${
              tab === "login"
                ? "bg-black text-white"
                : "bg-white text-gray-500 hover:text-gray-800"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2 text-sm font-medium transition ${
              tab === "register"
                ? "bg-black text-white"
                : "bg-white text-gray-500 hover:text-gray-800"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {tab === "login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid gap-4"
            >
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                placeholder="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleSubmit("login")}
                className="w-full py-3 rounded-lg bg-black text-white font-medium text-sm"
              >
                Đăng nhập
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid gap-4"
            >
              <input
                placeholder="Họ tên"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                placeholder="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleSubmit("register")}
                className="w-full py-3 rounded-lg bg-black text-white font-medium text-sm"
              >
                Đăng ký
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
