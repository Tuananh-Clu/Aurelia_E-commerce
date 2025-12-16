import { useState } from "react";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { motion } from "framer-motion";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { MethodForgotPassword } from "../services/EmailService";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    MethodForgotPassword(email);
        await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-white shadow-xl p-8">
            {!submitted ? (
              <>
                <h1 className="text-2xl font-semibold text-slate-800">
                  Quên mật khẩu
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Nhập email đã đăng ký. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="Email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-300 px-4 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition disabled:opacity-60"
                  >
                    {loading ? "Đang gửi..." : "Gửi email xác nhận"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <a
                    href="/account"
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    Quay lại đăng nhập
                  </a>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-slate-800">
                  Kiểm tra email
                </h1>
                <p className="mt-3 text-sm text-slate-500">
                  Nếu email <span className="font-medium text-slate-700">{email}</span> tồn tại trong hệ thống,
                  bạn sẽ nhận được liên kết đặt lại mật khẩu trong vài phút.
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 w-full h-11 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
                >
                  Gửi lại
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
    
  );
};