import { useState } from "react";
import dataWatch from "../../assets/DataMock/luxury_watches.json";
import dataJewerly from "../../assets/DataMock/luxury_jewelry.json";
import { CardProduct } from "../CardProduct";
export const BestSeller = () => {
  const [StateButton, setStateButton] = useState("Newest");
  const handleClick = (item: string) => {
    setStateButton(item);
  };
  return (
    <div className="relative z-1 mt-20  backdrop-blur-sm py-16">
      <h1 className="text-3xl font-heading font-bold text-gray-900 text-center mb-8">
        Our Product
      </h1>

      <div className="flex flex-row items-center justify-center gap-6 mb-12">
        <button
          onClick={() => handleClick("Newest")}
          className={`px-6 py-3  ${
            StateButton === "Newest" ? "bg-gray-600 text-white" : "bg-white/30"
          } backdrop-blur-md hover:text-black  text-black font-semibold rounded-2xl border border-white/40 shadow-lg transition-all hover:scale-105 hover:bg-white/50 cursor-pointer`}
        >
          Mới Nhất
        </button>
        <button
          onClick={() => handleClick("Popular")}
          className={`px-6 py-3 ${
            StateButton === "Popular" ? "bg-gray-600 text-white" : "bg-white/30"
          }  backdrop-blur-md hover:text-black  text-black font-semibold rounded-2xl border border-white/40 shadow-lg transition-all hover:scale-105 hover:bg-white/50 cursor-pointer`}
        >
          Bán Chạy
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 px-6">
        {(StateButton === "Newest" ? dataWatch : dataJewerly).map((item) => (
          <CardProduct item={item}/>
        ))}
      </div>
      
    </div>
    
  );
};
