import React, { createContext, useEffect, useState, type ReactNode } from "react";
import type { order, Product } from "../types/type";
import axios from "axios";
import { api_Config, UseApiUrl } from "../types/api";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

type FilterProductContextType = {
  key: string;
  DonHang: order[];
  donhangMoiNhat: any;
  isLoading: boolean;
  soLuongDonHang: number;
  TongThuChi: number;
  dataProduct: Product[];
  dataFilter: Product[];
  dataFavouriteItemUser: Product[];
  setDataProduct: React.Dispatch<React.SetStateAction<Product[]>>;
  setKey: React.Dispatch<React.SetStateAction<string>>;
  huyDonHang: (orderId: string) => Promise<void>;
};

export const FilterProductContext = createContext<FilterProductContextType>({
  key: "",
  DonHang: [],
  isLoading: false,
  soLuongDonHang: 0,
  donhangMoiNhat: [],
  TongThuChi: 0,
  dataFavouriteItemUser: [],
  dataProduct: [],
  dataFilter: [],
  setDataProduct: () => {},
  setKey: () => {},
  huyDonHang: async () => {},

});

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [key, setKey] = useState<string>("");
  const [dataProduct, setDataProduct] = useState<Product[]>([]);
  const [dataFavouriteItemUser, setDataFavouriteItemUser] = useState<Product[]>([]);
  const [dataFilter, setDataFilter] = useState<Product[]>([]);
  const [soLuongDonHang, setSoLuongDonHang] = useState(0);
  const [TongThuChi, setTongThuChi] = useState(0);
  const [DonHang, setDonHang] = useState([]);
  const [donhangMoiNhat, setDonhangMoiNhat] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [huyDonHangs, setHuyDonHangs] = useState<boolean>(false);
  const location = useLocation();
 const huyDonHang=async(orderId:string)=>{
    try {
      const response=await axios.post(`${UseApiUrl(api_Config.User.HuyDon)}?orderId=${orderId}`,{},
        {
          headers: {  
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setHuyDonHangs(!huyDonHangs);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Hủy đơn hàng không thành công!");
    }
  };
  useEffect(() => {
    console.log(token)
    const fetch = async () => {
      try {
        const response = await axios.get(UseApiUrl(api_Config.Product.GetProduct));
        setDataProduct(response.data);
        if (response.data) {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (dataProduct.length === 0) {
      fetch();
    }
  }, [dataProduct.length, location.pathname]); 

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${UseApiUrl(api_Config.Product.SearchProduct)}?key=${key}`);
        setDataFilter(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [key, location.pathname]);

  useEffect(() => {
    const fetch = async () => {
      if (!token) return; 
      
      try {
        const response = await axios.get(`${UseApiUrl(api_Config.User.GetItemsFavourite)}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setDataFavouriteItemUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [token, location.pathname]); 

  useEffect(() => {
    const fetch = async () => {
      if (!token) return; 
      
      try {
        const response = await axios.get(`${UseApiUrl(api_Config.User.SoLuongDonVaTongThuChi)}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setSoLuongDonHang(response.data.soLuongDon);
        setTongThuChi(response.data.tongTien);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [token, location.pathname]); 

  useEffect(() => {
    const fetch = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get(`${UseApiUrl(api_Config.User.LayDonHang)}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setDonHang(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [token, location.pathname,huyDonHangs]);

  useEffect(() => {
    const fetch = async () => {
      if (!token) return; 
      
      try {
        const response = await axios.get(`${UseApiUrl(api_Config.User.DonHangGanDay)}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setDonhangMoiNhat(response.data.ngayMoiNhat);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [token, huyDonHang]); 
   
  
    return (
    <FilterProductContext.Provider 
      value={{ 
        key, 
        setKey, 
        dataProduct, 
        setDataProduct, 
        dataFilter, 
        dataFavouriteItemUser, 
        soLuongDonHang, 
        TongThuChi, 
        DonHang, 
        donhangMoiNhat, 
        isLoading,
        huyDonHang
      }}
    >
      {children}
    </FilterProductContext.Provider>
  );
}
