import { Settings } from "lucide-react";
import { useState } from "react";
import { OverView } from "../Components/AdminBrandComponent/DashBoardComponent/OverView";
import { BannerSetting } from "../Components/AdminBrandComponent/DashBoardComponent/Banner/BannerSetting";
import { SideBoard } from "../Components/AdminBrandComponent/DashBoardComponent/SideBoard";
import { Stores } from "../Components/AdminBrandComponent/DashBoardComponent/Store";
import Coupon from "../Components/AdminBrandComponent/DashBoardComponent/Coupon";
import { Revenue } from "../Components/AdminBrandComponent/DashBoardComponent/Revenue";
import Collections from "../Components/AdminBrandComponent/DashBoardComponent/Collections";
import ProductManagement from "../Components/AdminBrandComponent/DashBoardComponent/ProductManagement";



export const AdminDashboard = () => {
  const [status, setStatus] = useState("Dashboard");
  const statusComponent = (status: string) => {
    switch (status) {
      case "Dashboard":
        return <OverView />;
      case "Banner":
        return <BannerSetting />;
      case "Mã giảm giá":
        return <Coupon/>;
      case "Cửa hàng":
        return <Stores />;
      case "Doanh thu":
        return <Revenue />;
      case "Collections":
        return <Collections />;
      case "Cài đặt":
        return <Settings />;
      case "Sản phẩm":
        return <ProductManagement />;
      default:
    }
  };
  return (
    <div className=" flex bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 flex-row min-h-screen w-full">
      <div className="w-64">
        <SideBoard onClick={setStatus} status={status} />
      </div>
      <div className="w-full">{statusComponent(status)}</div>
    </div>
  );
};
