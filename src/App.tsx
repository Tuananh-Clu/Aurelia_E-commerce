import { Route, Routes, useLocation} from "react-router-dom";
import { useEffect, useRef, lazy, Suspense } from "react";
import { MainProduct } from "./Page/MainProduct";
import { Toaster } from "react-hot-toast";
import { Checkout } from "./Page/CheckOut";
import { MockPayMent} from "./Page/MockPayMent";
import { BodySize } from "./Page/BodySize";
import FormBooking from "./Components/BookingAppointment/FormBooking";
import { MainPage } from "./Components/TrackingOrder/MainPage";
import FormAuthorForShop from "./Components/FormAuthorForShop";
import DashboardShop from "./Page/DashBoardShop";
import { AdminSiteLog } from "./Components/AdminBrandComponent/LogIn/AdminSiteLog";
import { AdminDashboard } from "./Page/DashBoardAdmin";


const Home = lazy(() =>
  import("./Page/Home").then((m) => ({ default: m.Home }))
);
const Collection = lazy(() =>
  import("./Page/Collection").then((m) => ({ default: m.Collection }))
);
const AllCollection = lazy(() =>
  import("./Page/AllCollection").then((m) => ({ default: m.AllCollection }))
);
const Product = lazy(() =>
  import("./Page/Product").then((m) => ({ default: m.Product }))
);
const Search = lazy(() =>
  import("./Page/Search").then((m) => ({ default: m.Search }))
);
const Cart = lazy(() =>
  import("./Page/Cart").then((m) => ({ default: m.Cart }))
);
const Account = lazy(() =>
  import("./Page/Account").then((m) => ({ default: m.Account }))
);
const About = lazy(() =>
  import("./Page/About").then((m) => ({ default: m.About }))
);

function App() {
  const location = useLocation();
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [location]);

  return (
    <div ref={ref}>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense
        fallback={
          <div className="w-full py-20 text-center text-gray-600">
            Đang tải...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Collection" element={<AllCollection />} />
          <Route path="/Collection/:id" element={<Collection />}></Route>
          <Route path="/Fashion/Products" element={<Product />} />
          <Route path="/Fashion/Products/:id" element={<MainProduct />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<Checkout />} />
          <Route path="/payment/:id" element={<MockPayMent/>}/>
          <Route path="/bodyMeasurements" element={<BodySize/>}/>
          <Route path="/BookingAppointment/:id" element={<FormBooking/>}/>
          <Route path="/tracking/:id" element={<MainPage/>}/>
          <Route path="/logInShop" element={<FormAuthorForShop/>}/>
          <Route path="/DashBoardShop" element={<DashboardShop/>}/>
          <Route path="/Admin" element={<AdminSiteLog/>}/>
          <Route path="/Admin/DashboardAdmin" element={<AdminDashboard/>}/>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
