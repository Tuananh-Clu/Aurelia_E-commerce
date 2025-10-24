import axios from "axios";
import React, { createContext, useEffect, useState, type ReactNode, type SetStateAction } from "react";
import { api_Config, UseApiUrl } from "../types/api";
import toast from "react-hot-toast";


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
        toast.success(response.data.message);
        localStorage.setItem("user",JSON.stringify(response.data.user))
        console.log(response.data.user)
        setIsignned(true);
        localStorage.setItem("token",response.data.token);
      }
    } catch (error) {
      console.log(error);
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
         toast.success(response.data.message);
        setIsignned(true);
        localStorage.setItem("user",JSON.stringify(response.data.user))
        localStorage.setItem("token",response.data.token);
      }
    } catch (error) {
      console.log(error);
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
          toast.success(response.data.message);
          localStorage.setItem("user",JSON.stringify(response.data.user))
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <AuthContext.Provider value={{ isSignned, setIsignned, logIn ,register, UpdateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
