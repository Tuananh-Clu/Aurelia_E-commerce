import React, { createContext,  useState } from "react";
import { type order, type Cart } from "../types/type";
import axios from "axios";
import toast from "react-hot-toast";
import { api_Config, UseApiUrl } from "../types/api";

type CartContexts = {
  CartDataAdd: Cart[];
  dataOrder: order | undefined;
  handleClick: () => Promise<void>;
  setDataOrder: React.Dispatch<React.SetStateAction<order | undefined>>;
  setCartDataAdd: React.Dispatch<React.SetStateAction<Cart[]>>;
  LayToaDo: (address: string) => Promise<{ lat: number; lon: number } | null>;
  phiVanChuyen: string;
  LayPhiVanCHuyen: (DuLieuDauRa: boolean) => Promise<void>;
};

export const CartContext = createContext<CartContexts>({
  CartDataAdd: [],
  dataOrder: undefined,
  handleClick: async () => {},
  LayToaDo: async () => null,
  setDataOrder: () => {},
  setCartDataAdd: () => {},
  phiVanChuyen: "",
  LayPhiVanCHuyen: async () => {},

});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [CartDataAdd, setCartDataAdd] = useState<Cart[]>([]);
  const [dataOrder, setDataOrder] = useState<order | undefined>();
  const [phiVanChuyen, setPhiVanChuyen] = useState("");
  const [shopId, setShopId] = useState<string>("");
  const token = localStorage.getItem("token");
  const LOCATIONIQ_KEY = "pk.fd3f99a25f3d03893a6936b3b255288c";
  // Thanh toán
  const handleClick = async () => {
    if (!dataOrder) return;

    try {
      if(shopId===""){
        return;
      }
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
      toast.success("Thanh toán thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Thanh toán không thành công!");
    }
  };
  const LayToaDo = async (
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
  };

    const LayPhiVanCHuyen = async (DuLieuDauRa: boolean) => {
      try {
        const data = await axios.post(
          `${UseApiUrl(api_Config.Shop.SapXepDon)}?nana=${DuLieuDauRa}`,
          dataOrder,{headers:{"Content-Type":"application/json"}}
        );
        setPhiVanChuyen(data.data.shippingFee);
        setShopId(data.data.storeId);
      } catch {
        console.log("Loi LayPhiVanCHuyen");
      }
    };
    
  return (
    <CartContext.Provider
      value={{
        CartDataAdd,
        setCartDataAdd,
        dataOrder,
        setDataOrder,
        handleClick,
        LayToaDo,
        LayPhiVanCHuyen,
        phiVanChuyen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

