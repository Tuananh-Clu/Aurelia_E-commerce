/**
 * Product feature API – endpoints used by FIlterProduct (components call through this Provider)
 */
import { api_Url, UseApiUrl } from "@/services/api";

const Product = {
  GetProduct: "/api/Product/GetProduct",
  SearchProduct: "/api/Product/GetProductBySearch",
};

const User = {
  GetItemsFavourite: "/api/Client/GetItemFavourite",
  LayDonHang: "/api/Client/LayDonHang",
  SoLuongDonVaTongThuChi: "/api/Client/GetSoLuongDonHang",
  DonHangGanDay: "/api/Client/LayDonHangGanDay",
  HuyDon: "/api/Client/HuyDonHang",
};

export const productApi = {
  Product,
  User,
};

export { api_Url, UseApiUrl };
