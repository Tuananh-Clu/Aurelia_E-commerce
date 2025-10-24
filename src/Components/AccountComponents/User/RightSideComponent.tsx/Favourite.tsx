import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "../../../../types/type";
import { useNavigate } from "react-router-dom";

export const Favourite = ({ dataFavouriteItemUser }: { dataFavouriteItemUser: Product[] }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
        <h1 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <Heart size={16} className="text-rose-600" /> Sản Phẩm Yêu Thích
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {dataFavouriteItemUser.slice(0, 6).map((p, i) => (
            <motion.div
              onClick={() => navigate(`/Fashion/products/${p.id}`)}
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm hover:shadow-lg text-center border border-gray-100 transition-all"
            >
              <img
                className="w-24 h-24 object-cover mx-auto rounded-xl"
                src={p.thumbnail}
                alt={p.name}
              />
              <h2 className="mt-2 text-sm font-medium text-gray-800 line-clamp-1">
                {p.name}
              </h2>
              <p className="text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {p.price.toLocaleString("vi-VN")}₫
              </p>
            </motion.div>
          ))}
        </div>
      </div>
  )
}
