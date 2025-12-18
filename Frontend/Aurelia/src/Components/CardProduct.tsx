import { motion } from "framer-motion";
import { LazyImage } from "./SEO/LazyImage";

export const CardProduct = ({item}:{item:any}) => {
  const imageSrc = Array.isArray(item.images) ? item.images[0] : item.images;
  
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl bg-white/95 shadow-lg hover:shadow-2xl transition-all duration-300 p-5 border border-gray-100 cursor-pointer"
    >
      <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-2xl mb-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <LazyImage
            src={imageSrc}
            alt={item.name || "Sản phẩm"}
            className="w-full h-full object-cover transform transition-transform duration-500"
            width={400}
            height={400}
          />
        </motion.div>
      </div>
      <h1 className="text-xl font-semibold font-heading">{item.name}</h1>
      {item.brand && <h2 className="text-gray-500">{item.brand}</h2>}
      {item.price && (
        <p className="text-lg font-bold mt-2">
          {item.price.toLocaleString("vi-VN")} $
        </p>
      )}
      {item.stock !== undefined && <p className="text-gray-500">Số lượng: {item.stock}</p>}
    </motion.div>
  );
};
