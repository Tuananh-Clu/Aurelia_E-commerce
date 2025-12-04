import { Ticket, Sparkles, Package, Truck, Gift } from "lucide-react";
import { useContext } from "react";
import { AdminContext } from "../../../../contexts/AdminContext";
import type { Coupon } from "../../../../types/type";

export default function Voucher() {
  const { coupons } = useContext(AdminContext);

  const orderCoupons = coupons.filter(
    (c) => c.typeCoupon === "order" && c.isActive
  );
  const shipCoupons = coupons.filter(
    (c) => c.typeCoupon === "ship" && c.isActive
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-200 px-10 py-8">
      <div className="max-w-full ">
        <div className="flex flex-row space-y-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-sm">
              Voucher của tôi
            </h1>
            <p className="text-gray-600 text-lg font-medium">
              Khám phá các ưu đãi đặc biệt dành riêng cho bạn
            </p>
          </div>
          <div className="ml-auto">
            <Gift className="w-12 h-12 text-gray-500 animate-bounce" />
          </div>
        </div>

        {/* Order Vouchers Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-gray-200 to-gray-300 p-4 rounded-2xl shadow-lg border border-gray-400">
            <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-3 rounded-xl shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Dành Cho Đơn Hàng
            </h2>
            <Sparkles className="w-6 h-6 text-gray-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderCoupons.length > 0 ? (
              orderCoupons.map((coupon) => couponCardStyle({ coupon,type: "order" }) )
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="inline-block bg-gray-200 p-6 rounded-2xl border-2 border-gray-300 shadow-lg">
                  <Ticket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">
                    Bạn chưa có voucher đơn hàng nào.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Shipping Vouchers Section */}
        <div>
          <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-gray-200 to-gray-300 p-4 rounded-2xl shadow-lg border border-gray-400">
            <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-3 rounded-xl shadow-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Dành Cho Phí Vận Chuyển
            </h2>
            <Sparkles className="w-6 h-6 text-gray-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shipCoupons.length > 0 ? (
              shipCoupons.map((coupon) => (
                couponCardStyle({ coupon,type: "ship" })
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="inline-block bg-gray-200 p-6 rounded-2xl border-2 border-gray-300 shadow-lg">
                  <Truck className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">
                    Bạn chưa có voucher vận chuyển nào.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 const couponCardStyle = ({ coupon,type }: { coupon: Coupon, type: string }) => {
  return (
    <div
      key={coupon.id}
      className="group relative bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/50 via-transparent to-gray-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-300/30 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-tr from-gray-400/30 to-transparent rounded-full blur-xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gradient-to-br from-gray-600 to-gray-800 px-4 py-2 rounded-xl shadow-lg border border-gray-500">
            <p className="text-gray-100 font-bold text-lg tracking-wide">
              {coupon.code.length > 8
                ? coupon.code.slice(0, 8) + "..."
                : coupon.code}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            HOT
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full"></div>
            <p className="text-gray-700 font-semibold">
              {type === "ship" ? "Giảm phí ship: " : "Giảm giá: "}
              <span className="text-2xl font-bold text-gray-800">
                {coupon.loaiGiam === "percent"
                  ? `${coupon.giaTri}%`
                  : new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(coupon.giaTri || 0)}
              </span>
            </p>
          </div>

          {coupon.moTa && (
            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-3 shadow-sm">
              <p className="text-gray-600 text-sm leading-relaxed">
                {coupon.moTa}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
            <p className="text-gray-600 text-sm">
              Hạn sử dụng:{" "}
              <span className="font-semibold text-gray-800">
                {new Date(coupon.ngayKetThuc).toLocaleDateString("vi-VN")}
              </span>
            </p>
          </div>
        </div>

        <button className="mt-5 w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-500">
          Sử dụng ngay
        </button>
      </div>

      {/* Silver dashed border */}
      <div className="absolute inset-0 border-2 border-dashed border-gray-400 rounded-2xl"></div>
    </div>
  );
};
