import {
  Home,
  LayoutDashboard,
  Tag,
  Image,
  LogOut,
  ShoppingBag,
  BarChart3,
  Settings,
  User,
  ArrowBigLeft,
  ArrowRightCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

export const SideBoard = ({
  onClick,
  status,
}: {
  onClick: React.Dispatch<React.SetStateAction<string>>;
  status: string;
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(true);
  const menus = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, badge: null },
    { name: "Banner", icon: <Image size={20} />, badge: null },
    { name: "Mã giảm giá", icon: <Tag size={20} />, badge: "3" },
    { name: "Cửa hàng", icon: <Home size={20} />, badge: null },
    { name: "Doanh thu", icon: <BarChart3 size={20} />, badge: null },
    { name: "Collections", icon: <ShoppingBag size={20} />, badge: "12" },
    { name: "Sản phẩm", icon: <Tag size={20} />, badge: "5" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`h-screen  ${
        expanded ? "w-64" : "w-20"
      } bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-200 shadow-2xl flex flex-col border-r border-slate-800/50 relative overflow-hidden  transition-all duration-300`}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl -z-0" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className={`${expanded ? "flex justify-between items-center" : "flex flex-col items-center"} mt-4 mb-2`}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className={`${expanded? "flex items-center": "flex flex-col justify-center"} gap-3 px-6 py-6 border-b border-slate-800/50`}
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className={`${"w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-indigo-500/50"}`}
            >
              A
            </motion.div>
            <div className={`${expanded ? "block" : "hidden"}`}>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Quản lý hệ thống
              </p>
            </div>
          </motion.div>

          <span onClick={() => setExpanded(!expanded)} className="px-3 py-4 bg-slate-800/50 border-l border-slate-700/50 cursor-pointer hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 rounded-2xl">
            {expanded  ? (
              <ArrowBigLeft  />
            ) : (
              <ArrowRightCircle  />
            )}
          </span>
        </div>

        {/* User Profile Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
          className=" md:mx-3 md:mt-4 md:mb-2"
        >
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User size={20} className="text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div className={`${expanded ? "block" :"hidden"}`}>
                <p className="text-sm font-semibold text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-slate-400">admin@system.com</p>
              </div>
              <Settings
                size={16}
                className="text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300"
              />
            </div>
          </div>
        </motion.div>

        {/* Menu Section */}
        <nav className="flex-1 overflow-y-auto mt-2 space-y-1 px-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className={`text-xs font-semibold text-slate-500 uppercase tracking-wider ${expanded ?"md:px-4 md:py-2" : ""} px-2`}>
            Menu chính
          </div>
          {menus.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => onClick(item.name)}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.05 * i }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden
                ${
                  status === item.name
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
            >
              {/* Active indicator */}
              {status === item.name && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className="flex items-center gap-3 relative z-10">
                <motion.span
                  animate={{
                    scale: status === item.name ? 1.1 : 1,
                    rotate: status === item.name ? [0, -10, 10, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`${
                    status === item.name
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </motion.span>
                <span className={`${expanded ? "block":"hidden"}`}>{item.name}</span>
              </div>

              {/* Badge */}
              {item.badge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${expanded ? "block" : "hidden"} ${
                    status === item.name
                      ? "bg-white/20 text-white"
                      : "bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white"
                  }`}
                >
                  {item.badge}
                </motion.span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Footer - Logout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className={` ${expanded ? "border-t border-slate-800/50 pt-4" : "md:px-3 md:pb-4"}`}
        >
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 border border-transparent rounded-xl transition-all duration-300 group`}
          >
            <LogOut
              size={20}
              className={`${expanded ?"group-hover:text-red-400 transition-colors duration-300 ":"text-slate-400 group-hover:text-white transition-colors duration-300 "}`}
            />
            <span className={`${expanded ? "block":"hidden"}`}>Đăng xuất</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.aside>
  );
};
