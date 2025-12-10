import React, { useContext, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Calendar,
  ShoppingCart,
  Settings,
  Users,
  ChevronRight,
  ArrowBigRightDash,
  ArrowBigLeftDash,
} from "lucide-react";
import { PopupSetting } from "./PopupSetting";
import { NotificationContext } from "../../contexts/NotifycationContext";

type SideBars = {
  setState: React.Dispatch<React.SetStateAction<string>>;
  state: string;
};

export function SideBar({ setState, state }: SideBars) {
  const { name } = useContext(NotificationContext);
  const [popupSetting, setPopupSetting] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "orders", icon: ShoppingCart, label: "Đơn hàng" },
    { id: "appointments", icon: Calendar, label: "Lịch hẹn" },
    { id: "products", icon: Package, label: "Sản phẩm" },
    { id: "customers", icon: Users, label: "Khách hàng" },
  ];

  return (
    <aside
      className={`
        bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white 
        p-6 flex flex-col items-center sticky top-0 h-[100vh] transition-all duration-300
        ${collapsed ? "w-20" : "md:w-72 w-24"}
        
      `}
    >
      <div className="flex flex-col items-center gap-3 mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          S
        </div>

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="bg-amber-500 p-2 rounded-full flex items-center justify-center"
        >
          {collapsed ? (
            <ArrowBigRightDash className="w-5 h-5 text-white" />
          ) : (
            <ArrowBigLeftDash className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Tên và role */}
        {!collapsed && (
          <div className="flex flex-col items-center mt-2">
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 items-center ">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setState(item.id)}
            className={`flex items-center transition-all duration-300 px-4 py-3 rounded-xl w-full ${
              state === item.id
                ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/30"
                : "hover:bg-gray-700/50"
            }`}
          >
            <item.icon className="w-7 h-7 md:w-5 md:h-5" />
            {!collapsed && <span className="ml-3 font-medium hidden md:inline">{item.label}</span>}
            {!collapsed && state === item.id && (
              <ChevronRight size={18} className="ml-auto" />
            )}
          </button>
        ))}
      </nav>

      {/* Popup Setting */}
      {popupSetting && !collapsed && (
        <div className="w-full mt-4">
          <PopupSetting />
        </div>
      )}

      {/* Nút Setting */}
      <button
        onClick={() => setPopupSetting((prev) => !prev)}
        className={`flex items-center transition-all duration-300 px-4 py-3 rounded-xl mt-auto  ${
          collapsed ? "justify-center" : "gap-3 hover:bg-gray-700/50"
        }`}
      >
        <Settings className="w-7 h-7 md:w-5 md:h-5" />
        {!collapsed && <span className="font-medium">Cài đặt</span>}
      </button>
    </aside>
  );
}
