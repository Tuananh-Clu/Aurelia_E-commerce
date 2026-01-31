import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/shared/components/Toaster";
import { CartContext } from "@/Providers/CartContext";
import type { CartSummaryProps } from "../types";

export function useCartSummary({ subtotal, tax }: CartSummaryProps) {
  const navigate = useNavigate();
  const { CartDataAdd } = useContext(CartContext);

  const formatPrice = useCallback((price: number) => {
    return (
      price.toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " Vnđ"
    );
  }, []);

  const checkOut = useCallback(() => {
    if (CartDataAdd.length === 0) {
      Toaster.error("Giỏ hàng của bạn đang trống!");
      return;
    }
    navigate("/payment");
  }, [CartDataAdd.length, navigate]);

  const total = subtotal + tax;

  return { formatPrice, checkOut, total, CartDataAdd };
}
