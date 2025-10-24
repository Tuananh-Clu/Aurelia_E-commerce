import axios from "axios";
import React, { createContext,  useState, type ReactNode, type SetStateAction } from "react";
import { api_Config, UseApiUrl } from "../types/api";
import toast from "react-hot-toast";



type AuthContextType = {
  isSignned: boolean;
  setIsignned: React.Dispatch<SetStateAction<boolean>>;
  logIn: (Email: string, Password: string) => Promise<void>;

};

export const AuthForShopContext = createContext<AuthContextType>({
  isSignned: false,
  setIsignned: () => {},
  logIn: async () => {},
});

export const AuthForShopProvider = ({ children }: { children: ReactNode }) => {
  const [isSignned, setIsignned] = useState(false);
  const logIn = async (Email: string, Password: string) => {
    try {
      const response = await axios.post(
        UseApiUrl(api_Config.authentication.ShopLogin),
        { Email, Password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        localStorage.setItem("shop",JSON.stringify(response.data.dataStore))
        setIsignned(true);
        localStorage.setItem("tokenShop",response.data.token);
      }
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);

    }
  };

 
  return (
    <AuthForShopContext.Provider value={{ isSignned, setIsignned, logIn }}>
      {children}
    </AuthForShopContext.Provider>
  );
};
