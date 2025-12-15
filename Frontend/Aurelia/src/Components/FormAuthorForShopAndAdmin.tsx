import { User, Lock, Store, Shield } from "lucide-react";
import { Navbar } from "./HomeLayoutComponent/Navbar";
import { Footer } from "./HomeLayoutComponent/Footer";
import { useContext, useState } from "react";
import { AuthForShopContext } from "../contexts/AuthorForShop";
import { AuthorForAdminContext } from "../contexts/AuthorForAdmin";

export default function FormAuthorForShopAndAdmin() {
  const { logIn,  errorMessage } = useContext(AuthForShopContext);
  const { Login, errorMessages } = useContext(AuthorForAdminContext);


  const [mode, setMode] = useState<"shop" | "admin">("shop");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async () => {
    if (!email || !password) return;
    if (mode === "admin") {
      await Login(email, password);
    } else {
      await logIn(email, password);
    }
  };


  const errorText = mode === "shop" ? errorMessage : errorMessages;

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100">
        <div className="backdrop-blur-xl bg-white/60 shadow-2xl rounded-3xl w-full max-w-md p-10 border border-white/70">
          {/* Mode Switch */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/40 backdrop-blur-md border border-gray-300 rounded-full p-1 shadow-inner">
              <button
                onClick={() => setMode("shop")}
                className={`px-6 py-2 rounded-full flex items-center gap-2 transition 
                  ${mode === "shop" ? "bg-gray-900 text-white shadow-md" : "text-gray-600"}`}
              >
                <Store className="w-4 h-4" /> Shop
              </button>
              <button
                onClick={() => setMode("admin")}
                className={`px-6 py-2 rounded-full flex items-center gap-2 transition
                  ${mode === "admin" ? "bg-gray-900 text-white shadow-md" : "text-gray-600"}`}
              >
                <Shield className="w-4 h-4" /> Admin
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-800 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl border border-white/30">
              S
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-wide">
              {mode === "shop" ? "Shop Login" : "Admin Login"}
            </h1>
            <p className="text-gray-600 mt-2">
              {mode === "shop" ? "Đăng nhập để quản lý cửa hàng" : "Đăng nhập quản trị hệ thống"}
            </p>
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
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xl 
                focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xl 
                focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
              />
            </div>

            {errorText && (
              <div className="text-red-600 text-sm text-center">{errorText}</div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:opacity-95 
              text-white font-semibold rounded-xl shadow-lg transition duration-300"
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            <a href="/" className="hover:text-gray-800 transition">← Quay lại trang chủ</a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

