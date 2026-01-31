import { Copy, Check } from "lucide-react";
import { useCouponCard } from "../hooks";
import type { Coupon, CouponCardProps } from "../types";

export const CouponCard = (props: CouponCardProps) => {
  const {
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
  } = useCouponCard(props);

  return (
    <div className="space-y-5">
      {filteredCoupons.map((coupon: Coupon) => (
        <div
          key={coupon.id}
          className="relative bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-400/40 p-4 md:p-6 
              shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]"
        >
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-gray-200 to-gray-400 text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {coupon.reuse === "Nhiều lần" ? "REUSE" : "HOT"}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="bg-gradient-to-br from-gray-300 to-gray-500 text-white p-5 rounded-2xl shadow-xl min-w-[110px] flex flex-col items-center">
              {getIcon(coupon.typeCoupon ?? "")}
              <div className="text-3xl font-black mt-1">
                {formatValue(coupon.giaTri!, coupon.loaiGiam)}
              </div>
              <div className="text-xs opacity-80">
                {coupon.typeCoupon === "order" ? "OFF" : "FREE"}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-white/80 border border-slate-300 px-4 py-2 rounded-xl">
                  <code className="font-bold text-slate-800">{coupon.code}</code>
                </div>

                <button
                  onClick={() => copyCode(coupon.code, coupon.id)}
                  className="text-slate-700 hover:text-slate-900 p-2 hover:bg-gray-200 rounded-lg transition"
                >
                  {copiedCode === coupon.id ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>

              <p className="text-slate-700">{coupon.dieuKienApDung}</p>

              <div className="flex flex-wrap gap-2">
                <span className="bg-white/70 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-sm">
                  {coupon.moTa ?? "Không mô tả"}
                </span>

                <span className="bg-white/70 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-sm">
                  HSD: {formatDate(coupon.ngayKetThuc)}
                </span>

                {coupon.soLuong > 0 && (
                  <span className="bg-white/70 border border-slate-300 text-yellow-700 px-3 py-1.5 rounded-lg text-sm">
                    Còn: {coupon.soLuong}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 min-w-[140px]">
              <button
                onClick={() => applyCoupon(coupon)}
                disabled={!dataVoucher.find((v) => v.code === coupon.code)}
                className={`px-6 py-3 rounded-xl font-bold w-full shadow-lg transition 
                    ${dataVoucher.find((v) => v.code === coupon.code)
                    ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white hover:scale-105"
                    : "bg-gray-300 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {selectvoucher.find((s) => s.id === coupon.id)
                  ? "Đã áp dụng"
                  : dataVoucher.find((v) => v.code === coupon.code)
                    ? "Áp dụng"
                    : "Không thể áp dụng"}
              </button>

              {selectvoucher.find((s) => s.id === coupon.id) && (
                <button
                  onClick={() => removeCoupon(coupon.id)}
                  className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold w-full"
                >
                  Bỏ áp dụng
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
