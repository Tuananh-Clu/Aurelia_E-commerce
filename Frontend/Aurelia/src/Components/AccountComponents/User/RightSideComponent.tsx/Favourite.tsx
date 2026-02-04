import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "../../../../types/type";
import { useNavigate } from "react-router-dom";

export const Favourite = ({
  dataFavouriteItemUser,
}: {
  dataFavouriteItemUser: Product[];
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 h-screen">
      <div className="flex items-center gap-3">
        <Heart size={16} className="text-neutral-500" />
        <h1 className="text-sm tracking-widest uppercase text-neutral-900">
          Sản phẩm yêu thích
        </h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {dataFavouriteItemUser.slice(0, 6).map((p, i) => (
          <motion.div
            key={i}
            onClick={() => navigate(`/Fashion/products/${p.id}`)}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="
              border border-neutral-200
              bg-white
              p-5
              cursor-pointer
              transition
              hover:border-neutral-300
            "
          >
            <img
              src={p.thumbnail}
              alt={p.name}
              className="w-full aspect-square object-cover mb-4"
            />
            <div className="space-y-1">
              <p className="text-xs tracking-widest uppercase text-neutral-400">
                Favourite
              </p>

              <h2 className="text-sm text-neutral-900 line-clamp-1">
                {p.name}
              </h2>

              <p className="text-sm font-light text-neutral-900 mt-2">
                {p.price.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
