import { User, Lock } from "lucide-react";
import { Navbar } from "./HomeComponent/Navbar";
import { Footer } from "./HomeComponent/Footer";
import { useContext, useEffect, useState } from "react";
import { AuthForShopContext } from "../config/AuthorForShop";
import { useNavigate } from "react-router-dom";

export default function FormAuthorForShop() {
  const { logIn, isSignned } = useContext(AuthForShopContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) return;
    await logIn(email, password);
  };

  useEffect(() => {
    if (isSignned) {
      navigate("/DashBoardShop");
    }
  }, [isSignned, navigate]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-200">
        {/* Card */}
        <div className="backdrop-blur-lg bg-white/80 shadow-2xl rounded-3xl w-full max-w-md p-10 border border-gray-100">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              S
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
              Shop Login
            </h1>
            <p className="text-gray-500 mt-2">Đăng nhập để quản lý cửa hàng</p>
          </div>

          {/* Form */}
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email cửa hàng"
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-400 focus:outline-none transition"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-400 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 text-white font-semibold rounded-xl shadow-lg transition duration-300"
            >
              Đăng nhập
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <a href="/" className="hover:text-pink-500 transition">
              ← Quay lại trang chủ
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
