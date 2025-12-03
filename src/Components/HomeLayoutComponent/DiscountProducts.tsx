import { useContext } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";



export const DiscountProducts = () => {
  const { dataProduct } = useContext(FilterProductContext);
  const productSale = dataProduct?.filter((p) => p.discountValue > 0);
  const navigate=useNavigate()

  return (
    <section className="relative z-1 mt-20 px-6 py-16 ">
      {/* Tiêu đề */}
      <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-center mb-10 tracking-tight bg-gradient-to-r from-gray-700 via-gray-800 to-black text-transparent bg-clip-text drop-shadow-sm">
        Giảm giá đặc biệt
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto mb-12 rounded-full shadow"></div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {productSale?.slice(0,8).map((p) => {
          return (
            <motion.div
              onClick={() => navigate(`/Fashion/Products/${p.id}`)}
              key={p.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group p-5 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-300 shadow-md hover:shadow-2xl hover:border-gray-400 hover:ring-2 hover:ring-gray-400/50 transition-all cursor-pointer"
            >
              <div className="relative">
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  className="w-full h-52 object-cover rounded-xl shadow-sm group-hover:shadow-lg transition"
                />
                <span className="absolute top-3 left-3 text-sm px-3 py-1 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold shadow-md">
                  -{p.discountValue}%
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-xs text-gray-500 tracking-wider uppercase">{p.brand}</p>
                <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-gray-700 transition">
                  {p.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
                    {(p.price * (1 - p.discountValue / 100)).toLocaleString("vi-VN")}₫
                  </span>
                  <span className="text-sm line-through text-gray-400">
                    {p.price.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
