import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FilterProductContext } from "../../config/FIlterProduct";

export const ProductRecommend = () => {
  const {dataProduct}=useContext(FilterProductContext)
  const filter=dataProduct.filter(a=>a.rating>=4.5);
    const navigate=useNavigate()
  return (
    <div className="flex gap-4 flex-col">
      <h1 className="font-heading text-3xl text-center font-extralight mb-6">
        Sản Phẩm Có Thể Bạn Thích
      </h1>

      <div className="grid grid-cols-2 mt-10 md:grid-cols-3 px-10 cursor-pointer lg:grid-cols-4 gap-6">
        {filter?.slice(0,4).map((item, index) => (
          <div
          onClick={()=>navigate(`/Fashion/Products/${item.id}`)}
            key={index}
            className="group bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <img
              src={item.thumbnail}
              alt={item.name}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4">
              <h2 className="text-lg font-medium line-clamp-2">{item.name}</h2>
              <p className="text-gray-500 mt-1">{item.type}</p>
              <p className="text-gray-800 font-semibold mt-2">{item.price}₫</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
