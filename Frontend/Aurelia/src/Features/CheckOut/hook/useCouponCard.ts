import { useContext, useState, useCallback, createElement } from "react";
import type { Coupon, CouponCardProps } from "../types";
import { AdminContext } from "../../../Providers/AdminContext";
import { Toaster } from "../../../shared/components/Toaster";
import { Percent, Truck, Zap } from "lucide-react";

export function useCouponCard({ type }: CouponCardProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { coupons , selectvoucher, setSelectvoucher, dataVoucher } =useContext(AdminContext);

  const copyCode = useCallback((code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 1500);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  const formatValue = useCallback((value: number, typeVal: string) => {
    if (typeVal === "percent") return `${value}%`;
    if (typeVal === "money") return `${(value / 1000).toFixed(0)}K`;
    return "Free";
  }, []);

  const getIcon = useCallback((typeCoupon: string) => {
    if (typeCoupon === "order") {
      return createElement(Percent, { className: "w-5 h-5" });
    }
    if (typeCoupon === "ship") {
      return createElement(Truck, { className: "w-5 h-5" });
    }
    return createElement(Zap, { className: "w-5 h-5" });
  }, []);

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const hasOrder = selectvoucher?.find((a: Coupon) => a.typeCoupon === "order");
      const hasShip = selectvoucher?.find((a: Coupon) => a.typeCoupon === "ship");

      if (coupon.typeCoupon === "order" && hasOrder) {
        return;
      }
      if (coupon.typeCoupon === "ship" && hasShip) {
        alert("Chỉ được áp dụng 1 mã giảm phí ship");
        return;
      }

      setSelectvoucher((prev:any) => [...prev, coupon]);
      Toaster.success("Áp dụng mã giảm giá thành công");
    },
    [selectvoucher, setSelectvoucher]
  );

  const removeCoupon = useCallback(
    (id: string) => {
      setSelectvoucher((prev) => prev.filter((c) => c.id !== id));
    },
    [setSelectvoucher]
  );

  const filteredCoupons = coupons.filter(
    (c: Coupon) => c.isActive && c.typeCoupon === type
  );

  return {
    copiedCode,
    copyCode,
    formatDate,
    formatValue,
    getIcon,
    applyCoupon,
    removeCoupon,
    selectvoucher,
    dataVoucher,
    filteredCoupons,
  };
}
