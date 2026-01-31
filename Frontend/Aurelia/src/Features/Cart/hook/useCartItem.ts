import { useCallback } from "react";

export function useCartItem() {
  const formatPrice = useCallback((price: number) => {
    return (
      price.toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " €"
    );
  }, []);

  return { formatPrice };
}
