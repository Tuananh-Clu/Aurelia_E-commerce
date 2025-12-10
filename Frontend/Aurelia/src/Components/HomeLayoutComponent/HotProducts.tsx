import { useContext, useMemo } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import type { Product } from "../../types/type";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const HotProducts = () => {
  const { dataProduct } = useContext(FilterProductContext);
  const navigate = useNavigate();

  const hotItems = useMemo<Product[]>(() => {
    return [...(dataProduct || [])]
      .sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0) || (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 8);
  }, [dataProduct]);

  return (
    <section className="relative z-1  py-16 ">
      {/* Tiêu đề */}
      <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-center mb-10 tracking-tight bg-gradient-to-r from-gray-700 via-gray-800 to-black text-transparent bg-clip-text drop-shadow-sm">
        Sản phẩm hot
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto mb-12 rounded-full shadow"></div>

      {/* Grid sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto md:px-6 px-4">
        {hotItems.map((p) => (
          <motion.div
            onClick={() => navigate(`Fashion/Products/${p.id}`)}
            key={p.id}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="group cursor-pointer p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-300 shadow-md hover:shadow-2xl hover:border-gray-400 hover:ring-2 hover:ring-gray-400/50 transition-all"
          >
            <div className="relative">
              <img
                src={p.thumbnail}
                alt={p.name}
                className="w-full h-52 object-cover rounded-xl shadow-sm group-hover:shadow-lg transition"
              />
              <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold shadow-md">
                Hot ✦
              </span>
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-xs text-gray-500 tracking-wider uppercase">{p.brand}</p>
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition line-clamp-1">
                {p.name}
              </h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
                  {p.price.toLocaleString("vi-VN")}₫
                </span>
                <span className="text-xs text-gray-500">Đã bán {p.sold ?? 0}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
