import { Navbar } from "../Components/HomeComponent/Navbar";
import { Footer } from "../Components/HomeComponent/Footer";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import type { ChangeEvent } from "react";
import { Search as SearchIcon } from "lucide-react";
import { FilterProductContext } from "../config/FIlterProduct";
import { useNavigate } from "react-router-dom";

export const Search = () => {
  const { key, setKey, dataFilter } = useContext(FilterProductContext);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setKey(e.target.value);
  const navigate=useNavigate();
  const [more,setMore]=useState(20);

  return (
    <>
      <Navbar />
      <main className="min-h-[100vh] pt-40 px-6 md:px-10 py-16">
        <div className="max-w-5xl mx-auto ">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-semibold"
          >
            Tìm kiếm
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 relative"
          >
            <input
              value={key}
              onChange={onChange}
              placeholder="Tìm sản phẩm, thương hiệu..."
              className="w-full rounded-2xl border border-gray-200 bg-white/80 backdrop-blur px-5 py-4 pr-12 outline-none focus:ring-2 focus:ring-gray-700"
            />
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 mt-3"
          >
            {dataFilter.length} kết quả
          </motion.p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {dataFilter.slice(0, more).map((item, idx) => (
              <motion.div
              onClick={()=>navigate(`/Fashion/Products/${item.id}`)}
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden group"
              >
                <div className="h-60 overflow-hidden">
                  <motion.img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <span className="text-sm text-gray-600">{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="w-full flex items-center justify-center mt-10">
            <button onClick={()=>setMore(prev=>prev+10)} className="border-0.5 p-2 hover:bg-black hover:text-white cursor-pointer">Xem Thêm</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
