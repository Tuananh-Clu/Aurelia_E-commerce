import axios from "axios";
import React, { createContext, useState } from "react";
import { api_Config, UseApiUrl } from "../services/api";
import { type ProductAppoinment, type Shop } from "../types/type";

type StoreContexts = {
  dataStore: Shop[];
  GetStore: (idProduct: string, productSize: string) => Promise<void>;
  GetStoreById: (
    id: string | undefined,
    setState: React.Dispatch<React.SetStateAction<Shop | undefined>>
  ) => Promise<void>;
  setAppointmentProduct: React.Dispatch<
    React.SetStateAction<ProductAppoinment | null>
  >;
  appointmentProduct: ProductAppoinment | null;
};
export const StoreContext = createContext<StoreContexts>({
  dataStore: [],
  appointmentProduct: null,
  setAppointmentProduct: () => {},
  GetStore: async () => {},
  GetStoreById: async () => {},
});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataStore, setDataStore] = useState<Shop[]>([]);
  const [appointmentProduct, setAppointmentProduct] =
    useState<ProductAppoinment | null>(null);
  const GetStore = async (idProduct: string, productSize: string) => {
    try {
      const data = await axios.post(UseApiUrl(api_Config.Shop.GetShop), {
        idProduct,
        productSize,
      });
      setDataStore(data.data);
    } catch (error) {
      
    }
  };
  const GetStoreById = async (
    id: string | undefined,
    setState: React.Dispatch<React.SetStateAction<Shop | undefined>>
  ) => {
    try {
      const data = await axios.get(
        `${UseApiUrl(api_Config.Shop.GetShopById)}?Id=${id}`
      );
      setState(data.data);
    } catch (error) {
      
    }
  };
  return (
    <StoreContext.Provider
      value={{
        GetStore,
        dataStore,
        GetStoreById,
        setAppointmentProduct,
        appointmentProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
