import React from "react";
import { useCartSummary } from "../hook/useCartSummary";
import type { CartSummaryProps } from "../types";

export const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, tax }) => {
  const { formatPrice, checkOut, total } = useCartSummary({ subtotal, tax });

  return (
    <div className="lg:sticky lg:top-32">
      <h2 className="serif-title text-3xl mb-12 tracking-wide font-light">
        Cart Overview
      </h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center text-[12px] uppercase tracking-widest font-light">
          <span className="text-neutral-500 dark:text-neutral-400">
            Subtotal
          </span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-[12px] uppercase tracking-widest font-light">
          <span className="text-neutral-500 dark:text-neutral-400">
            Estimated Shipping
          </span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between items-center text-[12px] uppercase tracking-widest font-light">
          <span className="text-neutral-500 dark:text-neutral-400">Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <div className="pt-8 mt-4 border-t border-silver dark:border-neutral-800">
          <div className="flex justify-between items-baseline mb-12">
            <span className="serif-title text-2xl tracking-wide">
              Total Estimate
            </span>
            <span className="text-xl font-light tracking-widest">
              {formatPrice(total)}
            </span>
          </div>

          <button
            className="w-full bg-primary text-white dark:bg-white dark:text-black py-5 text-[12px] uppercase tracking-[0.3em] font-medium hover:bg-black hover:text-white transition-all active:scale-[0.99] mb-6"
            onClick={checkOut}
          >
            Checkout Now
          </button>

          <div className="space-y-4">
            <p className="text-[10px] text-neutral-400 text-center tracking-widest leading-relaxed">
              COMPLIMENTARY SHIPPING ON ALL ORDERS OVER 600.000 Vnđ
            </p>
            <div className="flex justify-center gap-4 opacity-30 grayscale pt-4">
              <span className="material-symbols-outlined text-sm">
                credit_card
              </span>
              <span className="material-symbols-outlined text-sm">
                account_balance
              </span>
              <span className="material-symbols-outlined text-sm">
                contactless
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 p-8 bg-neutral-50 dark:bg-neutral-800 border border-silver dark:border-neutral-700 text-center">
        <p className="serif-title italic text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
          "True luxury is not just what you wear, but the feeling of effortless
          elegance in every step."
        </p>
        <a
          href="#"
          className="text-[10px] text-white uppercase tracking-[0.2em] font-medium border-b border-black dark:border-white pb-1 hover:opacity-60 transition-opacity"
        >
          Read the Manifesto
        </a>
      </div>
    </div>
  );
};
