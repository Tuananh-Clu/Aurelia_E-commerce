import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { api_Config, UseApiUrl } from "../types/api";
import toast from "react-hot-toast";
import type { Appointment, order, Product } from "../types/type";
export type DashBoardShopCOntexts = {
  dataLichHen: Appointment[] | undefined;
  dataDonHang: order[] | undefined;
  datasanPham: any;
  statePage: string;
  GetDataDashBoard: (
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => Promise<void>;
  handleClickUpdateStatus: (status: string, orderId: string) => Promise<void>;
  updateProduct:(data:Product)=>Promise<void>;
  editProduct:(data:Product)=>Promise<void>;
  setStatePage: React.Dispatch<React.SetStateAction<string>>;
  taskFetchSanPham:()=>Promise<void>;
  dataCustomer:any[] |undefined;
  totalCustomer:number;
  totaldoanhthu:number;
  avgchitieu:number;
};
export const DashBoardShopCOntext = createContext<DashBoardShopCOntexts>({
  GetDataDashBoard: async () => {},
  dataDonHang: [],
  dataLichHen: [],
  datasanPham: [],
  dataCustomer: undefined,
  totalCustomer:0,
  totaldoanhthu:0,
  avgchitieu:0,
  handleClickUpdateStatus: async () => {},
  taskFetchSanPham: async () => {},
  updateProduct:async()=>{},
  editProduct:async()=>{},
  statePage: "dashboard",
  setStatePage: () => {},
});
export const DashBoardShopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dataLichHen, setDataLichHen] = useState<Appointment[]>();
  const [dataDonHang, setDataDonHang] = useState<order[]>();
  const [datasanPham, setDataSanPham] = useState<any>();
  const [dataCustomer, setDataCustomer] = useState<any[]>();
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totaldoanhthu, setTotaldoanhthu] = useState(0);
  const [avgchitieu, setAvgchitieu] = useState(0);
  const [statePage, setStatePage] = useState("dashboard");
  const shopData: any = localStorage.getItem("shop");
  const data: any = JSON.parse(shopData);
  const GetDataDashBoard = async (
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const response = await axios.get(
        `${UseApiUrl(api_Config.Shop.LayDashBoard)}?shopId=${data.shopId}`
      );
      setState(response.data);
    } catch {
      toast.error("");
    }
  };
    const taskFetch = async () => {
      try {
        const reponse = await axios.get(
          UseApiUrl(
            `${api_Config.Shop.LayDanhSachLichHenVaDonHang}?shopId=${data.shopId}`
          )
        );
        setDataDonHang(reponse.data.listOrder);
        setDataLichHen(reponse.data.listAppoinment);
      } catch {
        
      }
    };

  const handleClickUpdateStatus = async (status: string, orderId: string) => {
    try {
      const response = await axios.post(
        UseApiUrl(`${api_Config.Shop.UpdateTrangThaiDonHang}`),
        {
          shopId: data.shopId,
          orderId: orderId,
          status: status,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      
      await taskFetch();
    } catch {
      
    }
  };
  const taskFetchSanPham = async () => {
    try {
      const reponse = await axios.get(
        UseApiUrl(
          `${api_Config.Shop.LaySanPhamCuaShop}?shopId=${data.shopId}`
        )
      );
      setDataSanPham(reponse.data);
    } catch {
      
    }
  };
  const updateProduct=async(datas:Product)=>{
    try {
      const reponse = await axios.post(
        UseApiUrl(
          `${api_Config.Shop.ThemSanPham}?shopId=${data.shopId}`,
        ),
        datas,
        { headers: { "Content-Type": "application/json" } }
      );
      
      taskFetchSanPham();
    } catch {
      
    }
  };
    const editProduct=async(datas:Product)=>{
    try {
      const reponse = await axios.post(
        UseApiUrl(
          `${api_Config.Shop.SuaSanPham}?shopId=${data.shopId}`,
        ),
        datas,
        { headers: { "Content-Type": "application/json" } }
      );
      
      taskFetchSanPham();
    } catch {
      
    }
  };
  const getAllCustomer = async () => {
    try {
      const reponse = await axios.get(
        UseApiUrl(`${api_Config.Shop.GetAllCustomer}`)
      );
      setDataCustomer(reponse.data.listCustomer);
      setTotalCustomer(reponse.data.totalCustomer);
      setTotaldoanhthu(reponse.data.totalDoanhThu);
      setAvgchitieu(reponse.data.averageChiTieuKhachHang);
    } catch {
      
    }
  };
  useEffect(() => {
    taskFetchSanPham();
    taskFetch();
    getAllCustomer();
  }, []);
  return (
    <DashBoardShopCOntext.Provider
      value={{
        GetDataDashBoard,
        dataDonHang,
        dataLichHen,
        handleClickUpdateStatus,
        datasanPham,
        updateProduct,
        editProduct,
        statePage
        ,setStatePage,
        taskFetchSanPham,
        dataCustomer,
        totalCustomer,
        totaldoanhthu,
        avgchitieu
      }}
    >
      {children}
    </DashBoardShopCOntext.Provider>
  );
};
