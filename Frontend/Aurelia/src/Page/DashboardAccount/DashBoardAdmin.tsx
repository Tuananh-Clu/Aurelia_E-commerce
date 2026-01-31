import { Settings } from "lucide-react";
import { useState } from "react";
import { OverView } from "@/Features/DashBoard/DashBoardAdmin/components/OverView";
import { BannerSetting } from "@/Features/DashBoard/DashBoardAdmin/components/Banner/BannerSetting";
import { SideBoard } from "@/Features/DashBoard/DashBoardAdmin/components/SideBoard";
import { Stores } from "@/Features/DashBoard/DashBoardAdmin/components/Store";
import Coupon from "@/Features/DashBoard/DashBoardAdmin/components/Coupon";
import { Revenue } from "@/Features/DashBoard/DashBoardAdmin/components/Revenue";
import Collections from "@/Features/DashBoard/DashBoardAdmin/components/Collections";
import ProductManagement from "@/Features/DashBoard/DashBoardAdmin/components/ProductManagement";



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
    <div className=" flex  bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 flex-row 
    h-[110vh] w-full">
      <div >
        <SideBoard onClick={setStatus} status={status} />
      </div>
      <div className="w-full h-[110vh]">{statusComponent(status)}</div>
    </div>
  );
};
