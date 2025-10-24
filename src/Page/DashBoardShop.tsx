import { useContext} from "react";
import { SideBar } from "../Components/DashBoardShopComponent/SideBar";
import { DashBoardShop } from "../Components/DashBoardShopComponent/DashBoard";

import OrderList from "../Components/DashBoardShopComponent/OrderList";
import AppointmentList from "../Components/DashBoardShopComponent/AppointmentList";
import { DashBoardShopCOntext } from "../config/DashBoardShopContext";
import ProductList from "../Components/DashBoardShopComponent/ProductList";
import ListCustomers from "../Components/DashBoardShopComponent/ListCustomers";

export default function MainContents() {
  const { statePage, setStatePage } = useContext(DashBoardShopCOntext);
  const { dataLichHen } = useContext(DashBoardShopCOntext);
  var bru = () => {
    switch (statePage) {
      case "dashboard":
        return <DashBoardShop onclick={() => setStatePage("orders")} onChange={() => setStatePage("appointments")} />;
      case "orders":
        return <OrderList />;
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
    <div className="flex min-h-screen bg-gray-50">
      <SideBar setState={setStatePage}  state={statePage}/>
      <div className="w-full">
              {bru()}
      </div>
    </div>
  );
}
