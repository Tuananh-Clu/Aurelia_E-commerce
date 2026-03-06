import { useContext, useState} from "react";
import { DashBoardShop } from "../../Components/DashBoardShopComponent/DashBoard";
import { DashBoardShopCOntext } from "../../contexts/DashBoardShopContext";
import ProductList from "../../Components/DashBoardShopComponent/ProductList";
import AppointmentList from "../../Components/DashBoardShopComponent/AppointmentList";
import ListCustomers from "../../Components/DashBoardShopComponent/ListCustomers";
import OrderListElegant from "../../Components/DashBoardShopComponent/OrderList";
import { SideBar } from "../../Components/AdminBrandComponent/DashBoardComponent/SideBar";
export default function MainContents() {
  const [statePage, setStatePage] = useState("dashboard");
  const { dataLichHen } = useContext(DashBoardShopCOntext);
  var bru = () => {
    switch (statePage) {
      case "dashboard":
        return <DashBoardShop onclick={() => setStatePage("orders")} onChange={() => setStatePage("appointments")} />;
      case "orders":
        return <OrderListElegant />;
      case "appointments":
        return <AppointmentList appointments={dataLichHen} />;
      case "products":
        return <ProductList />;
      case "customers":
        return <ListCustomers/>;
      default:
        break;
    }
  };
  return (
    <div className="flex flex-row h-[100vh] bg-gray-50">
      <SideBar onClick={setStatePage} status={statePage} type="shop" />
      <div className="w-full max-h-[100vh] overflow-y-auto p-6">
              {bru()}
      </div>
    </div>
  );
}
