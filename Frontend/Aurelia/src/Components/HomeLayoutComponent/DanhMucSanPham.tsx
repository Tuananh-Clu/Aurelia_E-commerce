import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { LazyImage } from "../SEO/LazyImage";

export const DanhMuc = [
  {
    name: "Váy",
    type: "dress",
    img: "https://i.pinimg.com/736x/58/0b/b7/580bb7f28cfbf183f2746993a181d9f7.jpg",
  },
  {
    name: "Áo",
    type: "top",
    img: "https://i.pinimg.com/1200x/9b/e4/d5/9be4d5d483ce50ddc1dd7cdedcbde159.jpg",
  },
  {
    name: "Trang Sức",
    type: "jewelry",
    img: "https://i.pinimg.com/736x/1a/d8/11/1ad8111c65c6f2781ccba0009c11cd36.jpg",
  },
  {
    name: "Đồng Hồ",
    type: "watch",
    img: "https://i.pinimg.com/736x/87/9b/ec/879bec5e2a5e23f2528bf1efd93c3f74.jpg",
  },
  {
    name: "Phụ Kiện",
    type: "accessory",
    img: "https://i.pinimg.com/1200x/c4/49/77/c44977b0c84eb51f1713c0778959fc8f.jpg",
  },
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
      <div className="w-full max-w-7xl mx-auto gap-8 px-4 md:px-0 flex flex-row  ">
        <div className="flex flex-col w-3/5 h-[676px]
        relative">
          <LazyImage
          onClick={() => handleClick(DanhMuc[0].type)}
            src={DanhMuc[0].img}
            alt={DanhMuc[0].name}
            className="w-full  h-[676px] object-cover cursor-pointer rounded-lg mb-4"
          />
          <div
            onClick={() => handleClick(DanhMuc[0].type)}
            className="text-center cursor-pointer text-lg font-medium text-white hover:text-gray-900 absolute left-0 right-0 bottom-4 mx-auto"
          >
            {DanhMuc[0].name}
          </div>
        </div>

        <div className="flex flex-col w-2/5 ">
          <div className="flex flex-row  gap-5 w-full  ">
            {DanhMuc.slice(1, 3).map((item) => (
              <div key={item.type} className="mb-6 relative">
                <LazyImage
                onClick={() => handleClick(DanhMuc[0].type)}
                  src={item.img}
                  alt={item.name}
                  className="w-67 h-59 object-cover cursor-pointer rounded-lg mb-4"
                />
                <div
                  onClick={() => handleClick(item.type)}
                  className="text-center cursor-pointer text-lg font-medium text-white hover:text-gray-900 absolute left-0 right-0 bottom-4 mx-auto"
                >
                  {item.name}
                </div>
              </div>
            ))}
          </div>
           <div className="flex flex-col relative">
            <LazyImage
            onClick={() => handleClick(DanhMuc[0].type)}
              src={DanhMuc[3].img}
              alt={DanhMuc[3].name}
              className="w-full h-48 object-cover cursor-pointer rounded-lg mb-4"
            />
            <div
              onClick={() => handleClick(DanhMuc[3].type)}
              className="text-center cursor-pointer text-lg font-medium text-white hover:text-gray-900 absolute left-0 right-0 bottom-4 mx-auto"
            >
              {DanhMuc[3].name}
            </div>
          </div>
          <div className="flex flex-col relative">
            <LazyImage
            onClick={() => handleClick(DanhMuc[0].type)}
              src={DanhMuc[4].img}
              alt={DanhMuc[4].name}
              className="w-full h-48 object-cover cursor-pointer rounded-lg mb-4"
            />
            <div
              onClick={() => handleClick(DanhMuc[4].type)}
              className="text-center cursor-pointer text-lg font-medium text-white hover:text-gray-900 absolute left-0 right-0 bottom-4 mx-auto"
            >
              {DanhMuc[4].name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
