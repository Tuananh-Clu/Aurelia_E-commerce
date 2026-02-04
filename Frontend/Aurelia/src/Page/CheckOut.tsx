import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { motion } from "framer-motion";
import { useContext, useMemo, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { AdminContext } from "../contexts/AdminContext";
import { OrderSummary } from "../Components/CheckOutComponents/OrderSummary";
import { CheckOutPanel } from "../Components/CheckOutPanel";

export const Checkout = () => {
  const {
    CartDataAdd,
    phiVanChuyen,
  } = useContext(CartContext);
  const { selectvoucher } = useContext(AdminContext);
  const [typeShip, setTypeShip] = useState<string>("standard");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isOpen, setIsOpen] = useState(false);
  const subtotal = useMemo(() => {
    const cartTotal = CartDataAdd.reduce((s, i) => s + i.price * i.quantity, 0);
    const memberDiscount = (cartTotal * (user.benefits?.value || 0)) / 100;
    const cartAfterDiscount = cartTotal - memberDiscount;

    if (user.benefits?.freeShipping === true && user.value === 0) {
      return cartTotal;
    }
    let shippingFee = Number(phiVanChuyen) || 0;
    let voucherDiscount = 0;
    if (selectvoucher?.find((item) => item.typeCoupon === "ship")) {
      voucherDiscount =
        selectvoucher.find((item) => item.typeCoupon === "ship")?.giaTri || 0;
      shippingFee = Math.max(0, shippingFee - voucherDiscount);
    } else if (selectvoucher?.find((item) => item.typeCoupon === "order")) {
      voucherDiscount =
        selectvoucher.find((item) => item.typeCoupon === "order")?.giaTri || 0;
    }
    return (
      cartAfterDiscount +
      shippingFee +
      (typeShip === "express" ? 25000 : 0) -
      (selectvoucher?.find((item) => item.typeCoupon === "order")
        ? voucherDiscount
        : 0)
    );
  }, [
    CartDataAdd,
    phiVanChuyen,
    selectvoucher,
    user.benefits,
    user.value,
    typeShip,
  ]);

  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row"
      >
         <div className="flex-1 px-6 py-10 md:px-12 lg:px-20 lg:py-16 bg-white dark:bg-background-dark">
          <CheckOutPanel
          />
        </div>
        <div className="w-full lg:w-[480px] lg:border-l lg:border-[#f2f2f2]  dark:border-white/10">
          <OrderSummary shippingCost="" subtotal={subtotal} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        </motion.main>
      <Footer />
    </>
  );
};
