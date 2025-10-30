import React, { useContext, useEffect, useState } from "react";
import {
  X,
  Copy,
  Check,
  Sparkles,
  Tag,
  Gift,
  Percent,
  Zap,
} from "lucide-react";
import { AdminContext } from "../config/AdminContext";
import type { Cart, order } from "../types/type";

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

  const { coupons,suggestVoucher ,dataVoucher} = useContext(AdminContext);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    suggestVoucher(order ?? undefined);
  }, [dataOrder, order]);
  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const applyCoupon = (id: string) => {
    setAppliedCoupon(id);
    setTimeout(() => {
      setIsOpen(false);
      setAppliedCoupon(null);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatValue = (value: number, type: string) => {
    if (type === "Phần trăm") {
      return `${value}%`;
    } else if (type === "Số tiền") {
      return `${(value / 1000).toFixed(0)}K`;
    } else {
      return "Free";
    }
  };

  const getGradientByType = (type: string, apDungCho: string) => {
    if (apDungCho === "Khách Hàng Vip") return "from-amber-500 to-orange-600";
    if (type === "Phần trăm") return "from-violet-500 to-purple-600";
    if (type === "Miễn phí vận chuyển") return "from-emerald-500 to-teal-600";
    return "from-rose-500 to-pink-600";
  };

  const getBadge = (apDungCho: string, reuse: string) => {
    if (apDungCho === "Khách Hàng Vip") return "VIP";
    if (apDungCho === "Khách hàng mới") return "NEW";
    if (reuse === "Nhiều lần") return "REUSE";
    return "HOT";
  };

  const getIcon = (type: string) => {
    if (type === "Phần trăm") return <Percent className="w-5 h-5" />;
    if (type === "Miễn phí vận chuyển") return <Gift className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
  };

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
                  <div className="space-y-5">
                    {coupons
                      .filter(
                        (coupon) =>
                          coupon.isActive && coupon.typeCoupon === "ship"
                      )
                      .map((coupon) => (
                        <div
                          key={coupon.id}
                          className="relative group bg-slate-700/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 hover:scale-[1.02] transition-all"
                        >
                          <div
                            className={`absolute -top-3 -right-3 bg-gradient-to-r ${getGradientByType(
                              coupon.theLoaiApDung,
                              coupon.apDungCho
                            )} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
                          >
                            {getBadge(coupon.apDungCho, coupon.reuse)}
                          </div>

                          <div className="flex items-center gap-6">
                            <div
                              className={`bg-gradient-to-br ${getGradientByType(
                                coupon.theLoaiApDung,
                                coupon.apDungCho
                              )} p-6 rounded-2xl text-white shadow-2xl min-w-[120px] flex flex-col items-center group-hover:scale-110 transition-transform`}
                            >
                              <div className="mb-1">
                                {getIcon(coupon.theLoaiApDung)}
                              </div>
                              <div className="text-3xl font-black">
                                {formatValue(
                                  coupon.giaTri,
                                  coupon.theLoaiApDung
                                )}
                              </div>
                              <div className="text-xs opacity-90 font-semibold">
                                OFF
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl border border-purple-500/30">
                                  <code className="text-purple-400 font-bold text-lg">
                                    {coupon.code}
                                  </code>
                                </div>
                                <button
                                  onClick={() =>
                                    copyCode(coupon.code, coupon.id)
                                  }
                                  className="text-purple-400 hover:text-purple-300 p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
                                >
                                  {copiedCode === coupon.id ? (
                                    <Check className="w-5 h-5 text-green-400" />
                                  ) : (
                                    <Copy className="w-5 h-5" />
                                  )}
                                </button>
                              </div>

                              <p className="text-gray-200 font-medium mb-3">
                                {coupon.dieuKienApDung}
                              </p>

                              <div className="flex flex-wrap gap-2 text-sm">
                                <span className="bg-slate-900/60 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-500/20">
                                  {coupon.phamViApDung}
                                </span>
                                <span className="bg-slate-900/60 text-pink-300 px-3 py-1.5 rounded-lg border border-pink-500/20">
                                  {coupon.apDungCho}
                                </span>
                                <span className="bg-slate-900/60 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                                  HSD: {formatDate(coupon.ngayKetThuc)}
                                </span>
                                {coupon.soLuong > 0 && (
                                  <span className="bg-slate-900/60 text-yellow-300 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                                    Còn: {coupon.soLuong}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => applyCoupon(coupon.id)}
                              disabled={
                                appliedCoupon === coupon.id ||
                                coupon.soLuong === 0
                              }
                              className={`px-8 py-4 rounded-xl font-bold transition-all shadow-lg whitespace-nowrap ${
                                appliedCoupon === coupon.id
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                  : coupon.soLuong === 0
                                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                  : `bg-gradient-to-r ${getGradientByType(
                                      coupon.theLoaiApDung,
                                      coupon.apDungCho
                                    )} text-white hover:scale-105`
                              }`}
                            >
                              {appliedCoupon === coupon.id ? (
                                <span className="flex items-center gap-2">
                                  <Check className="w-5 h-5" />
                                  Đã áp dụng
                                </span>
                              ) : coupon.soLuong === 0 ? (
                                "Hết lượt"
                              ) : (
                                "Áp dụng"
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div>
                    <h1 className=" text-2xl font-bold text-white px-3 py-4">Mã Giảm Giá Sản Phẩm </h1>
                    <div className="space-y-5">
                      {coupons
                        .filter(
                          (coupon) =>
                            coupon.isActive && coupon.typeCoupon === "donhang" 
                        )
                        .map((coupon) => (
                          <div
                            key={coupon.id}
                            className="relative group bg-slate-700/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 hover:scale-[1.02] transition-all"
                          >
                            <div
                              className={`absolute -top-3 -right-3 bg-gradient-to-r ${getGradientByType(
                                coupon.theLoaiApDung,
                                coupon.apDungCho
                              )} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
                            >
                              {getBadge(coupon.apDungCho, coupon.reuse)}
                            </div>

                            <div className="flex items-center gap-6">
                              <div
                                className={`bg-gradient-to-br ${getGradientByType(
                                  coupon.theLoaiApDung,
                                  coupon.apDungCho
                                )} p-6 rounded-2xl text-white shadow-2xl min-w-[120px] flex flex-col items-center group-hover:scale-110 transition-transform`}
                              >
                                <div className="mb-1">
                                  {getIcon(coupon.theLoaiApDung)}
                                </div>
                                <div className="text-3xl font-black">
                                  {formatValue(
                                    coupon.giaTri,
                                    coupon.theLoaiApDung
                                  )}
                                </div>
                                <div className="text-xs opacity-90 font-semibold">
                                  OFF
                                </div>
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl border border-purple-500/30">
                                    <code className="text-purple-400 font-bold text-lg">
                                      {coupon.code}
                                    </code>
                                  </div>
                                  <button
                                    onClick={() =>
                                      copyCode(coupon.code, coupon.id)
                                    }
                                    className="text-purple-400 hover:text-purple-300 p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
                                  >
                                    {copiedCode === coupon.id ? (
                                      <Check className="w-5 h-5 text-green-400" />
                                    ) : (
                                      <Copy className="w-5 h-5" />
                                    )}
                                  </button>
                                </div>

                                <p className="text-gray-200 font-medium mb-3">
                                  {coupon.dieuKienApDung}
                                </p>

                                <div className="flex flex-wrap gap-2 text-sm">
                                  <span className="bg-slate-900/60 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-500/20">
                                    {coupon.phamViApDung}
                                  </span>
                                  <span className="bg-slate-900/60 text-pink-300 px-3 py-1.5 rounded-lg border border-pink-500/20">
                                    {coupon.apDungCho}
                                  </span>
                                  <span className="bg-slate-900/60 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                                    HSD: {formatDate(coupon.ngayKetThuc)}
                                  </span>
                                  {coupon.soLuong > 0 && (
                                    <span className="bg-slate-900/60 text-yellow-300 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                                      Còn: {coupon.soLuong}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => applyCoupon(coupon.id)}
                                disabled={
                                  appliedCoupon === coupon.id ||
                                  coupon.soLuong === 0 || dataVoucher.filter(item => item.id === coupon.id).length > 0
                                }
                                className={`px-8 py-4 rounded-xl font-bold transition-all shadow-lg whitespace-nowrap ${
                                  appliedCoupon === coupon.id
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                    : coupon.soLuong === 0
                                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                    : `bg-gradient-to-r ${getGradientByType(
                                        coupon.theLoaiApDung,
                                        coupon.apDungCho
                                      )} text-white hover:scale-105`
                                }`}
                              >
                                {appliedCoupon === coupon.id ? (
                                  <span className="flex items-center gap-2">
                                    <Check className="w-5 h-5" />
                                    Đã áp dụng
                                  </span>
                                ) : coupon.soLuong === 0 || dataVoucher.filter(item => item.id === coupon.id).length > 0 ? (
                                  "Không thể áp dụng"
                                ) : (
                                  "Áp dụng"
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
