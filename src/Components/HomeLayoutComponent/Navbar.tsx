import { useNavigate } from "react-router-dom";
import logo from "../../assets/aurelia_logo_svg.svg";
import { motion } from "framer-motion";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import { Cart } from "../../Page/Cart";
import { ShoppingCartIcon } from "lucide-react";
export const Navbar = () => {
  const navigate = useNavigate();
  const {CartDataAdd}=useContext(CartContext)
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="w-full fixed top-0 left-0 z-[1000] bg-black/30 backdrop-blur-md border-b border-white/10"
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
            <motion.li className="flex flex-row" whileHover={{ y: -2, color: "#a6b0bb" }} onClick={() => navigate("/cart")}>Cart  {CartDataAdd.length>0 && (<motion.div className="relative flex flex-col gap-3" initial={{ right:10 , opacity:0 }}  animate={{ right:0, opacity:100 }} transition={{ duration: 1.0 }}>
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.0 }} className=" absolute top-[-10px] right-[-10px] bg-red-700 rounded-full w-4 h-4 flex items-center justify-center text-center">{CartDataAdd.length}</motion.div>
              <ShoppingCartIcon className="w-5" />
              </motion.div>)}</motion.li>
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
