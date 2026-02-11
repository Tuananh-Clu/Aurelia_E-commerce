import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Percent,
  Calendar,
} from "lucide-react";

export const CouponTable = ({
  coupon,
  i,
  handleToggleStatus,
  setEditing,
  handleDelete,
}: {
  coupon: any;
  i: number;
  handleToggleStatus: (id: string, status: boolean) => void;
  setEditing: (coupon: any) => void;
  handleDelete: (id: string) => void;
}) => {
  return (
    <motion.div
      key={coupon.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: i * 0.03 }}
      className="bg-white shadow-sm hover:shadow-md transition-all duration-300 p-6"
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-semibold text-gray-900 tracking-wide">
              {coupon.code}
            </span>
            {coupon.isActive ? (
              <CheckCircle size={18} className="text-emerald-500" />
            ) : (
              <XCircle size={18} className="text-gray-300" />
            )}
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {coupon.id}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              handleToggleStatus(coupon.id, !coupon.isActive)
            }
            className={`p-2 transition ${
              coupon.isActive
                ? "text-emerald-600 hover:bg-emerald-50"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            {coupon.isActive ? (
              <CheckCircle size={18} />
            ) : (
              <XCircle size={18} />
            )}
          </button>

          <button
            onClick={() => setEditing(coupon)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 transition"
          >
            <Edit3 size={18} />
          </button>

          <button
            onClick={() => handleDelete(coupon.id)}
            className="p-2 text-red-500 hover:bg-red-50 transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 mb-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Percent size={22} className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Giá trị</p>
              <p className="text-2xl font-bold text-gray-900">
                {coupon.loaiGiam === "Phần trăm"
                  ? `${coupon.giaTri}%`
                  : `${(coupon.giaTri ?? 0).toLocaleString()}đ`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Số lượng</p>
            <p className="text-xl font-semibold text-gray-900">
              {coupon.soLuong}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-center gap-2 bg-gray-50 p-3">
          <Calendar size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-400">Bắt đầu</p>
            <p className="text-sm font-medium text-gray-800">
              {new Date(coupon.ngayBatDau).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-3">
          <Calendar size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-400">Kết thúc</p>
            <p className="text-sm font-medium text-gray-800">
              {new Date(coupon.ngayKetThuc).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600">
        <span>{coupon.loaiGiam}</span>
        <span>•</span>
        <span>{coupon.reuse}</span>
        {coupon.phamViApDung && (
          <>
            <span>•</span>
            <span>{coupon.phamViApDung}</span>
          </>
        )}
      </div>
    </motion.div>
  );
};
