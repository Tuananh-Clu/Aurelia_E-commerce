import { useContext, useEffect, useState } from "react";
import { AdminContext } from "@/Providers/AdminContext";
import type { ListCouponProps } from "../types";

export function useListCoupon({
  isOpen,
  setIsOpen,
  dataOrder,
  order,
}: ListCouponProps) {
  const { coupons, suggestVoucher } = useContext(AdminContext);
  const [validationMessage] = useState<string | null>(null);

  useEffect(() => {
    suggestVoucher(order ?? undefined);
  }, [dataOrder, order, suggestVoucher]);

  return { coupons, validationMessage, isOpen, setIsOpen };
}
