

export const api_Config = {
  authentication: {
    login: "/api/Authentication/LogIn",
    ShopLogin: "/api/Authentication/LogInShop",
    signUp: "/api/Authentication/Register",
  },
  Product: {
    GetProduct: "/api/Product/GetProduct",
    SearchProduct: "/api/Product/GetProductBySearch",
    PostProduct: "/api/Product/PostProduct",
    UpdateQuantityProduct: "/api/Product/updateQuantityProduct",
    DeleteProduct:"/api/Product/DeleteProuct"
  },
  User: {
    LayTHongTinUser: "/api/Client/LayThongTinNguoiDung",
    AddFavouriteItems: "/api/Client/AddItems",
    GetItemsFavourite: "/api/Client/GetItemFavourite",
    SuccessPayAddOrder: "/api/Client/AddDonHang",
    SoLuongDonVaTongThuChi: "/api/Client/GetSoLuongDonHang",
    LayDonHang: "/api/Client/LayDonHang",
    DonHangGanDay: "/api/Client/LayDonHangGanDay",
    UpdataMeasure: "/api/Client/UpMeasure",
    LaySoDo: "/api/Client/GetSoDo",
    AddCuocHenVaoUSer: "/api/Client/AddCuocHenUser",
    LayCuocHenTheoUser: "/api/Client/LayCuocHenUser",
    LuuDiaChi: "/api/Client/LuuDiaChi",
    LayDiaChi: "/api/Client/LayDiaChi",
    XoaDiaChi: "/api/Client/XoaDiaChi",
    updateprofile: "/api/Client/UpdateProfile",
    UpdateTier: "/api/Client/UpdateTier",
    HuyDon: "/api/Client/HuyDonHang",
  },
  Shop: {
    GetDataShop: "/api/Shop/GetShopDataAcoountByID",
    GetShop: "/api/Shop/GetShop",
    GetShopById: "/api/Shop/GetSHopById",
    GetAppointment: "/api/Shop/AddAppointment",
    LaySlotDeLoc: "/api/Shop/LayTatCaSlotTheoNgay",
    SapXepDon: "/api/Shop/SapXepDonChoCuaHang",
    LayDonHangTheoID: "/api/Shop/LayDonHangTheoId",
    LayDashBoard: "/api/Shop/DataForDashBoard",
    LayDanhSachLichHenVaDonHang: "/api/Shop/LayDanhSachLichHenVaDonHang",
    UpdateTrangThaiDonHang: "/api/Shop/UpdateTrangThai",
    LaySanPhamCuaShop: "/api/Shop/LaySanPham",
    ThemSanPham: "/api/Shop/UploadSanPham",
    SuaSanPham: "/api/Shop/SuaSanPham",
    addNotifycation: "/api/Shop/PostMessage",
    GetNotifycation: "/api/Shop/GetNoti",
    CheckNotifycation: "/api/Shop/CheckNotifycation",
    GetAllCustomer: "/api/Shop/GetAllCustomer",
  },

  AIAdvice: {
    GetAdviceMeasure: "/api/GetAIAdvice/GetAdviceSize",
  },
  Admin: {
    LoginAdmin: "/api/Authentication/LogInAdminSite",
    RevenueData: "/api/Admin/Revenue",
    UserDataAndDiscount: "/api/Admin/GetKhachHangAndDiscount",
    DoanhThuCuaHang: "/api/Admin/GetDoanhThuCuaHang",
    ResetSoldProduct: "/api/Admin/ResetSold",
    DanhSachSanPhamBanChay: "/api/Admin/LaySanPhamBanChay",
    GetDoanhThuCaNam: "/api/Admin/DoanhThuCaNam",

    GetShopInfo: "/api/Admin/InformationShop",
  },
  Banner: {
    Getbanner: "/api/Banner/GetBanner",
    AddMainBanner: "/api/Banner/AddMainBanner",
    AddStoryBanner: "/api/Banner/AddStoryBanner",
    AdjustMainBanner: "/api/Banner/AdjustMainBanner",
    AdjustStoryBanner: "/api/Banner/AdjustStoryBanner",
  },
  Coupon: {
    getCoupons: "/api/Coupon/LaytatCaVoucher",
    addCoupon: "/api/Coupon/AddVoucher",
    updateCoupon: "/api/Coupon/AdjustVoucher",
    deleteCoupon: "/api/Coupon/DeleteVoucher",
    toggleCouponStatus: "/api/Coupon/UpdateStatusVoucher",
    suggestVoucher: "/api/Coupon/SuggestVoucher",
  },
  Collection:{
    getallcollections: "/api/SeasonCollection/GetCollection",
    getCollectionsById: "/api/SeasonCollection/GetProductWithId",
    GetStat: "/api/SeasonCollection/GetStatCollection",
    AddCollection: "/api/SeasonCollection/AddCollection",
    UpdateCollection: "/api/SeasonCollection/UpdateCollection",
    DeleteCollection: "/api/SeasonCollection/DeleteCollection",
  }
};
const api_Url = "https://localhost:7143";

export const UseApiUrl = (item: string) => {
  return api_Url + item;
};
