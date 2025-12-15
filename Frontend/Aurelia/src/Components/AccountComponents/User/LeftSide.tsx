import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/Author";
import type { Clients, Measure } from "../../../types/type";
import { motion } from "framer-motion";
import { LogOut, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../contexts/CartContext";

type LeftSides = {
  userString: Clients | null;
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
  setState,
}) => {
  const { setIsignned, logOut } = useContext(AuthContext);
  const { setCartDataAdd } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut({ typeAccount: "client" });
    localStorage.clear();
    setIsignned(false);
    setCartDataAdd([]);
    navigate("/");
  };

  const bodyMeasurements = [
    { name: "Cao", value: soDo?.chieuCao, unit: "cm" },
    { name: "Vai", value: soDo?.vai, unit: "cm" },
    { name: "Ngực", value: soDo?.nguc, unit: "cm" },
    { name: "Eo", value: soDo?.eo, unit: "cm" },
    { name: "Hông", value: soDo?.hong, unit: "cm" },
  ];

  const createdAt = userString?.ngayTaoTaiKhoan
    ? new Date(userString.ngayTaoTaiKhoan).toLocaleDateString("vi-VN")
    : "Không rõ";

  return (
    <div className="w-full p-6 space-y-6 rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/30 ">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <img
            className="w-24 h-24 rounded-full ring-4 ring-indigo-200 shadow-lg object-cover"
            src={userString?.avatar || "https://via.placeholder.com/150"}
            alt="avatar"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-white"></div>
        </div>

        <h1 className="text-lg font-bold text-gray-800 tracking-wide">
          {userString?.name ? `Xin chào, ${userString.name}` : "Xin chào, Bạn"}
        </h1>

        <p className="text-xs text-gray-500">
          Thành viên:{" "}
          <span className="text-indigo-600 font-semibold">
            {userString?.tier}
          </span>
        </p>

        <p className="text-xs text-gray-400">Tham gia từ {createdAt}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setState?.(true)}
          className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm"
        >
          <Pencil size={14} /> Sửa hồ sơ
        </motion.button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Đơn hàng", value: SoLuongDon },
          { label: "Yêu thích", value: SanPhamDaThich },
          { label: "Voucher", value: Voucher },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-md border border-gray-100"
          >
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* BODY SIZE */}
      <div>
        <h2 className="text-sm font-bold mb-2 text-gray-700">Số đo cơ thể</h2>

        <div className="grid grid-cols-2 gap-3">
          {bodyMeasurements.map(
            (m, i) =>
              m.value && (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-100 shadow-sm flex justify-between text-sm"
                >
                  <span className="text-gray-500">{m.name}</span>
                  <span className="font-semibold text-gray-800">
                    {m.value}
                    {m.unit}
                  </span>
                </div>
              )
          )}
        </div>
      </div>

      {/* UPDATE BODY BUTTON */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        onClick={() => navigate("/bodyMeasurements")}
        className="w-full py-2 rounded-xl bg-indigo-600 text-white text-sm shadow-md hover:bg-indigo-700"
      >
        Cập nhật số đo
      </motion.button>

      {/* LOGOUT BUTTON */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={handleLogOut}
        className="w-full py-2 rounded-xl bg-red-500 text-white text-sm shadow hover:bg-red-600"
      >
        <LogOut size={16} className="inline mr-1" /> Đăng xuất
      </motion.button>
    </div>
  );
};
