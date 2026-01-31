/**
 * FormAuth feature API – endpoints used by Author, AuthorForShop, AuthorForAdmin
 * (components call through these Providers)
 */
import { api_Url, UseApiUrl } from "@/services/api";

const authentication = {
  login: "/api/Authentication/LogIn",
  ShopLogin: "/api/Authentication/LogInShop",
  signUp: "/api/Authentication/Register",
  getInfoUser: "/api/Authentication/GetData",
  Logout: "/api/Authentication/LogOut",
  LogInWithFireBase: "/api/Authentication/LogInWithFireBase",
};

const Admin = {
  LoginAdmin: "/api/Authentication/LogInAdminSite",
};

const User = {
  AutoAddGioHang: "/api/Client/AutoAddGioHangKhiLog",
  updateprofile: "/api/Client/UpdateProfile",
};

const Password = {
  ResetPassWord: "/api/Email/ResetPassWord",
  ChangePassWord: "/api/Email/ChangePassWord",
};

export const formAuthApi = {
  authentication,
  Admin,
  User,
  Password,
};

export { api_Url, UseApiUrl };
