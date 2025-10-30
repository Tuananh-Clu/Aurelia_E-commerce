import { Navbar } from "../Components/HomeComponent/Navbar";
import { Footer } from "../Components/HomeComponent/Footer";
import { motion } from "framer-motion";
import { useContext, useEffect, useMemo, useState } from "react";
import { CartContext } from "../config/CartContext";
import { DiaChiContext } from "../config/DiaChiContext";
import { PaymentOptions } from "../Components/PaymentOptions";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import type { DiaChi, order } from "../types/type";
import { TicketCheck } from "lucide-react";
import { ListCoupon } from "../Components/ListCoupon";

export const Checkout = () => {
  const { CartDataAdd, setDataOrder, LayToaDo, phiVanChuyen, LayPhiVanCHuyen,dataOrder } =
    useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false)
  const [order, setOrder] = useState<order|undefined>(undefined);
  const {
    savedAddress = [],
    SaveDiaChi,
    XoaDiaChi,
  } = useContext(DiaChiContext);
  const navigate = useNavigate();
  const user=JSON.parse(localStorage.getItem("user") || "{}");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payment: "cod",
  });
  const [saveAddressCheck, setSaveAddressCheck] = useState(false);
  const [toaDo, setToaDo] = useState<{ lat?: number; lon?: number }>();

  // Chọn địa chỉ đã lưu
  const handleSelectAddress = (addr: any) => {
    setFormData({
      name: addr.hoVaTen,
      phone: addr.soDT,
      address: addr.diaChi,
      email: addr.email || "",
      payment: formData.payment,
    });
  };
  const subtotal = useMemo(
    () =>
      user.benefits.freeShipping===true&&user.value===0?CartDataAdd.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ):CartDataAdd.reduce((s, i) => s + i.price * i.quantity, 0) +
      Number(phiVanChuyen)-(CartDataAdd.reduce((s, i) => s + i.price * i.quantity, 0)*user.benefits.value)/100,
    [CartDataAdd, phiVanChuyen]
  );

  const formatPrice = (num: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  const now = new Date();
  const isoUTC = now.toISOString().replace("Z", "+00:00");
  // Lấy tọa độ
  useEffect(() => {
    if (!formData.address) return;
    const timeout = setTimeout(async () => {
      const res = await LayToaDo(formData.address);
      setToaDo({ lat: res?.lat, lon: res?.lon });
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.address]);

  // Update order
  useEffect(() => {
    const data: order = {
      orderId: uuidv4(),
      status: "Chờ Xác Nhận",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      payment: formData.payment,
      product: CartDataAdd,
      lat: toaDo?.lat,
      ion: toaDo?.lon,
      ngayTaoDon:isoUTC,
      tracking:{
        updateTime:new Date().toISOString().replace("Z", "+00:00"),
        lat:0,
        lon:0
      }
    };
    setDataOrder(data);
    setOrder(data);
    LayPhiVanCHuyen(true);
  }, [formData, toaDo, CartDataAdd]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!CartDataAdd.length) return toast.error("Giỏ hàng của bạn đang trống!");

    try {
      if (saveAddressCheck) {
        await SaveDiaChi({
          hoVaTen: formData.name,
          soDT: formData.phone,
          diaChi: formData.address,
          email: formData.email,
        });
      }
      navigate(`/payment/${formData.payment}`);
    } catch {
      toast.error("Lưu địa chỉ thất bại!");
    }
    LayPhiVanCHuyen(false);
  };

  const handleDelete = (addr: DiaChi) => XoaDiaChi(addr);

  return (
    <>
      <Navbar />
      <main className="min-h-[100vh] pt-28 px-6 md:px-20 bg-white">
        <ListCoupon isOpen={isOpen} setIsOpen={setIsOpen}  dataOrder={CartDataAdd} order={order}/>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-center text-gray-900 mb-16"
        >
          Thanh toán
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form khách hàng */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white p-12 rounded-3xl shadow-lg border border-gray-100 space-y-8"
          >
            <h2 className="text-2xl font-light text-gray-800 mb-6">
              Thông tin khách hàng
            </h2>

            {/* Danh sách địa chỉ đã lưu */}
            {savedAddress.length > 0 && (
              <div className="mb-4">
                <h3 className="text-gray-700 font-medium mb-2">
                  Chọn địa chỉ đã lưu:
                </h3>
                <div className="flex flex-col gap-2">
                  {savedAddress.map((addr: DiaChi) => (
                    <div className="flex justify-between items-center border p-3 rounded-xl hover:bg-gray-50 transition">
                      <button
                        type="button"
                        onClick={() => handleSelectAddress(addr)}
                        className="flex-1 text-left"
                      >
                        <p className="font-medium">
                          {addr.hoVaTen} - {addr.soDT}
                        </p>
                        <p className="text-gray-500 text-sm">{addr.diaChi}</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(addr)}
                        className="ml-3 text-red-500 font-semibold hover:text-red-700 transition"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-gray-400 outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-gray-400 outline-none"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-gray-400 outline-none"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ giao hàng"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-gray-400 outline-none"
                required
              />
            </div>
            <button type="button" onClick={()=>setIsOpen(true)} className="flex flex-row items-center justify-between pt-4 px-4 py-3 border border-dashed border-gray-300 rounded-xl group hover:bg-gray-700 cursor-pointer w-full transition-all duration-300">
              <h3 className="text-gray-700 font-medium mb-2 group-hover:text-white">Mã giảm giá</h3>
              <TicketCheck className="mx-4 mb-4 text-gray-500 group-hover:text-white" />
            </button>
            <PaymentOptions value={formData.payment} onChange={handleChange} />

            {/* Lưu địa chỉ */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={saveAddressCheck}
                onChange={(e) => setSaveAddressCheck(e.target.checked)}
                className="w-4 h-4 accent-gray-700"
              />
              <label className="text-gray-700 text-sm">
                Lưu địa chỉ vào tài khoản
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-full py-4 text-lg font-semibold shadow-md hover:shadow-xl transition-all"
            >
              Xác nhận đặt hàng
            </motion.button>
          </motion.form>

          {/* Summary đơn hàng */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 h-fit sticky top-28"
          >
            <h2 className="text-2xl font-light text-gray-800 mb-6">
              Đơn hàng của bạn
            </h2>
            <div className="space-y-4 text-gray-700">
              {CartDataAdd.map((item) => (
                <div
                  key={item.Itemid}
                  className="flex justify-between items-center border-b border-gray-100 pb-2"
                >
                  <div className="flex items-center gap-4">
                    {item.thumnail && (
                      <img
                        src={item.thumnail}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <span className="font-medium">
                      {item.name} x {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-medium mt-4">
                <span>Ưu đãi thành viên </span>
                <span className="text-green-600"> -{formatPrice(
                  (CartDataAdd.reduce((s, i) => s + i.price * i.quantity, 0) *
                    user.benefits.value) /
                    100
                )}</span>
              </div>
              {
                user.benefits.freeShipping===true&&user.value===0?null:<div className="flex justify-between font-medium">
                <span>Phí vận chuyển</span>
                <span>{formatPrice(Number(phiVanChuyen))}</span>
              </div>
              }
              <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Tổng cộng</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>
      <Footer />
    </>
  );
};
