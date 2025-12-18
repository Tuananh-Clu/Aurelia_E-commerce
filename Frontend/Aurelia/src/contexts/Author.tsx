import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";
import { CartContext } from "./CartContext";
import { api_Response } from "../services/http";
import { useLocation } from "react-router-dom";

type AuthContextType = {
  isSignned: boolean;
  errorMessage: string;
  userData: any;
  setIsignned: React.Dispatch<SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<SetStateAction<string>>;
  logIn: (Email: string, Password: string) => Promise<void>;
  logOut: ({ typeAccount }: { typeAccount: string }) => Promise<void>;
  register: (
    UserName: string,
    Email: string,
    Password: string
  ) => Promise<void>;
  UpdateProfile: (
    name: string,
    email: string,
    phone: string,
    address: string,
    avatar: string
  ) => Promise<void>;
  fetchData: ({ type }: { type: string }) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isSignned: false,
  errorMessage: "",
  userData: null,
  setErrorMessage: () => {},
  setIsignned: () => {},
  logIn: async () => {},
  register: async () => {},
  UpdateProfile: async () => {},
  fetchData: async () => {},
  logOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSignned, setIsignned] = useState(false);
  const [doneWork, setDoneWork] = useState(false);
  const { CartDataAdd,  } = useContext(CartContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState<any>(null);

  const location = useLocation();
  const fetchData = async ({ type }: { type: string }) => {
    await axios
      .get(
        `${UseApiUrl(
          api_Config.authentication.getInfoUser
        )}?typeAccount=${type}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setIsignned(true);
          setUserData(response.data);
          const {passWord,...safeuser}=response.data;
          localStorage.setItem("user", JSON.stringify(safeuser));
        }
      })
      .catch(() => {
        setIsignned(false);
      });
  };
  useEffect(() => {
    const data = fetchData({ type: "client" });
    setDoneWork(false);
    setUserData(data);
  }, [location.pathname, doneWork, isSignned]);
  const logIn = async (Email: string, Password: string) => {
    try {
      const response = await axios.post(
        UseApiUrl(api_Config.authentication.login),
        { Email, Password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsignned(true);
        Toaster.success("Đăng nhập thành công!");
        api_Response<any>(
          UseApiUrl(api_Config.User.AutoAddGioHang),
          "POST",
          CartDataAdd,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setDoneWork(true);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi.");
    }
  };

  const register = async (
    UserName: string,
    Email: string,
    Password: string
  ) => {
    try {
      const response = await axios.post(
        UseApiUrl(api_Config.authentication.signUp),
        { UserName, Email, Password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsignned(true);
        Toaster.success("Đăng ký thành công! Chào mừng bạn đến với Aurelia!");
      }
      if (response.status === 400) {
        setErrorMessage(response.data.message);
      }
    } catch (error) {}
  };

  const UpdateProfile = async (
    name: string,
    email: string,
    phone: string,
    address: string,
    avatar: string
  ) => {
    try {
      const response = api_Response<any>(
        UseApiUrl(api_Config.User.updateprofile),
        "POST",
        { name, email, phone, address, avatar },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUserData(response);
      Toaster.success("Đã cập nhật thông tin cá nhân thành công!");
    } catch (error) {
      Toaster.error("Không thể cập nhật thông tin. Vui lòng thử lại.");
    }
  };
  const logOut = async ({ typeAccount }: { typeAccount: string }) => {
    try {
      api_Response(
        UseApiUrl(
          `${api_Config.authentication.Logout}?typeAccount=${typeAccount}`
        ),
        "DELETE",
        null,
        { withCredentials: true }
      );
      setIsignned(false);
      setUserData(null);
      Toaster.success("Đăng xuất thành công!");
    } catch (error) {
      Toaster.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isSignned,
        setIsignned,
        logIn,
        register,
        UpdateProfile,
        errorMessage,
        setErrorMessage,
        fetchData,
        userData,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
