import { useContext} from "react";
import  {SideBar}  from "../../Features/DashBoard/DashBoardShop/components/SideBar";
import  {DashBoardShop}  from "../../Features/DashBoard/DashBoardShop/components/DashBoard";
import  {DashBoardShopCOntext}  from "../../Providers/DashBoardShopContext";
import ProductList from "../../Features/DashBoard/DashBoardShop/components/ProductList";
import AppointmentList from "../../Features/DashBoard/DashBoardShop/components/AppointmentList";
import ListCustomers from "../../Features/DashBoard/DashBoardShop/components/ListCustomers";
import OrderListElegant from "../../Features/DashBoard/DashBoardShop/components/OrderList";
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
    <div className="flex flex-row h-[100vh] bg-gray-50">
      <SideBar setState={setStatePage}  state={statePage}/>
      <div className="w-full max-h-[100vh] overflow-y-auto p-6">
              {bru()}
      </div>
    </div>
  );
}
