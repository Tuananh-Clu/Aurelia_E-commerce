import type { Coupon } from "../../../../types/type";
import { CouponCard } from "./CouponCard";

export const Section = ({
  title,
  icon: Icon,
  coupons,
  type,
  emptyText,
}: {
  title: string;
  icon: any;
  coupons:Coupon[];
  type: string;
  emptyText: string;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
        <Icon className="w-5 h-5 text-neutral-500" />
        <h2 className="text-sm tracking-widest uppercase text-neutral-900">
          {title}
        </h2>
      </div>

      {coupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-96">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} type={type} />
          ))}
        </div>
      ) : (
        <div className="border border-neutral-200 p-10 text-center text-sm text-neutral-500">
          {emptyText}
        </div>
      )}
    </div>
  );
};
