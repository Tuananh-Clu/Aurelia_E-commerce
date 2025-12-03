import { useContext} from "react";
import { SideBar } from "../../Components/DashBoardShopComponent/SideBar";
import { DashBoardShop } from "../../Components/DashBoardShopComponent/DashBoard";
import { DashBoardShopCOntext } from "../../contexts/DashBoardShopContext";
import ProductList from "../../Components/DashBoardShopComponent/ProductList";
import AppointmentList from "../../Components/DashBoardShopComponent/AppointmentList";
import ListCustomers from "../../Components/DashBoardShopComponent/ListCustomers";
import OrderListElegant from "../../Components/DashBoardShopComponent/OrderList";
export default function MainContents() {
  const { statePage, setStatePage } = useContext(DashBoardShopCOntext);
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
    <div className="flex min-h-screen bg-gray-50">
      <SideBar setState={setStatePage}  state={statePage}/>
      <div className="w-full">
              {bru()}
      </div>
    </div>
  );
}
