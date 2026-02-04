import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { DiaChiContext } from "../contexts/DiaChiContext";
import { PaymentOptions } from "../Components/MockPayment.tsx/PaymentOptions";
import { useNavigate } from "react-router-dom";
import { Toaster } from "../Components/Toaster";
import { LoadingOverlay } from "../Components/LoadingOverlay";
import { v4 as uuidv4 } from "uuid";
import type { order } from "../types/type";
import { ListCoupon } from "../Components/ListCoupon";
import { AdminContext } from "../contexts/AdminContext";

import { CheckOutForm } from "../Components/CheckOutComponents/CheckOutForm";
import { ChevronLeft } from "lucide-react";

export const CheckOutPanel = () => {
  const { CartDataAdd, setDataOrder, LayToaDo, LayPhiVanCHuyen } =
    useContext(CartContext);
  const { selectvoucher } = useContext(AdminContext);
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<order | undefined>(undefined);
  const [typeShip, setTypeShip] = useState<string>("standard");
  const { savedAddress = [], SaveDiaChi } = useContext(DiaChiContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payment: "cod",
  });
  const [saveAddressCheck, setSaveAddressCheck] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toaDo, setToaDo] = useState<{ lat?: number; lon?: number }>();

  const now = new Date();
  const isoUTC = now.toISOString().replace("Z", "+00:00");
  useEffect(() => {
    if (!formData.address) return;
    const timeout = setTimeout(async () => {
      const res = await LayToaDo(formData.address);
      setToaDo({ lat: res?.lat, lon: res?.lon });
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.address]);

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
      voucherUsed: selectvoucher,
      lat: toaDo?.lat,
      ion: toaDo?.lon,
      ngayTaoDon: isoUTC,
      tracking: {
        updateTime: new Date().toISOString().replace("Z", "+00:00"),
        lat: 0,
        lon: 0,
      },
    };
    setDataOrder(data);
    setOrder(data);
    LayPhiVanCHuyen(true);
  }, [formData, toaDo, CartDataAdd, typeShip]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!CartDataAdd.length) {
      Toaster.error("Giỏ hàng của bạn đang trống!");
      return;
    }

    setIsSubmitting(true);
    try {
      if (saveAddressCheck) {
        await SaveDiaChi({
          hoVaTen: formData.name,
          soDT: formData.phone,
          diaChi: formData.address,
          email: formData.email,
        });
        Toaster.success("Đã lưu địa chỉ thành công!");
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate(`/payment/${formData.payment}`);
    } catch {
      Toaster.error("Lưu địa chỉ thất bại! Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
      LayPhiVanCHuyen(false);
    }
  };
  return (
    <>
      <LoadingOverlay
        isLoading={isSubmitting}
        message="Đang xử lý đơn hàng..."
      />
      <main className="min-h-[100vh] mt-16 pb-20 px-6 md:px-20 bg-white">
        <ListCoupon
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dataOrder={CartDataAdd}
          order={order}
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:text-5xl text-3xl font-extrabold text-center text-gray-900 mb-16"
        >
          Thanh toán
        </motion.h1>
        <div>
          <CheckOutForm
            formData={formData}
            setFormData={setFormData}
            saveAddress={savedAddress}
            typeShip={typeShip}
            setTypeShip={setTypeShip}
          />
          <PaymentOptions value={formData.payment} onChange={handleChange} />
          <div className="flex items-center gap-2 mt-4">
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
          <div className="flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between pt-4">
            <a
              className="flex items-center gap-2 text-sm transition-colors hover:text-gray-600  dark:hover:text-gray-300"
              href="#"
            >
              <ChevronLeft size={16} />
              Return to shipping
            </a>
            <button
              onClick={handleSubmit}
              className="flex h-14 w-full md:w-auto md:min-w-[240px] items-center justify-center rounded-sm bg-primary px-8 text-sm font-bold tracking-widest  transition-all hover:bg-black/80 hover:text-white hover:shadow-lg dark:bg-white dark:text-primary dark:hover:bg-gray-200"
            >
              PAY NOW
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
