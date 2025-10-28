import React, { useContext } from "react";
import { AuthContext } from "../../../config/Author";
import type { Clients, Measure } from "../../../types/type";
import { motion } from "framer-motion";
import { LogOut, Pencil, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

type LeftSides = {
  userString: string | null;
  SoLuongDon: number;
  SanPhamDaThich: number;
  Voucher: number;
  soDo: Measure | undefined;
  setState?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LeftSide: React.FC<LeftSides> = ({
  userString,
  SoLuongDon,
  SanPhamDaThich,
  Voucher,
  soDo,
  setState
}) => {
  const { setIsignned } = useContext(AuthContext);
  const user: Clients | null = userString ? JSON.parse(userString) : null;
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear();
    setIsignned(false);
  };

  const bodyMeasurements = [
    { name: "Cao", value: soDo?.chieuCao, unit: "cm" },
    { name: "Vai", value: soDo?.vai, unit: "cm" },
    { name: "Ngực", value: soDo?.nguc, unit: "cm" },
    { name: "Eo", value: soDo?.eo, unit: "cm" },
    { name: "Hông", value: soDo?.hong, unit: "cm" },
  ];

  const createdAt = user?.ngayTaoTaiKhoan
    ? new Date(user.ngayTaoTaiKhoan).toLocaleDateString("vi-VN")
    : "Không rõ";

  return (
    <div className="w-full p-6 space-y-4 rounded-3xl bg-white shadow-xl">
      {/* User Info */}
      <div className="flex flex-col items-center text-center space-y-2">
        <img
          className="w-20 h-20 rounded-full ring-2 ring-indigo-200 shadow-sm"
          src={user?.avatar || "https://via.placeholder.com/150"
          }
          alt="avatar"
        />
        <h1 className="text-lg font-semibold text-gray-800">
          {user?.name ? `Xin chào, ${user.name}` : "Xin chào, Bạn"}
        </h1>
        <p className="text-xs text-gray-500">Tham gia từ {createdAt}</p>
        <p className="text-xs text-indigo-600 font-medium">
          Thành viên {user?.tier ?? ""}
        </p>
        <motion.button
        onClick={() => setState ? setState(true) : null}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <Pencil size={14} /> Sửa hồ sơ
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: "Đơn hàng", value: SoLuongDon },
          { label: "Yêu thích", value: SanPhamDaThich },
          { label: "Voucher", value: Voucher },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -2 }}
            className="p-3 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-sm"
          >
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-sm font-bold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Body Measurements */}
      <div>
        <h2 className="text-sm font-semibold mb-2 text-gray-700">
          Số đo cơ thể
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {bodyMeasurements.map(
            (m, i) =>
              m.value && (
                <div
                  key={i}
                  className="p-2 rounded-xl bg-gray-50 flex justify-between shadow-sm"
                >
                  <span className="text-gray-500">{m.name}</span>
                  <span className="font-medium text-gray-800">
                    {m.value}
                    {m.unit}
                  </span>
                </div>
              )
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ y: -1 }}
        onClick={() => navigate("/bodyMeasurements")}
        className="w-full py-2 mt-1 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700"
      >
        Cập nhật số đo
      </motion.button>


      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-indigo-100 text-sm shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Gift size={16} className="text-indigo-600" />
          <span className="font-semibold text-gray-800">Ưu đãi</span>
        </div>
        Giảm{" "}
        <span className="font-semibold text-indigo-600">15%</span> cho đơn tiếp
        theo — mã: <span className="font-mono">VIP15</span>
      </div>


      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={handleLogOut}
        className="w-full py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 shadow-sm"
      >
        <LogOut size={16} className="inline mr-1" /> Đăng xuất
      </motion.button>
    </div>
  );
};
