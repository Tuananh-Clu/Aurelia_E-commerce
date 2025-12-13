import { useLocation, useParams } from "react-router-dom";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { ArrowBigLeftDashIcon, Heart } from "lucide-react";
import {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductRecommend } from "../Components/ProductComponent/ProductRecommend";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import dataCollection from "../assets/DataMock/dataSeason.json";
import { FilterProductContext } from "../contexts/FIlterProduct";
import type { Cart, Product } from "../types/type";
import { Toaster } from "../Components/Toaster";
import axios from "axios";
import { api_Config, UseApiUrl } from "../services/api";
import { TimKiemTaiStore } from "../Components/TimKiemTaiStore";
import { CartContext } from "../contexts/CartContext";
import { AiSuggestBox } from "../Components/AISuggest";
import { AuthContext } from "../contexts/Author";
import { api_Response } from "../services/http";

export const MainProduct = () => {
  const { id } = useParams();
  const location = useLocation();

  const { dataProduct, dataFavouriteItemUser } =
    useContext(FilterProductContext);
  const { setCartDataAdd, CartDataAdd } = useContext(CartContext);

  const [toggleBar, setToggleBar] = useState("Description");
  const [heartPopup, setHeartPopup] = useState(false);
  const [findStore, setFindStore] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const {isSignned}=useContext(AuthContext)
  const imgRef = useRef<HTMLDivElement>(null);
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
    
    if (!isSignned) {
      Toaster.error("Bạn cần đăng nhập để thêm yêu thích");
      return;
    }

    try {
      api_Response(UseApiUrl(api_Config.User.AddFavouriteItems), "POST", {
        productId: item.id,
      });
      setHeartPopup(true);
      Toaster.success("Đã thêm sản phẩm vào yêu thích!");
    } catch {
      Toaster.error("Không thể thêm sản phẩm yêu thích. Vui lòng thử lại.");
    }
  }, []);
  const handleClickLeftRight = (direction: "left" | "right") => {
    if (imgRef.current) {
      const scrollAmount = 500;
      if (direction === "left") {
        imgRef.current.scrollLeft -= scrollAmount;
      } else {
        imgRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  const AddToCart = useCallback(
    (item: Product) => {
      if (selectedColor == null || selectedColor === "") {
        Toaster.error("Vui lòng chọn màu sản phẩm!");
        return;
      }
      if (selectedSize == null || selectedSize === "") {
        Toaster.error("Vui lòng chọn kích cỡ sản phẩm!");
        return;
      }

      const cartItem: Cart = {
        Itemid: item.id,
        name: item.name,
        price:
          item.discountValue > 0
            ? item.price - (item.price * item.discountValue) / 100
            : item.price,
        size: selectedSize,
        color: selectedColor,
        thumnail: item.thumbnail,
        quantity: 1,
        dateBuy: Date.now().toString(),
      };

      setCartDataAdd((prev) => [...prev, cartItem]);
      localStorage.setItem(
        "cartItems",
        JSON.stringify([...CartDataAdd, cartItem])
      );
      Toaster.success("Đã thêm sản phẩm vào giỏ hàng!");
    },
    [selectedColor, selectedSize, setCartDataAdd]
  );

  if (!product) {
    return <div className="p-10">Sản phẩm không tồn tại</div>;
  }

  return (
    <>
      <Navbar />    <div
          className={`fixed backdrop-blur-2xl z-[9999] right-0 lg:w-[1300px] md:w-[700px] w-[350px]  md:h-full h-[400px] transition-all duration-300 ${
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
      <div className="flex flex-col md:flex-row justify-around pb-20 bg-gradient-to-b from-neutral-50 to-neutral-100">
        <div className="relative w-full overflow-hidden">
          <div
            ref={imgRef}
            className="flex md:block flex-row overflow-x-scroll no-scrollbar snap-x snap-mandatory w-full"
          >
            {product?.images.map((src, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center w-full flex-shrink-0 snap-center md:flex-shrink "
              >
                <img
                  src={src}
                  alt={product.name}
                  className="
            md:w-[1200px] md:h-auto
            w-[500px] h-[700px]
            object-cover shadow-lg
            transition-all duration-300
          "
                />
                          <button
            className="
            md:hidden absolute top-1/2 left-4 -translate-y-1/2
            bg-black/40 backdrop-blur-xl
            text-white rounded-full p-3 shadow-xl
            hover:bg-black/60 transition
            z-50
          "
            onClick={() => {
              handleClickLeftRight("left");
              setScrollPosition((prev) => Math.max(prev - 1, 0));
            }}
          >
            <ArrowBigLeftDashIcon className="w-6 h-6" />
          </button>

          <button
            className="
            md:hidden absolute top-1/2 right-4 -translate-y-1/2
            bg-black/40 backdrop-blur-xl
            text-white rounded-full p-3 shadow-xl
            hover:bg-black/60 transition
            z-50
          "
            onClick={() => {
              setScrollPosition((prev) => Math.min(prev + 1, product.images.length - 1));
              handleClickLeftRight("right");
            }}
          >
            <ArrowBigLeftDashIcon className="w-6 h-6 rotate-180" />
          </button>
              </div>
            ))}
          </div>


          {/* Indicators (Mobile) */}
          <div className="w-full flex items-center justify-center mt-4 md:hidden">
            <div className="flex gap-2">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`
                  h-2 rounded-full transition-all duration-300
                  ${
                    index === scrollPosition
                      ? "bg-black w-6"
                      : "bg-gray-400 w-2"
                  }
                `}
                ></div>
              ))}
            </div>
          </div>
        </div>

    

        {/* Right: Details */}
        <div className="sticky md:top-50 h-full px-10 md:translate-y-1/3 mt-10 w-full">
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
                onClick={() =>
                  handleToggleFavourite({
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
                    season: product.season,
                  })
                }
              />
              <h2 className="text-gray-400 md:text-left text-right text-xs">
                Reference {product.id}
              </h2>
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
