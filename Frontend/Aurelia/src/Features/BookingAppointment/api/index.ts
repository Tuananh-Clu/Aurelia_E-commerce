/**
 * BookingAppointment feature API – endpoints used by StoreContext, AppointmentContext
 * (components call through these Providers)
 */
import { api_Url, UseApiUrl } from "@/services/api";

const Shop = {
  GetShop: "/api/Shop/GetShop",
  GetShopById: "/api/Shop/GetSHopById",
  GetAppointment: "/api/Shop/AddAppointment",
  LaySlotDeLoc: "/api/Shop/LayTatCaSlotTheoNgay",
};

const User = {
  AddCuocHenVaoUSer: "/api/Client/AddCuocHenUser",
  LayCuocHenTheoUser: "/api/Client/LayCuocHenUser",
};

export const bookingApi = {
  Shop,
  User,
};

export { api_Url, UseApiUrl };
