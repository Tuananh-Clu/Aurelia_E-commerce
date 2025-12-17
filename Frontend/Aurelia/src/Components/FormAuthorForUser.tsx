import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/Author";
import { LogginWithFireBase } from "../services/auth.service";

export const FormAuthor = () => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const { logIn, register, errorMessage, setErrorMessage, fetchData } =
    useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setErrorMessage("");
    setEmail("");
    setPassword("");
    setUsername("");
    setShake(false);
  }, [tab, setErrorMessage]);

  useEffect(() => {
    if (errorMessage) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "login") {
      logIn(email, password);
    } else {
      register(username, email, password);
    }
  };
  const logInWIthGoogle = async () => {
    await LogginWithFireBase();
    const timer = setTimeout(async () => {
      const success = localStorage.getItem("IsSuccessFireBaseLogin");
      if (success === "true") {
        await fetchData({type: "client"});
      }
    }, 1000);
    return () => clearTimeout(timer);
  }
 
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
          <motion.form
            key={tab}
            initial={{ opacity: 0, y: 15 }}
            animate={
              shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { opacity: 1, y: 0 }
            }
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4"
            onSubmit={handleSubmit}
          >
            {tab === "register" && (
              <input
                placeholder="Họ tên"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            )}
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
            {errorMessage && (
              <div className="text-red-600 px-4 py-2 mt-2 rounded-lg shadow-lg text-sm text-center">
                {errorMessage}
              </div>
            )}
            <div >{tab === "login" ? <button>
              <a href="/forgot-password" className="text-sm text-gray-500 hover:underline">
                Quên mật khẩu?
              </a>
            </button> : null}
             {
              tab === "login" ? (
                <p className="text-sm text-gray-500 text-center">
                  Bạn chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("register")}
                    className="text-black font-medium hover:underline"
                  >
                    Đăng ký
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  Bạn đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className="text-black font-medium hover:underline"
                  >
                    Đăng nhập
                  </button>
                </p>
              )
            }</div>

            <div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 rounded-lg bg-black text-white font-medium text-sm"
              >
                {tab === "login" ? "Đăng nhập" : "Đăng ký"}
              </motion.button>
              <h1 className="text-center my-4 text-gray-500 text-sm">Or</h1>
              <motion.button
                onClick={logInWIthGoogle}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full mt-2 py-3 rounded-lg bg-blue-600 text-white font-medium text-sm"
              >
                Đăng nhập với Google
              </motion.button>
            </div>
          </motion.form>
        </AnimatePresence>
      </main>
    </div>
  );
};
