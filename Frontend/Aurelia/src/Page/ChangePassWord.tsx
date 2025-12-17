import { useState } from "react";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { motion } from "framer-motion";
import { MethodChangePassWord } from "../services/EmailService";
import {  useSearchParams } from "react-router-dom";

export const ChangePassWord = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || undefined;
  const token = searchParams.get("token") || undefined;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) return;
    console.log(email,token,password);
    setLoading(true);
    MethodChangePassWord(email,token,password);
    await new Promise((r) => setTimeout(r, 1200));

    setLoading(false);
    setSuccess(true);
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
            {!success ? (
              <>
                <h1 className="text-2xl font-semibold text-slate-800">
                  Đặt lại mật khẩu
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Nhập mật khẩu mới cho tài khoản của bạn.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <input
                    type="password"
                    required
                    placeholder="Mật khẩu mới"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-300 px-4 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />

                  <input
                    type="password"
                    required
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-300 px-4 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />

                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500">
                      Mật khẩu xác nhận không khớp
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || password !== confirmPassword}
                    className="w-full h-11 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition disabled:opacity-60"
                  >
                    {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-slate-800">
                  Thành công
                </h1>
                <p className="mt-3 text-sm text-slate-500">
                  Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập lại bằng mật khẩu mới.
                </p>

                <a
                  href="/account"
                  className="mt-6 inline-flex w-full h-11 items-center justify-center rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
                >
                  Đi đến đăng nhập
                </a>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
