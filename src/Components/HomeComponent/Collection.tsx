import { useNavigate } from "react-router-dom";
import data from "../../assets/DataMock/dataSeason.json";
import { motion } from "framer-motion";

export const Collection = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-12 py-16 space-y-24 relative z-1 mt-20">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 text-center mb-12">
        Các Bộ Sưu Tập Nổi Bật
      </h1>

      {data.luxury_women_collections.map((item, index) => (
        <motion.div
          key={item.id}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className={`flex flex-col md:flex-row items-center gap-8 ${
            index % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Hình ảnh */}
          <div className="md:w-1/2 relative rounded-3xl overflow-hidden shadow-xl">
            <img
              src={item.banner}
              alt={item.name}
              className="w-full h-[420px] object-cover transform transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
          </div>

          {/* Nội dung */}
          <div className="md:w-1/2 flex flex-col justify-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm shadow-md">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-1">
              {item.slug}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">
              {item.name}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 italic mb-4">
              {item.slogan}
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {item.description}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/Collection/${item.slug}`)}
              className="self-start bg-gradient-to-r from-gray-900 to-gray-700 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:from-gray-800 hover:to-gray-600 transition"
            >
              Xem sản phẩm
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
