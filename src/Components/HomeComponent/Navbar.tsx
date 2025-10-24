import { useNavigate } from "react-router-dom";
import logo from "../../assets/aurelia_logo_svg.svg";
import { motion } from "framer-motion";
export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="w-full fixed top-0 left-0 z-[100] bg-black/30 backdrop-blur-md border-b border-white/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <ul className="hidden md:flex flex-row gap-8 items-center text-white font-heading">
            <motion.li whileHover={{ y: -2, color: "#a6b0bb" }} onClick={() => navigate("/")}>Home</motion.li>
            <motion.li whileHover={{ y: -2, color: "#a6b0bb" }} onClick={() => navigate("/collection")}>
              Collections
            </motion.li>
            <motion.li whileHover={{ y: -2, color: "#a6b0bb" }} onClick={() => navigate("/fashion/products")}>
              Product
            </motion.li>
          </ul>

          <motion.img
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.1 }}
            src={logo}
            alt="Logo"
            className="w-44 md:w-56 opacity-95"
          />

          <ul className="hidden md:flex flex-row gap-8 items-center text-white font-heading">
            <motion.li whileHover={{ y: -2, color: "#a6b0bb" }} onClick={() => navigate("/search")}>Search</motion.li>
            <motion.li whileHover={{ y: -2, color: "#a6b0bb" }} onClick={() => navigate("/cart")}>Cart</motion.li>
            <motion.li whileHover={{ y: -2, color: "#a6b0bb" }} onClick={() => navigate("/account")}>Account</motion.li>
          </ul>

          <ul className="md:hidden flex flex-row gap-6 items-center text-white font-heading">
            <motion.li whileHover={{ y: -2, color: "#a6b0bb" }} onClick={() => navigate("/")}>Home</motion.li>
            <motion.li whileHover={{ y: -2, color: "#a6b0bb" }} onClick={() => navigate("/search")}>Search</motion.li>
            <motion.li whileHover={{ y: -2, color: "#a6b0bb" }} onClick={() => navigate("/cart")}>Cart</motion.li>
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};
