import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/type";
import { motion } from "framer-motion";
interface ProductCardProps {
  product: Product;
  index: number;
  className?: string;
  key?: string | number;
  isSale?: boolean;
  isGrayscale?: boolean;
}

export default function ProductCard({ product, index, className = "",isSale, isGrayscale }: ProductCardProps) {
  const isEven = index % 2 === 0;
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`group relative flex flex-row-reverse lg:block ${className}`}
      onClick={() => navigate(`/Fashion/Products/${product.id}`)}
    >
      <div className={`relative w-full aspect-[3/4] lg:w-[85%] ${isEven ? 'ml-auto' : 'mr-auto'} border border-slate-200 bg-white p-2 shadow-sm transition-transform duration-500 group-hover:scale-[1.02] group-hover:z-20`}>
        <img 
          src={product.thumbnail} 
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${ isGrayscale ? 'grayscale group-hover:grayscale-0' : ''}`}
          referrerPolicy="no-referrer"
        />
        
        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full cursor-pointer shadow-sm border border-white z-30 ${isSale ? 'bg-red-400/80' : 'bg-slate-300'}`}>
          <div className="opacity-0 group-hover:opacity-100 absolute right-5 top-[-4px] bg-white px-3 py-1 text-[10px] uppercase tracking-wider border border-slate-200 whitespace-nowrap shadow-lg transition-opacity duration-300">
            {isSale ? `Giảm ${product.discountValue}%` : product.type}
          </div>
        </div>
      </div>

      <div className={`absolute lg:static top-0 left-0 h-full lg:h-auto lg:w-[85%] ${isEven ? 'lg:ml-auto' : 'lg:mr-auto'} lg:mt-4 flex flex-col justify-end lg:flex-row lg:justify-between items-start lg:items-center pointer-events-none`}>
        <div className="vertical-text lg:writing-mode-horizontal lg:transform-none lg:rotate-0 text-[10px] tracking-[0.25em] text-slate-400 uppercase absolute left-[-2.5rem] top-0 h-full py-4 lg:static lg:h-auto lg:p-0">
          {product.brand} {product.name}
        </div>
        <div className="hidden lg:block h-[1px] flex-grow bg-slate-200 mx-4"></div>
        <div className="hidden lg:block font-serif italic text-lg text-slate-800">
          {product.price.toLocaleString("vi-VN")}₫
        </div>
      </div>

      <div className="lg:hidden absolute bottom-[-2rem] right-0 font-serif italic text-sm text-slate-800">
        {product.price.toLocaleString("vi-VN")}₫
      </div>
    </motion.div>
  );
}
