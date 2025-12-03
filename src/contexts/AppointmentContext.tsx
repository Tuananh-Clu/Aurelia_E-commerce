import React, { createContext } from "react";
import type { Appointment, AppointmentCustomer, filterSLot } from "../types/type";
import axios from "axios";
import { api_Config, UseApiUrl } from "../services/api";
import toast from "react-hot-toast";

type AppointmentContexts = {
  UpLoadAppointment: (
    item: Appointment | undefined,
    shopId: string,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => Promise<void>;

  UpLoadAppointmentForCustomer: (
    item: AppointmentCustomer | undefined,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => Promise<void>;

  LocSlot: (
    date: string,
    shopId: string
  ) => Promise<filterSLot[] | undefined>; 
  LayDachSachLichHenCuaUser :()=>Promise<AppointmentCustomer|void>
};

export const AppointmentContext = createContext<AppointmentContexts>({
  UpLoadAppointment: async () => {},
  LocSlot:async()=>[],
  UpLoadAppointmentForCustomer:async()=>{},
  LayDachSachLichHenCuaUser :async()=>{}
});

export const AppointmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const token = localStorage.getItem("token");
  const UpLoadAppointment = async (
    item: Appointment | undefined,
    shopId: string,setState:React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const response = await axios.post(
        `${UseApiUrl(api_Config.Shop.GetAppointment)}?shopId=${shopId}`,
        item,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setState(response.data.message)
    } catch (error) {
      console.error("Lỗi Fetch", error);
      toast.error("Không thể tạo lịch hẹn");
    }
  };
  const UpLoadAppointmentForCustomer = async (
    item: AppointmentCustomer | undefined,setState:React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const response = await axios.post(
        `${UseApiUrl(api_Config.User.AddCuocHenVaoUSer)}`,
        item,
        {
         headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setState(response.data.message)
    } catch (error) {
      console.error("Lỗi Fetch", error);
      setState("Không thể tạo lịch hẹn");
    }
  };
  const LocSlot = async (
   date:string,shopId:string
  ) => {
    try {
      const data= await axios.post(
        `${UseApiUrl(api_Config.Shop.LaySlotDeLoc)}`,
        {shopId,date},
        {
         headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data.data

    } catch (error) {
      console.error("Lỗi Fetch", error);
    }
  };
   const LayDachSachLichHenCuaUser = async () => {
    try {
      const data= await axios.get(
        `${UseApiUrl(api_Config.User.LayCuocHenTheoUser)}`,{headers:{
          "Authorization":`Bearer ${token}`
        }}
      );
      return data.data

    } catch (error) {
      console.error("Lỗi Fetch", error);
    }
  };
  return (
    <AppointmentContext.Provider value={{ UpLoadAppointment ,UpLoadAppointmentForCustomer,LocSlot,LayDachSachLichHenCuaUser }}>
      {children}
    </AppointmentContext.Provider>
  );
};
