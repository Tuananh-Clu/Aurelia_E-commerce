/**
 * TrackingOrder feature API – endpoints used when components fetch order (Shop)
 * (Page/component calls Shop.LayDonHangTheoID)
 */
import { api_Url, UseApiUrl } from "@/services/api";

const Shop = {
  LayDonHangTheoID: "/api/Shop/LayDonHangTheoId",
};

export const trackingOrderApi = {
  Shop,
};

export { api_Url, UseApiUrl };
