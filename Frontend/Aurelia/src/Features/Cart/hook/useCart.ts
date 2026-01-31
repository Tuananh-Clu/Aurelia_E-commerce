import { useContext, useMemo, useCallback } from "react";
import { CartContext } from "@/Providers/CartContext";

export function useCart() {
  const { CartDataAdd, setCartDataAdd } = useContext(CartContext);

  const subtotal = useMemo(
    () => CartDataAdd.reduce((s, i) => s + i.price * i.quantity, 0),
    [CartDataAdd]
  );

  const updateQty = useCallback(
    (id: string, delta: number) => {
      setCartDataAdd((prev) => {
        const next = prev.map((i) =>
          i.itemid === id
            ? { ...i, quantity: Math.max(i.quantity + delta, 1) }
            : i
        );
        localStorage.setItem("cartItems", JSON.stringify(next));
        return next;
      });
    },
    [setCartDataAdd]
  );

  const removeItem = useCallback(
    (id: string) => {
      setCartDataAdd((prev) => {
        const next = prev.filter((i) => i.itemid !== id);
        localStorage.setItem("cartItems", JSON.stringify(next));
        return next;
      });
    },
    [setCartDataAdd]
  );

  return { CartDataAdd, setCartDataAdd, subtotal, updateQty, removeItem };
}
