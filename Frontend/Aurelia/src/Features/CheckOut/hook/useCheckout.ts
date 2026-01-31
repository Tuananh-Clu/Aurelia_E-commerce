import { useContext, useState, useCallback } from "react";
import { CartContext } from "@/Providers/CartContext";
import { DiaChiContext } from "@/Providers/DiaChiContext";
import { AdminContext } from "@/Providers/AdminContext";
import { AuthContext } from "@/Providers/Author";
import type { DiaChi } from "../types";

export const useCheckout = () => {
  const {
    CartDataAdd,
    dataOrder: order,
    setDataOrder,
    phiVanChuyen,
    handleClickPayment,
    LayPhiVanCHuyen,
  } = useContext(CartContext);
  const { savedAddress, fetchDiaChi, SaveDiaChi, XoaDiaChi } = useContext(DiaChiContext);
  const { selectvoucher, suggestVoucher } = useContext(AdminContext);
  const { userData: user } = useContext(AuthContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [saveAddressCheck, setSaveAddressCheck] = useState(false);
  const [formData, setFormData] = useState({ name: "", address: "", payment: "" });
  const [options, setOptions] = useState({ shippingOption: "standard" as "standard" | "express" });

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelectAddress = useCallback((addr: DiaChi) => {
    setFormData((prev) => ({
      ...prev,
      name: addr.hoVaTen,
      address: addr.diaChi,
    }));
  }, []);

  const handleDeleteAddress = useCallback(
    async (addr: DiaChi) => {
      await XoaDiaChi(addr);
      fetchDiaChi();
    },
    [XoaDiaChi, fetchDiaChi]
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      if (saveAddressCheck && formData.name && formData.address) {
        await SaveDiaChi({
          hoVaTen: formData.name,
          diaChi: formData.address,
          soDT: "",
          email: "",
        });
      }
      await handleClickPayment();
    } finally {
      setIsSubmitting(false);
    }
  }, [saveAddressCheck, formData, SaveDiaChi, handleClickPayment]);

  return {
    isSubmitting,
    savedAddress,
    handleSelectAddress,
    handleDeleteAddress,
    formData,
    handleChange,
    options: {
      ...options,
      setShippingOption: (opt: "standard" | "express") =>
        setOptions((prev) => ({ ...prev, shippingOption: opt })),
    },
    saveAddressCheck,
    setSaveAddressCheck,
    handleSubmit,
    CartDataAdd,
    phiVanChuyen,
    user: user ?? { benefits: undefined, value: 0 },
    formatPrice,
    selectvoucher,
    isOpen,
    setIsOpen,
    order,
    suggestVoucher,
  };
};
