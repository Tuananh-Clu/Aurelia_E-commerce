import axios from "axios";
import React, { createContext,  useState, type ReactNode, type SetStateAction } from "react";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";
 



type AuthContextType = {
  isSignned: boolean;
  setIsignned: React.Dispatch<SetStateAction<boolean>>;
  logIn: (Email: string, Password: string) => Promise<void>;
  errorMessage: string | null;

};

export const AuthForShopContext = createContext<AuthContextType>({
  isSignned: false,
  setIsignned: () => {},
  logIn: async () => {},
  errorMessage: null,
});

export const AuthForShopProvider = ({ children }: { children: ReactNode }) => {
  const [isSignned, setIsignned] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const logIn = async (Email: string, Password: string) => {
    try {
      const response = await axios.post(
        UseApiUrl(api_Config.authentication.ShopLogin),
        { Email, Password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        localStorage.setItem("shop",JSON.stringify(response.data.dataStore))
        setIsignned(true);
        localStorage.setItem("tokenShop",response.data.token);
        Toaster.success("Đăng nhập thành công");
      }
      
    } catch (error:any) {
      setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi.");
    }
  };

 
  return (
    <AuthForShopContext.Provider value={{ isSignned, setIsignned, logIn,errorMessage }}>
      {children}
    </AuthForShopContext.Provider>
  );
};
