/**
 * Home feature API – endpoints used by SeasonContext, AdminContext, FIlterProduct
 * (components call through these Providers)
 */
import { api_Url, UseApiUrl } from "@/services/api";

const Collection = {
  getallcollections: "/api/SeasonCollection/GetCollection",
  getCollectionsById: "/api/SeasonCollection/GetProductWithId",
  GetStat: "/api/SeasonCollection/GetStatCollection",
};

const Banner = {
  Getbanner: "/api/Banner/GetBanner",
};

const Product = {
  GetProduct: "/api/Product/GetProduct",
};

export const homeApi = {
  Collection,
  Banner,
  Product,
};

export { api_Url, UseApiUrl };
