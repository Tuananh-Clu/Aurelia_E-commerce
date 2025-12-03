import { ShoppingBag, PackageCheck, Truck, Clock, XCircle, CheckCircle2 } from "lucide-react";
import type { order } from "../../../../types/type";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FilterProductContext } from "../../../../contexts/FIlterProduct";

const STATUS_CONFIG = [
  { label: "Chờ Xác Nhận", color: "yellow", icon: Clock },
  { label: "Đã Xác Nhận", color: "blue", icon: CheckCircle2 },
  { label: "Đang Giao", color: "indigo", icon: Truck },
  { label: "Đã Giao", color: "green", icon: PackageCheck },
  { label: "Đã Hủy", color: "red", icon: XCircle },
] as const;

const STATUS_BADGE: Record<string, string> = {
  "Chờ Xác Nhận": "bg-yellow-100 text-yellow-700",
  "Đã Xác Nhận": "bg-blue-100 text-blue-700",
  "Đang Giao": "bg-indigo-100 text-indigo-700",
  "Đã Giao": "bg-green-100 text-green-700",
  "Đã Hủy": "bg-red-100 text-red-700",
};

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
    <div className="px-3 py-5 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-5">
      {/* Header */}
      <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <ShoppingBag size={22} className="text-indigo-600" />
        Đơn hàng
      </h1>

      {/* Status Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {STATUS_CONFIG.map(({ label, color, icon: Icon }) => {
          const isActive = openStatus === label;
          return (
            <button
              key={label}
              onClick={() => setOpenStatus(isActive ? null : label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all duration-200
                ${isActive
                  ? `bg-${color}-100 text-${color}-700 border-${color}-300 font-medium shadow-sm`
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? `text-${color}-500` : "text-gray-500"}`} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {donHangChiTiet
          .filter((order) => !openStatus || order.status === openStatus)
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


const OrderCard = ({ order, calcOrderTotal, formatDate, huyDonHang, navigate }:any) => {
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-md shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      {/* Product Image */}
      <img
        src={order.product[0]?.thumnail}
        alt="Product"
        className="w-20 h-20 object-cover rounded-lg"
      />

      {/* Order Info */}
      <div className="space-y-1 flex-1">
        <h2 className="font-semibold text-gray-800 text-base">Mã Đơn Hàng: {order.orderId}</h2>
        <p className="text-gray-600 text-sm">Ngày Đặt: {formatDate(Number(order.ngayTaoDon))}</p>
        <p className="text-gray-700 text-sm font-medium">
          Tổng Tiền:{" "}
          <span className="text-indigo-600 font-semibold">
            {calcOrderTotal(order).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </span>
        </p>
      </div>

      <div className="flex flex-col items-center md:items-end gap-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[order.status]}`}>
          {order.status}
        </span>

        <div className="flex items-center gap-3">
          {order.status === "Chờ Xác Nhận" && (
            <button
              onClick={() => huyDonHang(order.orderId)}
              className="px-3 py-1.5 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition text-sm font-medium"
            >
              Hủy
            </button>
          )}
          <button
            onClick={() => navigate(`/Order/${order.orderId}`)}
            className="px-3 py-1.5 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition text-sm font-medium"
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};
