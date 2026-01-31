/**
 * MockPayment feature API – same as Cart/CheckOut (payment flow via CartContext)
 * - SuccessPayAddOrder, UpdateTier, XoaGioHang, UpdateQuantityProduct
 */
import { api_Url, UseApiUrl } from "@/services/api";

const User = {
  SuccessPayAddOrder: "/api/Client/AddDonHang",
  UpdateTier: "/api/Client/UpdateTier",
  XoaGioHang: "/api/Client/XoaGioHang",
};

const Product = {
  UpdateQuantityProduct: "/api/Product/updateQuantityProduct",
};

export const mockPaymentApi = {
  User,
  Product,
};

export { api_Url, UseApiUrl };
