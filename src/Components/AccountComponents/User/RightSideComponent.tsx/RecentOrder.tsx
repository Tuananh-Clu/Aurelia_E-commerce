import {
  ShoppingBag,
  PackageCheck,
  Truck,
  Clock,
  XCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import type { order } from "../../../../types/type";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FilterProductContext } from "../../../../contexts/FIlterProduct";

export const RecentOrder = ({
  donHangChiTiet,
}: {
  donHangChiTiet: order[];
}) => {
  const navigate = useNavigate();
  const [openStatus, setOpenStatus] = useState<string | null>("Chờ Xác Nhận");
  const { huyDonHang } = useContext(FilterProductContext);
  const calcOrderTotal = (order: order) =>
    order.product.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const statusGroups = [
    {
      label: "Chờ Xác Nhận",
      color: "yellow",
      icon: <Clock className="text-yellow-500" />,
    },
    {
      label: "Đã Xác Nhận",
      color: "blue",
      icon: <CheckCircle2 className="text-blue-500" />,
    },
    {
      label: "Đang Giao",
      color: "indigo",
      icon: <Truck className="text-indigo-500" />,
    },
    {
      label: "Đã Giao",
      color: "green",
      icon: <PackageCheck className="text-green-500" />,
    },
    {
      label: "Đã Hủy",
      color: "red",
      icon: <XCircle className="text-red-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <ShoppingBag size={20} className="text-indigo-500" />
        Đơn hàng gần đây
      </h1>

      {statusGroups.map((group) => {
        const orders = donHangChiTiet.filter((o) => o.status === group.label);
        if (orders.length === 0) return null;

        const isOpen = openStatus === group.label;

        return (
          <div
            key={group.label}
            className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
          >
            {/* Tiêu đề nhóm */}
            <button
              onClick={() => setOpenStatus(isOpen ? null : group.label)}
              className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                {group.icon}
                <span>{group.label}</span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} className="text-gray-500" />
              </motion.div>
            </button>

            {/* Danh sách đơn (có hiệu ứng mở rộng) */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="divide-y divide-gray-100"
                >
                  {orders.map((orderItem) => (
                    <motion.div
                      key={orderItem.orderId}
                      className="flex justify-between items-center p-4 bg-white"
                      whileHover={{ backgroundColor: "#f9fafb" }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={orderItem.product[0]?.thumnail}
                          alt={orderItem.product[0]?.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                            {orderItem.product[0]?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(Number(orderItem.product[0]?.dateBuy))}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {calcOrderTotal(orderItem).toLocaleString("vi-VN")}₫
                        </p>
                        <div className="flex justify-end gap-2 mt-2">
                          {orderItem.status === "Chờ Xác Nhận" && (
                            <button
                              onClick={() => huyDonHang(orderItem.orderId)}
                              className="px-2.5 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                            >
                              Hủy
                            </button>
                          )}
                          {orderItem.status === "Đã Hủy" ? null : (
                            <button
                              onClick={() =>
                                orderItem.status === "Đã Hủy"
                                  ? null
                                  : navigate(`/tracking/${orderItem.orderId}`)
                              }
                              className="px-2.5 py-1 text-xs rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
                            >
                              Theo dõi
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
