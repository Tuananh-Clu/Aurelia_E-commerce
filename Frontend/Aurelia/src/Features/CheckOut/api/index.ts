/**
 * CheckOut feature API – endpoints used by CartContext, DiaChiContext, AdminContext
 * (components call through these Providers)
 * - Cart/order: SuccessPayAddOrder, UpdateTier, XoaGioHang, UpdateQuantityProduct, SapXepDon
 * - Address: LayDiaChi, LuuDiaChi, XoaDiaChi (User)
 * - Coupon: suggestVoucher (AdminContext)
 */
import { api_Url, UseApiUrl } from "@/services/api";

const User = {
  SuccessPayAddOrder: "/api/Client/AddDonHang",
  UpdateTier: "/api/Client/UpdateTier",
  XoaGioHang: "/api/Client/XoaGioHang",
  LayDiaChi: "/api/Client/LayDiaChi",
  LuuDiaChi: "/api/Client/LuuDiaChi",
  XoaDiaChi: "/api/Client/XoaDiaChi",
};

const Product = {
  UpdateQuantityProduct: "/api/Product/updateQuantityProduct",
};

const Shop = {
  SapXepDon: "/api/Shop/SapXepDonChoCuaHang",
};

const Coupon = {
  suggestVoucher: "/api/Coupon/SuggestVoucher",
};

export const checkoutApi = {
  User,
  Product,
  Shop,
  Coupon,
};

export { api_Url, UseApiUrl };
