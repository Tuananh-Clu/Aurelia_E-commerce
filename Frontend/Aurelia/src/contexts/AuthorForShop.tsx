import axios from "axios";
import  {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";
import { AuthContext } from "./Author";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  logIn: (Email: string, Password: string) => Promise<void>;
  errorMessage: string | null;
  shopData?: any;
};

export const AuthForShopContext = createContext<AuthContextType>({
  logIn: async () => {},
  errorMessage: null,
  shopData: null,
});

export const AuthForShopProvider = ({ children }: { children: ReactNode }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shopData, setShopData] = useState<any>(null);
  const navigate = useNavigate();
  const { fetchData } = useContext(AuthContext);
  useEffect(() => {
    const data = fetchData({ type: "shop" });
    setShopData(data);
    localStorage.setItem("shopData", JSON.stringify(data));

    if ((data as object) !== null) {
    }
  }, [navigate]);
  const logIn = async (Email: string, Password: string) => {
    try {
      const response = await axios.post(
        UseApiUrl(api_Config.authentication.ShopLogin),
        { Email, Password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        navigate("/DashBoardShop");
        Toaster.success("Đăng nhập thành công");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <AuthForShopContext.Provider value={{ logIn, errorMessage, shopData }}>
      {children}
    </AuthForShopContext.Provider>
  );
};
