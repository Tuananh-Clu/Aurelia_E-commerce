import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../../contexts/CartContext";
import { Menu, X, ShoppingCartIcon } from "lucide-react";
import logo from "../../assets/aurelia_logo_svg.svg";

export const Navbar = () => {
  const navigate = useNavigate();
  const { CartDataAdd } = useContext(CartContext);

  const [openMenu, setOpenMenu] = useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/collection" },
    { label: "Products", path: "/fashion/products" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="w-full fixed top-0 left-0 z-[100] bg-black/30 backdrop-blur-md border-b border-white/10"
      >
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-10">
          <div className="h-16 flex items-center justify-between md:justify-around">
            <ul className="hidden md:flex flex-row gap-8 items-center text-white font-heading">
              <motion.li
                whileHover={{ y: -2, color: "#a6b0bb" }}
                onClick={() => navigate("/")}
              >
                Home
              </motion.li>
              <motion.li
                whileHover={{ y: -2, color: "#a6b0bb" }}
                onClick={() => navigate("/collection")}
              >
                Collections
              </motion.li>
              <motion.li
                whileHover={{ y: -2, color: "#a6b0bb" }}
                onClick={() => navigate("/fashion/products")}
              >
                Product
              </motion.li>
            </ul>

            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                delay: 0.1,
              }}
              src={logo}
              alt="Logo"
              className="w-44 md:w-56 opacity-95 cursor-pointer"
              onClick={() => navigate("/")}
            />

            <ul className="hidden md:flex flex-row gap-8 items-center text-white font-heading">
              <motion.li
                whileHover={{ y: -2, color: "#a6b0bb" }}
                onClick={() => navigate("/search")}
              >
                Search
              </motion.li>
              <motion.li
                className="flex flex-row"
                whileHover={{ y: -2, color: "#a6b0bb" }}
                onClick={() => navigate("/cart")}
              >
                Cart{" "}
                {CartDataAdd?.length > 0 && (
                  <motion.div
                    className="relative flex flex-col gap-3"
                    initial={{ right: 10, opacity: 0 }}
                    animate={{ right: 0, opacity: 100 }}
                    transition={{ duration: 1.0 }}
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.0 }}
                      className=" absolute top-[-10px] right-[-10px] bg-red-700 rounded-full w-4 h-4 flex items-center justify-center text-center"
                    >
                      {CartDataAdd.length}
                    </motion.div>
                    <ShoppingCartIcon className="w-5" />
                  </motion.div>
                )}
              </motion.li>
              <motion.li
                whileHover={{ y: -2, color: "#a6b0bb" }}
                onClick={() => navigate("/account")}
              >
                Account
              </motion.li>
            </ul>
            <div className="md:hidden text-white">
              <button onClick={() => setOpenMenu(true)}>
                <Menu className="w-7" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE OFFCANVAS MENU */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1100] p-6"
          >
            {/* Close button */}
            <div className="flex justify-end">
              <button onClick={() => setOpenMenu(false)}>
                <X className="text-white w-8" />
              </button>
            </div>

            {/* Mobile menu */}
            <ul className="mt-10 flex flex-col gap-6 text-white text-xl font-heading">
              {menuItems.map((item) => (
                <li
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setOpenMenu(false);
                  }}
                  className="cursor-pointer hover:text-gray-300"
                >
                  {item.label}
                </li>
              ))}

              <li
                onClick={() => {
                  navigate("/search");
                  setOpenMenu(false);
                }}
                className="cursor-pointer flex items-center gap-2"
              >
                Search
              </li>

              <li
                onClick={() => {
                  navigate("/cart");
                  setOpenMenu(false);
                }}
                className="cursor-pointer flex items-center gap-3"
              >
                <span>Cart</span>

                {CartDataAdd?.length > 0 && (
                  <span className="ml-2 bg-red-600 w-5 h-5 flex items-center justify-center rounded-full text-xs">
                    {CartDataAdd.length}
                  </span>
                )}
              </li>

              <li
                onClick={() => {
                  navigate("/account");
                  setOpenMenu(false);
                }}
                className="cursor-pointer flex items-center gap-2"
              >
                Account
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
