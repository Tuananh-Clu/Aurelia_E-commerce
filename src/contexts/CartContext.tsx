import React, { createContext,  useContext,  useState, useCallback, useMemo } from "react";
import { type order, type Cart } from "../types/type";
import axios from "axios";
import { Toaster } from "../Components/Toaster";
import { api_Config, UseApiUrl } from "../services/api";
import { AdminContext } from "./AdminContext";

type CartContexts = {
  CartDataAdd: Cart[];
  dataOrder: order | undefined;
  handleClickPayment: () => Promise<void>;
  setDataOrder: React.Dispatch<React.SetStateAction<order | undefined>>;
  setCartDataAdd: React.Dispatch<React.SetStateAction<Cart[]>>;
  LayToaDo: (address: string) => Promise<{ lat: number; lon: number } | null>;
  phiVanChuyen: string;
  LayPhiVanCHuyen: (DuLieuDauRa: boolean) => Promise<void>;
};

export const CartContext = createContext<CartContexts>({
  CartDataAdd: [],
  dataOrder: undefined,
  handleClickPayment: async () => {},
  LayToaDo: async () => null,
  setDataOrder: () => {},
  setCartDataAdd: () => {},
  phiVanChuyen: "",
  LayPhiVanCHuyen: async () => {},

});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const {setSelectvoucher } = useContext(AdminContext);
  const [CartDataAdd, setCartDataAdd] = useState<Cart[]>([]);
  const [dataOrder, setDataOrder] = useState<order | undefined>();
  const [phiVanChuyen, setPhiVanChuyen] = useState("");
  const [shopId, setShopId] = useState<string>("");
  
  // Memoize token to avoid reading from localStorage on every render
  const token = useMemo(() => localStorage.getItem("token"), []);
  const LOCATIONIQ_KEY = "pk.fd3f99a25f3d03893a6936b3b255288c";
  
  // Memoize handleClickPayment to prevent recreation
  const handleClickPayment = useCallback(async () => {
    if (!dataOrder) return;

    try {
      if(shopId===""){
        return;
      }
      setSelectvoucher([]);
      // Thêm order
      await axios.post(
        `${UseApiUrl(api_Config.User.SuccessPayAddOrder)}?shopId=${shopId}`,
        dataOrder,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Cập nhật số lượng sản phẩm
      await axios.post(
        UseApiUrl(api_Config.Product.UpdateQuantityProduct),
        dataOrder.product.map((item) => ({
          productId: item.Itemid,
          quantity: item.quantity,
        }))
      );
      await axios.post(
        UseApiUrl(api_Config.User.UpdateTier),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
     const reponse= await axios.get(UseApiUrl(api_Config.User.LayTHongTinUser), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("user", JSON.stringify(reponse.data.user));
      Toaster.success("Thanh toán thành công! Đơn hàng đã được tạo.");
    } catch (error) {
      console.error(error);
      Toaster.error("Thanh toán không thành công! Vui lòng thử lại.");
    }
  }, [dataOrder, shopId, token, setSelectvoucher]);
  
  // Memoize LayToaDo
  const LayToaDo = useCallback(async (
    address: string
  ): Promise<{ lat: number; lon: number } | null> => {
    try {
      const response = await axios.get("https://us1.locationiq.com/v1/search", {
        params: {
          key: LOCATIONIQ_KEY,
          q: address,
          format: "json",
          limit: 1,
        },
      });

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat, lon };
      }
      return null;
    } catch (err) {
      console.error("Lỗi khi gọi LocationIQ:", err);
      return null;
    }
  }, []);

  // Memoize LayPhiVanCHuyen
  const LayPhiVanCHuyen = useCallback(async (DuLieuDauRa: boolean) => {
      try {
        const data = await axios.post(
          `${UseApiUrl(api_Config.Shop.SapXepDon)}?nana=${DuLieuDauRa}`,
          dataOrder,{headers:{"Content-Type":"application/json"}}
        );
        setPhiVanChuyen(data.data.shippingFee);
        setShopId(data.data.storeId);
        Toaster.success("Đã tính phí vận chuyển thành công!");
      } catch {
        Toaster.error("Không thể tính phí vận chuyển. Vui lòng thử lại.");
      }
    }, [dataOrder]);
    
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    CartDataAdd,
    setCartDataAdd,
    dataOrder,
    setDataOrder,
    handleClickPayment,
    LayToaDo,
    LayPhiVanCHuyen,
    phiVanChuyen,
  }), [CartDataAdd, dataOrder, handleClickPayment, LayToaDo, LayPhiVanCHuyen, phiVanChuyen]);
    
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

