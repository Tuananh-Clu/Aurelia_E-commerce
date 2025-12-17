import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useRef, lazy, Suspense, useState } from "react";
import { Toaster } from "react-hot-toast";
import { LoadingScreen } from "./Components/LoadingScreen";
import FormAuthorForShopAndAdmin from "./Components/FormAuthorForShopAndAdmin";
import { ForgotPassword } from "./Page/ForgotPassword";
import { ChangePassWord } from "./Page/ChangePassWord";


const MainProduct = lazy(() =>
  import("./Page/MainProduct").then((m) => ({ default: m.MainProduct }))
);
const Checkout = lazy(() =>
  import("./Page/CheckOut").then((m) => ({ default: m.Checkout }))
);
const MockPayMent = lazy(() =>
  import("./Page/MockPayMent").then((m) => ({ default: m.MockPayMent }))
);
const BodySize = lazy(() =>
  import("./Page/BodySize").then((m) => ({ default: m.BodySize }))
);
const FormBooking = lazy(() =>
  import("./Components/BookingAppointment/FormBooking").then((m) => ({
    default: m.default,
  }))
);
const MainPage = lazy(() =>
  import("./Components/TrackingOrder/MainPage").then((m) => ({
    default: m.MainPage,
  }))
);
const DashboardShop = lazy(() =>
  import("./Page/DashboardAccount/DashBoardShop").then((m) => ({
    default: m.default,
  }))
);
const AdminDashboard = lazy(() =>
  import("./Page/DashboardAccount/DashBoardAdmin").then((m) => ({
    default: m.AdminDashboard,
  }))
);

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
  import("./Page/DashboardAccount/DashBoardUser").then((m) => ({
    default: m.Account,
  }))
);
const About = lazy(() =>
  import("./Page/About").then((m) => ({ default: m.About }))
);

function App() {
  const location = useLocation();
  const ref = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

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
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
          <LoadingScreen />
        </div>


      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải...</p>
            </div>
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
          <Route path="/payment/:id" element={<MockPayMent />} />
          <Route path="/bodyMeasurements" element={<BodySize />} />
          <Route path="/BookingAppointment/:id" element={<FormBooking />} />
          <Route path="/tracking/:id" element={<MainPage />} />
          <Route path="/login" element={<FormAuthorForShopAndAdmin />} />
          <Route path="/DashBoardShop" element={<DashboardShop />} />
          <Route path="/Admin" element={<AdminDashboard />} />
          <Route path="/Forgot-PassWord" element={<ForgotPassword />} />
          <Route
            path="/reset-passWord"
            element={<ChangePassWord />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
