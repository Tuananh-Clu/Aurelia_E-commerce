import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FilterProductContext } from "../../contexts/FIlterProduct";

export const DanhMuc = [
  {
    name: "Váy",
    type: "dress",
    img: "https://i.pinimg.com/736x/58/0b/b7/580bb7f28cfbf183f2746993a181d9f7.jpg"
  },
  {
    name: "Áo",
    type: "top",
    img: "https://i.pinimg.com/1200x/9b/e4/d5/9be4d5d483ce50ddc1dd7cdedcbde159.jpg"
  },
  {
    name: "Trang Sức",
    type: "jewelry",
    img: "https://i.pinimg.com/736x/1a/d8/11/1ad8111c65c6f2781ccba0009c11cd36.jpg"
  },
  {
    name: "Đồng Hồ",
    type: "watch",
    img: "https://i.pinimg.com/736x/87/9b/ec/879bec5e2a5e23f2528bf1efd93c3f74.jpg"
  },
  {
    name: "Phụ Kiện",
    type: "accessory",
    img: "https://i.pinimg.com/1200x/c4/49/77/c44977b0c84eb51f1713c0778959fc8f.jpg"
  }
];

export const DanhMucSanPham = () => {
  const navigate = useNavigate();
  const { setKey } = useContext(FilterProductContext);

  const handleClick = (item: string) => {
    navigate("/Fashion/Products");
    setKey(item);
  };

  return (
    <div className="relative z-1 mt-16">
      <h1 className="text-3xl md:text-4xl tracking-tight font-heading font-bold text-gray-900 text-center mb-12">
        Danh Mục Sản Phẩm
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto px-6">
        {DanhMuc.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(item.type)}
            className="relative group h-44 md:h-56 rounded-2xl overflow-hidden shadow-md cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
          >
            {/* Ảnh */}
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition duration-500"></div>
            {/* Text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <h2 className="text-white text-lg md:text-xl font-semibold drop-shadow-md">
                {item.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
