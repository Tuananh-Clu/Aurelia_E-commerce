/**
 * DashBoard feature API – endpoints used by AdminContext, DashBoardShopContext, SeasonContext
 * (Admin / Shop / User dashboard components call through these Providers)
 */
import { api_Url, UseApiUrl } from "@/services/api";

const Banner = {
  Getbanner: "/api/Banner/GetBanner",
  AddMainBanner: "/api/Banner/AddMainBanner",
  AddStoryBanner: "/api/Banner/AddStoryBanner",
  AdjustMainBanner: "/api/Banner/AdjustMainBanner",
  AdjustStoryBanner: "/api/Banner/AdjustStoryBanner",
};

const Admin = {
  LoginAdmin: "/api/Authentication/LogInAdminSite",
  RevenueData: "/api/Admin/Revenue",
  UserDataAndDiscount: "/api/Admin/GetKhachHangAndDiscount",
  DoanhThuCuaHang: "/api/Admin/GetDoanhThuCuaHang",
  ResetSoldProduct: "/api/Admin/ResetSold",
  DanhSachSanPhamBanChay: "/api/Admin/LaySanPhamBanChay",
  GetDoanhThuCaNam: "/api/Admin/DoanhThuCaNam",
  GetShopInfo: "/api/Admin/InformationShop",
};

const Coupon = {
  getCoupons: "/api/Coupon/LaytatCaVoucher",
  addCoupon: "/api/Coupon/AddVoucher",
  updateCoupon: "/api/Coupon/AdjustVoucher",
  deleteCoupon: "/api/Coupon/DeleteVoucher",
  toggleCouponStatus: "/api/Coupon/UpdateStatusVoucher",
  suggestVoucher: "/api/Coupon/SuggestVoucher",
};

const Shop = {
  LayDashBoard: "/api/Shop/DataForDashBoard",
  LayDanhSachLichHenVaDonHang: "/api/Shop/LayDanhSachLichHenVaDonHang",
  UpdateTrangThaiDonHang: "/api/Shop/UpdateTrangThai",
  LaySanPhamCuaShop: "/api/Shop/LaySanPham",
  ThemSanPham: "/api/Shop/UploadSanPham",
  SuaSanPham: "/api/Shop/SuaSanPham",
  GetAllCustomer: "/api/Shop/GetAllCustomer",
};

const Collection = {
  getallcollections: "/api/SeasonCollection/GetCollection",
  GetStat: "/api/SeasonCollection/GetStatCollection",
  AddCollection: "/api/SeasonCollection/AddCollection",
  UpdateCollection: "/api/SeasonCollection/UpdateCollection",
  DeleteCollection: "/api/SeasonCollection/DeleteCollection",
  getCollectionsById: "/api/SeasonCollection/GetProductWithId",
};

export const dashBoardApi = {
  Banner,
  Admin,
  Coupon,
  Shop,
  Collection,
};

export { api_Url, UseApiUrl };
