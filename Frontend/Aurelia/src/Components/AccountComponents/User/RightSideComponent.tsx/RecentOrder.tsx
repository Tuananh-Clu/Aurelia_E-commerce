import {
  ShoppingBag,
  PackageCheck,
  Truck,
  Clock,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import type { order } from "../../../../types/type";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FilterProductContext } from "../../../../contexts/FIlterProduct";
import { OrderCard } from "./OrderCard";

const STATUS_CONFIG = [
  { label: "Chờ Xác Nhận", icon: Clock },
  { label: "Đã Xác Nhận", icon: CheckCircle2 },
  { label: "Đang Giao", icon: Truck },
  { label: "Đã Giao", icon: PackageCheck },
  { label: "Đã Hủy", icon: XCircle },
] as const;

export const RecentOrder = ({ donHangChiTiet }: { donHangChiTiet: order[] }) => {
  const navigate = useNavigate();
  const { huyDonHang } = useContext(FilterProductContext);
  const [openStatus, setOpenStatus] = useState<string | null>("Chờ Xác Nhận");

  const calcOrderTotal = (order: order) =>
    order.product.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="border border-neutral-200 h-screen px-6 py-6 space-y-6">

      <div className="flex items-center gap-3">
        <ShoppingBag size={18} className="text-neutral-500" />
        <h1 className="text-sm tracking-widest uppercase text-neutral-900">
          Đơn hàng của bạn
        </h1>
      </div>
      <div className="flex gap-6 border-b border-neutral-200 pb-3 overflow-x-auto">
        {STATUS_CONFIG.map(({ label, icon: Icon }) => {
          const isActive = openStatus === label;
          return (
            <button
              key={label}
              onClick={() => setOpenStatus(isActive ? null : label)}
              className={`flex items-center gap-2 text-xs tracking-widest uppercase whitespace-nowrap transition
                ${
                  isActive
                    ? "text-neutral-900 border-b border-neutral-900 pb-2"
                    : "text-neutral-400 hover:text-neutral-700 pb-2"
                }`}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {donHangChiTiet
          .filter((o) => !openStatus || o.status === openStatus)
          .map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              calcOrderTotal={calcOrderTotal}
              formatDate={formatDate}
              huyDonHang={huyDonHang}
              navigate={navigate}
            />
          ))}
      </div>
    </div>
  );
};
