import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";
import type { DiaChi } from "../types/type";

interface DiaChiContextType {
  savedAddress: DiaChi[];
  fetchDiaChi: () => void;
  SaveDiaChi: (data: Partial<DiaChi>) => Promise<void>;
  XoaDiaChi: (data: DiaChi) => Promise<void>;
}

export const DiaChiContext = createContext<DiaChiContextType>({
  savedAddress: [],
  fetchDiaChi: async () => {},
  SaveDiaChi: async () => {},
  XoaDiaChi: async () => {},
});

export const DiaChiProvider = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  const [savedAddress, setSaveAddress] = useState<DiaChi[]>([]);

  // --- Fetch danh sách địa chỉ ---
  const fetchDiaChi = async () => {
    if (!token) return;
    try {
      const response = await axios.get(UseApiUrl(api_Config.User.LayDiaChi), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaveAddress(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDiaChi();
  }, []);

  // --- Thêm địa chỉ mới ---
  const SaveDiaChi = async (data: Partial<DiaChi>) => {
    if (!token) return;
    try {
      const response = await axios.post(
        UseApiUrl(api_Config.User.LuuDiaChi),
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      fetchDiaChi(); // reload danh sách
      Toaster.success("Đã lưu địa chỉ thành công!");
    } catch (error) {
      Toaster.error("Không thể lưu địa chỉ. Vui lòng thử lại.");
      console.error(error);
    }
  };

  // --- Xóa địa chỉ ---
  const XoaDiaChi = async (data:DiaChi) => {
    if (!token) return;
    try {
      await axios.post(UseApiUrl(api_Config.User.XoaDiaChi),data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      fetchDiaChi();
      Toaster.success("Đã xóa địa chỉ thành công!");
    } catch (error) {
      Toaster.error("Không thể xóa địa chỉ. Vui lòng thử lại.");
      console.error(error);
    }
  };

  return (
    <DiaChiContext.Provider
      value={{ savedAddress, fetchDiaChi, SaveDiaChi, XoaDiaChi }}
    >
      {children}
    </DiaChiContext.Provider>
  );
};
