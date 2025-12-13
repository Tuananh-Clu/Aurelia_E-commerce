import React, { createContext} from "react";
import type {
  Appointment,
  AppointmentCustomer,
  filterSLot,
} from "../types/type";
import axios from "axios";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";
import { api_Response } from "../services/http";

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

  LocSlot: (date: string, shopId: string) => Promise<filterSLot[] | undefined>;
  LayDachSachLichHenCuaUser: () => Promise<AppointmentCustomer | void>;
};

export const AppointmentContext = createContext<AppointmentContexts>({
  UpLoadAppointment: async () => {},
  LocSlot: async () => [],
  UpLoadAppointmentForCustomer: async () => {},
  LayDachSachLichHenCuaUser: async () => {},
});

export const AppointmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const UpLoadAppointment = async (
    item: Appointment | undefined,
    shopId: string,
    setState: React.Dispatch<React.SetStateAction<string>>
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
      setState(response.data.message);
      Toaster.success("Đã tạo lịch hẹn thành công!");
    } catch (error) {
      console.error("Lỗi Fetch", error);
      Toaster.error("Không thể tạo lịch hẹn. Vui lòng thử lại.");
    }
  };
  const UpLoadAppointmentForCustomer = async (
    item: AppointmentCustomer | undefined,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const response: any = await api_Response(
        UseApiUrl(api_Config.User.AddCuocHenVaoUSer),
        "POST",
        item,
        {
          "Content-Type": "application/json",
        }
      );
      setState(response.data.message);
      Toaster.success("Đã thêm lịch hẹn vào tài khoản của bạn!");
    } catch (error) {
      console.error("Lỗi Fetch", error);
      setState("Không thể tạo lịch hẹn");
      Toaster.error("Không thể thêm lịch hẹn. Vui lòng thử lại.");
    }
  };
  const LocSlot = async (date: string, shopId: string) => {
    try {
      const data = await axios.post(
        `${UseApiUrl(api_Config.Shop.LaySlotDeLoc)}`,
        { shopId, date },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    } catch (error) {
      console.error("Lỗi Fetch", error);
    }
  };
  const LayDachSachLichHenCuaUser = async () => {
    try {
      const data = api_Response(
        UseApiUrl(api_Config.User.LayCuocHenTheoUser),
        "GET"
      );
      return data as Promise<AppointmentCustomer>;
    } catch (error) {
      console.error("Lỗi Fetch", error);
    }
  };
  return (
    <AppointmentContext.Provider
      value={{
        UpLoadAppointment,
        UpLoadAppointmentForCustomer,
        LocSlot,
        LayDachSachLichHenCuaUser,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
