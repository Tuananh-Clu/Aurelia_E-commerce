import React, { useContext, useEffect, useState } from "react";
import {
  X,
  Sparkles,
  Tag,

} from "lucide-react";
import { AdminContext } from "../contexts/AdminContext";
import type { Cart, order } from "../types/type";
import { CouponCard } from "./CheckOutComponents/CouponCard";

export const ListCoupon = ({
  isOpen,
  setIsOpen,
  dataOrder,
  order,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataOrder: Cart[];
  order: order | undefined;
}) => {

  const { coupons,suggestVoucher,selectvoucher,setSelectvoucher} = useContext(AdminContext);

  const [validationMessage] = useState<string | null>(null);

  useEffect(() => {
    suggestVoucher(order ?? undefined);
  }, [dataOrder, order]);
  

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-purple-500/20">
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-8">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-white hover:bg-white/20 rounded-xl p-2 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Mã giảm giá</h2>
                  <p className="text-white/90 text-lg">
                    Tiết kiệm ngay hôm nay
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
              {validationMessage && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-400/30 text-yellow-300">
                  {validationMessage}
                </div>
              )}
              {coupons.length === 0 ? (
                <div className="text-center py-12">
                  <Tag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    Chưa có mã giảm giá nào
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className=" text-2xl font-bold text-white px-3 py-4">Mã Giảm Phí Ship </h1>
                  <CouponCard type="ship" selectvoucher={selectvoucher} setSelectvoucher={setSelectvoucher} setIsOpen={setIsOpen} />
                  <h1 className=" text-2xl font-bold text-white px-3 py-4">Mã Giảm Đơn Hàng </h1>
                  <CouponCard type="order" selectvoucher={selectvoucher} setSelectvoucher={setSelectvoucher} setIsOpen={setIsOpen} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
