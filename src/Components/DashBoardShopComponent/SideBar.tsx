import React, { useContext } from "react";
import {
  LayoutDashboard,
  Package,
  Calendar,
  ShoppingCart,
  Settings,
  Users,
  ChevronRight,
} from "lucide-react";
import { PopupSetting } from "./PopupSetting";
import { NotificationContext } from "../../config/NotifycationContext";
type SideBars={
  setState:React.Dispatch<React.SetStateAction<string>>
  state:string
}

export function SideBar({setState,state}:SideBars){

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "orders", icon: ShoppingCart, label: "Đơn hàng" },
    { id: "appointments", icon: Calendar, label: "Lịch hẹn" },
    { id: "products", icon: Package, label: "Sản phẩm" },
    { id: "customers", icon: Users, label: "Khách hàng" },
  ];
  const {name}=useContext(NotificationContext)
const [popupSetting,setPopupSetting]=React.useState(false)  
  return (
    <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex flex-col sticky top-0 h-screen">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          S
        </div>
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-xs text-gray-400">Admin Dashboard</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setState(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              state === item.id
                ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/30"
                : "hover:bg-gray-700/50"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
            {state === item.id && <ChevronRight size={18} className="ml-auto" />}
          </button>
        ))}
      </nav>
      {popupSetting?<div className="w-full"><PopupSetting/>
      </div>:""}
      <button onClick={() => setPopupSetting((prev)=>!prev)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-700/50 transition-all mt-auto">
        <Settings size={20} />
        <span className="font-medium">Cài đặt</span>
      </button>
    </aside>
  );
}
