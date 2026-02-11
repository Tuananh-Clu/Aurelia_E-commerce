import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/Author";
import Icon from "./icon";
import { motion, AnimatePresence } from "framer-motion";
import {  ArrowLeftCircle, ArrowRightCircle, LogOut, Menu } from "lucide-react";

export const SideBoard = ({
  onClick,
  status,
}: {
  onClick: React.Dispatch<React.SetStateAction<string>>;
  status: string;
}) => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-500 p-2 bg-white shadow-md rounded-lg"
      >
        <Menu size={20} />
      </button>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-400 lg:hidden"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 h-screen w-64 bg-white z-50 lg:hidden flex flex-col"
            >
              <SidebarContent
                expanded={true}
                setExpanded={setExpanded}
                status={status}
                onClick={onClick}
                navigate={navigate}
                logOut={logOut}
                closeMobile={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <aside
        className={`hidden lg:flex  left-0 top-0 h-screen ${
          expanded ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 z-500 flex-col transition-all duration-300`}
      >
        <SidebarContent
          expanded={expanded}
          setExpanded={setExpanded}
          status={status}
          onClick={onClick}
          navigate={navigate}
          logOut={logOut}
        />
      </aside>
    </>
  );
};

const SidebarContent = ({
  expanded,
  setExpanded,
  status,
  onClick,
  navigate,
  logOut,
  closeMobile,
}: any) => {
  const NAV_ITEMS = [
    { id: "Dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { id: "banner", label: "Banner", icon: "Image" },
    { id: "discount", label: "Mã giảm giá", icon: "Tag", badge: 3 },
    { id: "store", label: "Cửa hàng", icon: "Store" },
    { id: "revenue", label: "Doanh thu", icon: "Wallet" },
    { id: "collections", label: "Collections", icon: "Layers", badge: 12 },
    { id: "products", label: "Sản phẩm", icon: "Package", badge: 5 },
  ];

  return (
    <>
      <div className="p-6 flex justify-between items-center">
        {expanded && (
          <div>
            <h1 className="text-xl font-semibold uppercase tracking-widest">
              Aurelia
            </h1>
            <p className="text-xs text-gray-400 uppercase">
              Management System
            </p>
          </div>
        )}

        {setExpanded && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="hidden lg:block"
          >
            {expanded ? <ArrowLeftCircle /> : <ArrowRightCircle />}
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onClick(item.label);
              if (closeMobile) closeMobile();
            }}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition ${
              item.label === status
                ? "bg-gray-100 text-black"
                : "hover:bg-gray-50 text-gray-500"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon name={item.icon} />
              {expanded && <span>{item.label}</span>}
            </div>

            {item.badge && expanded && (
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => {
            navigate("/login");
            localStorage.removeItem("AdminToken");
            logOut({ typeAccount: "admin" });
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut />
          {expanded && <span>Đăng xuất</span>}
        </button>
      </div>
    </>
  );
};
