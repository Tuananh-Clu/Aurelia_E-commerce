import { useLocation, useParams } from "react-router-dom";
import { Navbar } from "../Components/HomeComponent/Navbar";
import { Heart } from "lucide-react";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductRecommend } from "../Components/ProductComponent/ProductRecommend";
import { Footer } from "../Components/HomeComponent/Footer";
import dataCollection from "../assets/DataMock/dataSeason.json";
import { FilterProductContext } from "../config/FIlterProduct";
import type { Cart, Product } from "../types/type";
import toast from "react-hot-toast";
import axios from "axios";
import { api_Config, UseApiUrl } from "../types/api";
import { TimKiemTaiStore } from "../Components/TimKiemTaiStore";
import { CartContext } from "../config/CartContext";
import { AiSuggestBox } from "../Components/AISuggest";

export const MainProduct = () => {
  const { id } = useParams();
  const location = useLocation();

  const { dataProduct, dataFavouriteItemUser } =
    useContext(FilterProductContext);
  const { setCartDataAdd } = useContext(CartContext);

  const [toggleBar, setToggleBar] = useState("Description");
  const [heartPopup, setHeartPopup] = useState(false);
  const [findStore, setFindStore] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const product = useMemo((): Product | undefined => {
    if (!id) return undefined;

    return (
      (dataProduct.find((a) => a.id === id) as Product) ||
      dataCollection.luxury_women_collections
        .flatMap((item) => item.products)
        .find((a) => a.id === id)
    );
  }, [id, dataProduct]);

  const tabs = useMemo(() => ["Description", "Size&Fit", "Color"], []);

  useEffect(() => {
    if (!id || !dataFavouriteItemUser) return;

    const isFavourite = dataFavouriteItemUser.some((a) => a.id === id);
    setHeartPopup(isFavourite);
  }, [id, dataFavouriteItemUser, location.pathname]);

  const handleToggleFavourite = useCallback(async (item: Product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để thêm yêu thích");
      return;
    }

    try {
      const response = await axios.post(
        UseApiUrl(api_Config.User.AddFavouriteItems),
        item,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setHeartPopup(true);
      toast.success(response.data.message);
    } catch {
      toast.error("Không thể thêm sản phẩm yêu thích");
    }
  }, []);

  const AddToCart = useCallback(
    (item: Product) => {
      if (!selectedColor) {
        toast.error("Vui Lòng Chọn Màu Sản Phẩm");
        return;
      }
      if (!selectedSize) {
        toast.error("Vui Lòng Chọn Kích Cỡ Sản Phẩm");
        return;
      }

      const cartItem: Cart = {
        Itemid: item.id,
        name: item.name,
        price: item.discountValue>0?item.price - (item.price * item.discountValue) / 100:item.price,
        size: selectedSize,
        color: selectedColor,
        thumnail: item.thumbnail,
        quantity: 1,
        dateBuy: Date.now().toString(),
      };

      setCartDataAdd((prev) => [...prev, cartItem]);
      toast.success("Thêm Vào Giỏ Hàng Thành Công");
    },
    [selectedColor, selectedSize, setCartDataAdd]
  );

  if (!product) {
    return <div className="p-10">Sản phẩm không tồn tại</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-row">
        <div>
          {product?.images.map((src, idx) => (
            <img
              key={idx}
              className="w-[1200px]"
              src={src}
              alt={product.name}
            />
          ))}
        </div>
        <div
          className={`fixed backdrop-blur-2xl z-500 right-0 w-[1500px] h-full transition-all duration-300 ${
            findStore
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full"
          }`}
        >
          <TimKiemTaiStore setState={setFindStore} product={product} />
        </div>
        {findStore && (
          <div className="fixed bg-black/50 backdrop-blur-2xl inset-0 w-full h-screen z-100"></div>
        )}

        {/* Right: Details */}
        <div className="sticky top-50 h-full px-10 translate-y-1/3 w-full">
          {/* Title + Favourite */}
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="font-heading text-2xl font-extralight">
                {product?.name}
              </h1>
              <h2>{product?.material}</h2>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Heart
                className={`cursor-pointer ${
                  heartPopup ? "text-red-600" : "text-black"
                }`}
                onClick={() => handleToggleFavourite({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  discountValue: product.discountValue,
                  thumbnail: product.thumbnail,
                  images: product.images,
                  material: product.material,
                  description: product.description,
                  type: product.type,
                  subcategory: product.subcategory,
                  variants: product.variants,
                  discountType: product.discountType,
                  brand: product.brand,
                  origin: product.origin,
                  rating: product.rating,
                  stock: product.stock,
                  createdAt: product.createdAt,
                  updatedAt: product.updatedAt,
                  sold: product.sold,
                })}
              />
              <h2 className="text-gray-400 text-xs">Reference {product.id}</h2>
            </div>
          </div>

          {/* Price + Buttons */}
          <div className="items-center flex relative justify-center flex-col gap-3">
            <h1
              className={`mt-20 w-full ${
                product.discountValue > 0 ? "line-through text-black/70" : ""
              } text-gray-500 font-body text-center`}
            >
              {product.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </h1>
            {product.discountValue > 0 && (
              <div className="w-full absolute top-10 flex flex-row items-center justify-center gap-3">
                <h1 className=" text-red-600 font-body text-center text-2xl  font-semibold">
                  {(
                    product.price -
                    (product.price * product.discountValue) / 100
                  ).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </h1>
                <span className="bg-red-500 rounded-full p-1 text-white font-bold">
                  <h1>{product.discountValue}%</h1>
                </span>
              </div>
            )}
            <button
              onClick={() => setFindStore(true)}
              className="w-full p-4 text-black border border-gray-300 font-body"
            >
              Tìm Kiếm Tại Cửa Hàng
            </button>
            <button
              onClick={() => AddToCart(product)}
              className="w-full p-4 text-white border border-gray-300 font-body bg-gray-800"
            >
              Thêm Vào Giỏ Hàng
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-12 w-full">
            {/* Tab Header */}
            <div className="flex justify-around border-b border-gray-300 relative">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`relative pb-3 text-sm font-body tracking-wide transition-all duration-200 ${
                    toggleBar === tab
                      ? "text-black font-medium"
                      : "text-gray-400 hover:text-black"
                  }`}
                  onClick={() => setToggleBar(tab)}
                >
                  {tab}
                  {toggleBar === tab && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-black"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6 px-2 min-h-[200px]">
              <AnimatePresence mode="wait">
                {toggleBar === "Description" && (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="text-gray-600 leading-relaxed font-body text-sm"
                  >
                    {product?.description}
                  </motion.div>
                )}

                {toggleBar === "Size&Fit" && (
                  <div className="flex flex-row items-start justify-between">
                    <AiSuggestBox
                      productId={product.id}
                      type={product.type}
                      subcategory={product.subcategory}
                    />
                    <motion.div
                      key="size"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-2 flex-wrap"
                    >
                      {product?.variants.flatMap((variant) =>
                        variant.sizes.map((sz, sidx) => (
                          <span
                            key={sidx}
                            onClick={() => setSelectedSize(sz.size)}
                            className={`px-4 py-2 border border-gray-400 rounded-full text-sm font-body cursor-pointer transition ${
                              selectedSize === sz.size
                                ? "bg-black text-white"
                                : "bg-white hover:bg-gray-600 hover:text-white"
                            }`}
                          >
                            {sz.size}
                          </span>
                        ))
                      )}
                    </motion.div>
                  </div>
                )}

                {toggleBar === "Color" && (
                  <motion.div
                    key="color"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3 items-center flex-wrap"
                  >
                    {product?.variants.map((variant, cidx) => (
                      <span
                        key={cidx}
                        onClick={() => setSelectedColor(variant.color)}
                        className={`px-4 py-2 border rounded-full text-sm font-body cursor-pointer transition ${
                          selectedColor === variant.color
                            ? "bg-black text-white"
                            : "bg-gray-100 hover:bg-gray-300"
                        }`}
                      >
                        {variant.color}
                      </span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation + Footer */}
      <div className="mt-40 mb-40">
        <ProductRecommend />
      </div>
      <Footer />
    </>
  );
};
