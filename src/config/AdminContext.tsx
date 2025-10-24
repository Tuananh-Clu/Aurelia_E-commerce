import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api_Config, UseApiUrl } from "../types/api";
import axios from "axios";
import toast from "react-hot-toast";

type AdminContextType = {
  dataRevenue: any;
  dataUser: any;
  doanhThuCuaHang: any[];
  bestSellingProducts: any[];
  MainBanner: any[];
  StoryBanner: any[];
  dataShop: any[];
  coupons: any[];
  handleClick: (type: string, data: any) => void;
  uptodatabase: (type: string, data: any) => void;
  handleDeleteCoupon: (couponId: string) => void;
  handleAddCoupon: (couponData: any) => void;
  handleUpdateCoupon: (couponData: any) => void;
  handleToggleCouponStatus: (couponId: string, bool: boolean) => void;
};
export const AdminContext = createContext({
  dataRevenue: null,
  dataUser: null,
  doanhThuCuaHang: [],
  bestSellingProducts: [],
  MainBanner: [],
  StoryBanner: [],
  dataShop: [],
  coupons: [],
  handleClick: () => {},
  uptodatabase: () => {},
  handleDeleteCoupon: () => {},
  handleAddCoupon: () => {},
  handleUpdateCoupon: () => {},
  handleToggleCouponStatus: () => {},
} as AdminContextType);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  {
    //-- DashBoard Data ---
    const location = useLocation();
    const [dataRevenue, setDataRevenue] = useState<any>(null);
    const [dataUser, setDataUser] = useState<any>(null);
    const [doanhThuCuaHang, setDoanhThuCuaHang] = useState<any[]>([]);
    const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
    const [MainBanner, setMainBanner] = useState<any[]>([]);
    const [StoryBanner, setStoryBanner] = useState<any[]>([]);
    const [dataShop, setDataShop] = useState<any[]>([]);
    const handleClick = async (type: string, data: any) => {
      try {
        if (type === "Main") {
          const response = await axios.post(
            UseApiUrl(api_Config.Banner.AdjustMainBanner),
            data,
            { headers: { "Content-Type": "application/json" } }
          );
          toast.success(response.data);
        } else {
          const response = await axios.post(
            UseApiUrl(api_Config.Banner.AdjustStoryBanner),
            data,
            { headers: { "Content-Type": "application/json" } }
          );
          toast.success(response.data);
        }
      } catch (error) {
        console.error("❌ Error updating banner:", error);
      }
    };
    const uptodatabase = async (type: string, data: any) => {
      try {
        if (type === "Main" || type.includes("Main")) {
          const response = await axios.post(
            UseApiUrl(api_Config.Banner.AddMainBanner),
            data,
            { headers: { "Content-Type": "application/json" } }
          );
          toast.success(response.data);
        } else {
          const response = await axios.post(
            UseApiUrl(api_Config.Banner.AddStoryBanner),
            data,
            { headers: { "Content-Type": "application/json" } }
          );
          toast.success(response.data);
        }
      } catch (error) {
        console.error("❌ Error updating banner:", error);
      }
    };
    const fetchDataRevenue = async () => {
      try {
        const [
          bannerRes,
          revenueRes,
          userRes,
          shopRes,
          bestSellingRes,
          dataShopRes,
        ] = await Promise.all([
          axios.get(UseApiUrl(api_Config.Banner.Getbanner)),
          axios.get(UseApiUrl(api_Config.Admin.RevenueData)),
          axios.get(UseApiUrl(api_Config.Admin.UserDataAndDiscount)),
          axios.get(UseApiUrl(api_Config.Admin.DoanhThuCuaHang)),
          axios.get(UseApiUrl(api_Config.Admin.DanhSachSanPhamBanChay)),
          axios.get(UseApiUrl(api_Config.Admin.GetShopInfo)),
        ]);

        setMainBanner(bannerRes.data.mainBanner || []);
        setStoryBanner(bannerRes.data.storyBanner || []);
        setDataRevenue(revenueRes.data);
        setDataUser(userRes.data);
        setDoanhThuCuaHang(shopRes.data.dataShop || []);
        setBestSellingProducts(bestSellingRes.data.listSold || []);
        setDataShop(dataShopRes.data || []);
        console.log(dataShopRes.data);
        console.log(bannerRes.data);
        console.log("✅ Banner data:", bannerRes.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    useEffect(() => {
      fetchDataRevenue();
    }, [location]);
    useEffect(() => {
      const Current = new Date().getMonth() + 1;
      const currentDate = new Date().getDate();
      const nextMonth = new Date().getMonth() + 2;
      if (Current < nextMonth && currentDate === 1) {
        axios.get(UseApiUrl(api_Config.Admin.ResetSoldProduct));
      }
    });
    {
      //-- End DashBoard Data ---  }
      {
        //Coupon Management Data ---

        const [coupons, setCoupons] = useState([]);
        const fetchCoupons = async () => {
          try {
            const response = await axios.get(
              UseApiUrl(api_Config.Coupon.getCoupons)
            );
            setCoupons(response.data);
            toast.success(response.data.message);
          } catch (error) {
            console.error("❌ Error fetching coupons:", error);
          }
        };

        useEffect(() => {
          fetchCoupons();
        }, []);
        const handleAddCoupon = async (couponData: any) => {
          try {
            const response = await axios.post(
              UseApiUrl(api_Config.Coupon.addCoupon),
              couponData,
              { headers: { "Content-Type": "application/json" } }
            );
            toast.success(response.data.message);
            fetchCoupons();
          } catch (error) {
            console.error("❌ Error adding coupon:", error);
            toast.error("Failed to add coupon");
          }
        };
        const handleUpdateCoupon = async (couponData: any) => {
          try {
            const response = await axios.post(
              UseApiUrl(api_Config.Coupon.updateCoupon),
              couponData,
              { headers: { "Content-Type": "application/json" } }
            );
            toast.success(response.data.message);
            fetchCoupons();
          } catch (error) {
            console.error("❌ Error updating coupon:", error);
            toast.error("Failed to update coupon");
          }
        };
        const handleDeleteCoupon = async (voucherId: string) => {
          try {
            const response = await axios.delete(
             `${ UseApiUrl(api_Config.Coupon.deleteCoupon)}?voucherId=${voucherId}`
            );
            toast.success(response.data.message);
            fetchCoupons();
          } catch (error) {
            console.error("❌ Error deleting coupon:", error);
            toast.error("Failed to delete coupon");
          }
        };
        const handleToggleCouponStatus = async (
          id: string,
          bool: boolean
        ) => {
          try {
            const response = await axios.post(
              UseApiUrl(api_Config.Coupon.toggleCouponStatus),
              { id, bool },
              { headers: { "Content-Type": "application/json" } }
            );
          toast.success(response.data.message);
            fetchCoupons();
          } catch (error) {
            console.error("❌ Error toggling coupon status:", error);
            toast.error("Failed to toggle coupon status");
          }
        };

        return (
          <AdminContext.Provider
            value={{
              dataRevenue,
              dataUser,
              doanhThuCuaHang,
              bestSellingProducts,
              MainBanner,
              StoryBanner,
              coupons,
              handleClick,
              dataShop,
              uptodatabase,
              handleDeleteCoupon,
              handleAddCoupon,
              handleUpdateCoupon,
              handleToggleCouponStatus,
            }}
          >
            {children}
          </AdminContext.Provider>
        );
      }
    }
  }
};
