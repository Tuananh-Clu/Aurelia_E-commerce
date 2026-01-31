
import { api_Url, UseApiUrl } from "@/services/api";

const User = {
  SuccessPayAddOrder: "/api/Client/AddDonHang",
  UpdateTier: "/api/Client/UpdateTier",
  XoaGioHang: "/api/Client/XoaGioHang",
};

const Product = {
  UpdateQuantityProduct: "/api/Product/updateQuantityProduct",
};

const Shop = {
  SapXepDon: "/api/Shop/SapXepDonChoCuaHang",
};

export const cartApi = {
  User,
  Product,
  Shop,
};

export { api_Url, UseApiUrl };
