import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/Author";
import type { Clients } from "../../../types/type";
import { ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../contexts/CartContext";
import { logOutFireBase } from "../../../services/auth.service";

type LeftSides = {
  userString: Clients | null;
  navItems: any[];
  activeItem: any;
  setActiveItem: React.Dispatch<React.SetStateAction<any>>;
};

export const LeftSide: React.FC<LeftSides> = ({ navItems, activeItem, setActiveItem }) => {
  const { setIsignned, logOut } = useContext(AuthContext);
  const { setCartDataAdd } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut({ typeAccount: "client" });
    localStorage.clear();
    setIsignned(false);
    setCartDataAdd([]);
    navigate("/");
    logOutFireBase();
  };

  return (
    <aside className="w-64 flex justify-around  border-r border-gray-100  flex-col pt-12 pb-8 px-8 bg-white  ">
      <div className="mb-16 text-center">
        <h1 className="text-2xl tracking-[0.2em] font-medium font-serif text-text-main ">
          AURELIA
        </h1>
      </div>
      <nav className="flex flex-col flex-1">
        <div className="flex flex-col space-y-0">
          {navItems.map((item) => {
            const isActive = activeItem === item.activeItem;
            return (
              <button
              onClick={()=>setActiveItem(item.value)}
                key={item.name}
                className={`group flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800 text-xs tracking-widest uppercase transition-colors w-full text-left ${
                  isActive
                    ? "text-gray-800 font-semibold"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <span>{item.name}</span>
                {isActive && <ChevronRight size={16} />}
              </button>
            );
          })}
        </div>
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogOut}
          className="flex items-center gap-2 text-xs mt-32 tracking-widest uppercase text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
