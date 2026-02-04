import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import { ListCoupon } from "../ListCoupon";

export const OrderSummary = ({
  subtotal,
  shippingCost,
  isOpen,
  setIsOpen,
}: {
  subtotal: number;
  shippingCost: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { CartDataAdd, formatPrice, dataOrder } = useContext(CartContext);

  return (
    <div className="sticky top-[80px] p-6 md:p-12">
      <ListCoupon
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        dataOrder={CartDataAdd}
        order={dataOrder}
      />

      <div className="mb-8 flex flex-col gap-6">
        {CartDataAdd.map((product) => (
          <div key={product.itemid} className="flex gap-4 group">
            <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-sm border border-black/5 bg-white">
            <span className="absolute top-0 right-0 bg-black/70 text-white text-xs font-semibold px-1.5 py-0.5 rounded-bl-md z-10">
                {product.quantity}
            </span>
              <img
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                src={product.thumnail}
              />
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="text-base font-bold ">{product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.color}
              </p>
            </div>
            <div className="flex flex-col justify-center text-right">
              <span className="text-base font-medium">
                {formatPrice?.(product.price * product.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button
        className="mb-8 text-sm font-medium underline underline-offset-4 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors"
        onClick={() => setIsOpen(true)}
      >
        Mã giảm giá hoặc phiếu quà tặng
      </button>

      {/* Totals */}
      <div className="flex flex-col gap-3 border-t border-gray-200 pt-8 dark:border-white/10">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span className="font-medium ">{formatPrice?.(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Shipping</span>
          {shippingCost === "0" ? (
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
              Complimentary
            </span>
          ) : (
            <span className="font-medium ">
              {formatPrice?.(Number(shippingCost))}
            </span>
          )}
        </div>
      </div>

      {/* Grand Total */}
      <div className="mt-8 flex items-end justify-between border-t border-gray-200 pt-8 dark:border-white/10">
        <span className="text-lg font-medium ">Total</span>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">VND</span>
          <span className="text-3xl font-bold tracking-tight ">
            {formatPrice?.(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
