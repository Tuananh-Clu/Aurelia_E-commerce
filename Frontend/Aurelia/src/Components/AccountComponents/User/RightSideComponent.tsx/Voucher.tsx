import { Ticket, Package, Truck } from "lucide-react";
import { useContext } from "react";
import { AdminContext } from "../../../../contexts/AdminContext";
import { Section } from "./Section";

export default function Voucher() {
  const { coupons } = useContext(AdminContext);

  const orderCoupons = coupons.filter(
    (c) => c.typeCoupon === "order" && c.isActive
  );
  const shipCoupons = coupons.filter(
    (c) => c.typeCoupon === "ship" && c.isActive
  );

  return (
    <div className="px-8 py-10 max-w-7xl mx-auto space-y-14">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-widest uppercase text-neutral-900">
            Voucher
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Ưu đãi dành riêng cho tài khoản của bạn
          </p>
        </div>
        <Ticket className="w-8 h-8 text-neutral-400" />
      </div>

      <Section
        title="Dành cho đơn hàng"
        icon={Package}
        coupons={orderCoupons}
        type="order"
        emptyText="Bạn chưa có voucher cho đơn hàng."
      />

      <Section
        title="Dành cho vận chuyển"
        icon={Truck}
        coupons={shipCoupons}
        type="ship"
        emptyText="Bạn chưa có voucher vận chuyển."
      />
    </div>
  );
}
