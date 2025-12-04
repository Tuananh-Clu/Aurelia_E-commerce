import axios from "axios";
import React, { createContext, useEffect, useState, type ReactNode, type SetStateAction } from "react";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";
 


type AuthContextType = {
  isSignned: boolean;
  setIsignned: React.Dispatch<SetStateAction<boolean>>;
  logIn: (Email: string, Password: string) => Promise<void>;
  register:(UserName:string,Email:string,Password:string)=>Promise<void>
   UpdateProfile:(name:string,email:string,phone:string,address:string,avatar:string)=>Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isSignned: false,
  setIsignned: () => {},
  logIn: async () => {},
  register:async () => {},
   UpdateProfile:async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSignned, setIsignned] = useState(false);
  const logIn = async (Email: string, Password: string) => {
    try {
      const response = await axios.post(
        UseApiUrl(api_Config.authentication.login),
        { Email, Password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        localStorage.setItem("user",JSON.stringify(response.data.user))
        setIsignned(true);
        localStorage.setItem("token",response.data.token);
        Toaster.success("Đăng nhập thành công!");
      }
    } catch (error) {
      Toaster.error("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
    }
  };
  const register=async(UserName:string,Email:string,Password:string)=>{
     try {
      const response = await axios.post(
        UseApiUrl(api_Config.authentication.signUp),
        {UserName, Email, Password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setIsignned(true);
        localStorage.setItem("user",JSON.stringify(response.data.user))
        localStorage.setItem("token",response.data.token);
        Toaster.success("Đăng ký thành công! Chào mừng bạn đến với Aurelia!");
      }
    } catch (error) {
      Toaster.error("Đăng ký thất bại! Vui lòng thử lại.");
    }
  }
   const token=localStorage.getItem("token");
  useEffect(()=>{
    if(token?.length)
    {
      setIsignned(true)
    }
  })
  const UpdateProfile=async(name:string,email:string,phone:string,address:string,avatar:string)=>{
    try {
      const response = await axios.post(
        UseApiUrl(api_Config.User.updateprofile),
        {hovaten:name,email:email,soDt:phone,address:address,avatarUrl:avatar},
        { headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
          localStorage.setItem("user",JSON.stringify(response.data.user))
          Toaster.success("Đã cập nhật thông tin cá nhân thành công!");
      }
    } catch (error) {
      Toaster.error("Không thể cập nhật thông tin. Vui lòng thử lại.");
    }
  }
  return (
    <AuthContext.Provider value={{ isSignned, setIsignned, logIn ,register, UpdateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
