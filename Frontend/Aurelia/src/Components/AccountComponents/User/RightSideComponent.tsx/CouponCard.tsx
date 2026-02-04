import type { Coupon } from "../../../../types/type";

export const CouponCard = ({
  coupon,
  type,
}: {
  coupon: Coupon;
  type: string;
}) => {
  return (
    <div
      className="
        border border-neutral-200
        bg-white
        p-6
        flex flex-col
        justify-between
        transition
        hover:border-neutral-300
      "
    >
      {/* Code */}
      <div className="space-y-2">
        <p className="text-xs tracking-widest uppercase text-neutral-400">
          Voucher code
        </p>
        <p className="text-lg font-light text-neutral-900">
          {coupon.code}
        </p>
      </div>

      {/* Value */}
      <div className="mt-6 space-y-2">
        <p className="text-sm text-neutral-600">
          {type === "ship" ? "Giảm phí vận chuyển" : "Giảm giá đơn hàng"}
        </p>
        <p className="text-2xl font-light text-neutral-900">
          {coupon.loaiGiam === "percent"
            ? `${coupon.giaTri}%`
            : new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(coupon.giaTri || 0)}
        </p>
      </div>

      {/* Description */}
      {coupon.moTa && (
        <p className="text-sm text-neutral-500 mt-4 leading-relaxed">
          {coupon.moTa}
        </p>
      )}

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
        <span className="text-xs tracking-widest uppercase text-neutral-400">
          HSD · {new Date(coupon.ngayKetThuc).toLocaleDateString("vi-VN")}
        </span>

        <button className="text-xs tracking-widest uppercase text-neutral-900 border-b border-neutral-900">
          Sử dụng
        </button>
      </div>
    </div>
  );
};
