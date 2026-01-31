import { useMemo } from "react";
import { HelpCircle } from "lucide-react";
import { useCheckout } from "../hooks";
import { ListCoupon } from "./ListCoupon";

export const OrderSummary = () => {
  const {
    CartDataAdd,
    phiVanChuyen,
    user,
    formatPrice,
    selectvoucher,
    isOpen,
    setIsOpen,
    order,
  } = useCheckout();
  const shipping = Number(phiVanChuyen ?? 0);
  const subtotal = useMemo(
    () =>
      CartDataAdd.reduce((acc:any, curr:any) => acc + curr.price * curr.quantity, 0),
    [],
  );
  const taxes = 0.0;
  const total = subtotal + shipping + taxes;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="sticky top-[80px] p-6 md:p-12">
      <div className="mb-8 flex flex-col gap-6">
        {CartDataAdd.map((product) => (
          <div key={product.itemid} className="flex gap-4 group">
            <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-sm border border-black/5 bg-white">
              <span className="absolute right-0 top-0 flex h-5 w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-gray-500 text-[10px] font-bold text-white z-10">
                {product.quantity}
              </span>
              <img
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                src={product.thumnail}
              />
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="text-base font-bold text-primary dark:text-white">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.color}
              </p>
            </div>
            <div className="flex flex-col justify-center text-right">
              <span className="text-base font-medium text-primary dark:text-white">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <ListCoupon
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          dataOrder={CartDataAdd}
          order={order}
        />

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-8 dark:border-white/10">
        <div className="flex justify-between font-medium mt-4">
          <span>Ưu đãi thành viên </span>
          <span className="text-green-600">
            -
            {formatPrice(
              (CartDataAdd.reduce((s, i) => s + i.price * i.quantity, 0) *
                user.benefits?.value) /
                100,
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span className="font-medium text-primary dark:text-white">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Shipping</span>
          {user.benefits?.freeShipping === true && user.value === 0 ? (
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
              Complimentary
            </span>
          ) : (
            <span className="font-medium text-primary dark:text-white">
              {formatPrice(
                Number(phiVanChuyen) -
                  Number(
                    selectvoucher?.find((item) => item.typeCoupon === "ship")
                      ?.giaTri,
                  ) || Number(phiVanChuyen),
              )}
            </span>
          )}
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span>Estimated Taxes</span>
            <div
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help"
              title="Calculated based on shipping address"
            >
              <HelpCircle size={14} />
            </div>
          </div>
          <span className="font-medium text-primary dark:text-white">
            {formatCurrency(taxes)}
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between border-t border-gray-200 pt-8 dark:border-white/10">
        <span className="text-lg font-medium text-primary dark:text-white">
          Total
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">VND</span>
          <span className="text-3xl font-bold tracking-tight text-primary dark:text-white">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
};
