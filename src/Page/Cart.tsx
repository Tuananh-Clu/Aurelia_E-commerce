import { Navbar } from "../Components/HomeComponent/Navbar";
import { Footer } from "../Components/HomeComponent/Footer";
import { motion } from "framer-motion";
import { useMemo, useContext } from "react";
import { Trash2 } from "lucide-react";
import { CartContext } from "../config/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const Cart = () => {
  const { CartDataAdd, setCartDataAdd } = useContext(CartContext);
  const navigate=useNavigate()

  const subtotal = useMemo(
    () => CartDataAdd.reduce((s, i) => s + i.price * i.quantity, 0),
    [CartDataAdd]
  );
  for(let i=0;i<CartDataAdd.length;i++){
    for(let j=i+1;j<CartDataAdd.length;j++){
      if(CartDataAdd[i].Itemid===CartDataAdd[j].Itemid){
        CartDataAdd.splice(j,1);
        CartDataAdd[i].quantity+=1;
        j--;
      }
    }
  }
  const formatPrice = (num: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);

  const updateQty = (id: string, newQty: number) => {
    setCartDataAdd((prev) =>
      prev.map((i) =>
        i.Itemid === id ? { ...i, quantity: Math.max(newQty, 1) } : i
      )
    );
  };

  const removeItem = (id: string) => {
    setCartDataAdd((prev) => prev.filter((i) => i.Itemid !== id));
  };
 const checkOut = () => {
  if (CartDataAdd.length === 0) {
    toast.error("Giỏ hàng của bạn đang trống");
    return;
  } else {
    navigate("/payment");
  }
};

  return (
    <>
      <Navbar />
      <main className="min-h-[100vh] pt-40 px-6 md:px-20 py-20 bg-gradient-to-b from-neutral-50 to-neutral-100">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-light tracking-wide uppercase text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-black"
        >
          Giỏ hàng của bạn
        </motion.h1>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-2 space-y-6">
            {CartDataAdd.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 bg-white rounded-3xl p-14 text-center shadow-md border border-gray-200"
              >
                Giỏ hàng của bạn đang trống.
              </motion.div>
            ) : (
              CartDataAdd.map((i,index) => (
                <motion.div
                  key={index }
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-8 bg-white rounded-3xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-all"
                >
                  <img
                    src={i.thumnail}
                    alt={i.name}
                    className="w-32 h-32 rounded-2xl object-cover border border-gray-100 shadow-sm"
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg text-gray-800">{i.name}</h3>
                    <p className="text-sm text-gray-500">Size: {i.size}</p>
                    <p className="text-sm text-gray-500">Màu: {i.color}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        className="px-3 py-1.5 rounded-full border text-gray-600 hover:bg-gray-100"
                        onClick={() => updateQty(i.Itemid , i.quantity - 1)}
                      >
                        –
                      </button>
                      <span className="text-lg font-medium">{i.quantity}</span>
                      <button
                        className="px-3 py-1.5 rounded-full border text-gray-600 hover:bg-gray-100"
                        onClick={() => updateQty(i.Itemid , i.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-lg font-semibold text-gray-800">
                      {formatPrice(i.price * i.quantity)}
                    </div>
                    <button
                      onClick={() => removeItem(i.Itemid )}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Tóm tắt đơn hàng */}
          <motion.aside
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 h-fit shadow-lg border border-gray-200"
          >
            <h2 className="text-2xl font-light uppercase tracking-wide text-gray-700">
              Tóm tắt
            </h2>
            <div className="mt-6 space-y-4 text-base">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {
                
              }
              <div className="border-t pt-5 flex justify-between text-lg font-semibold text-gray-800">
                <span>Tổng</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
            <motion.button
            onClick={checkOut}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-10 w-full bg-gradient-to-r cursor-pointer from-black via-gray-800 to-gray-900 text-white rounded-full py-4 text-lg tracking-wide shadow-xl hover:shadow-2xl transition-all"
              disabled={CartDataAdd.length === 0}
            >
              Thanh toán ngay
            </motion.button>
          </motion.aside>
        </div>
      </main>
      <Footer />
    </>
  );
};
