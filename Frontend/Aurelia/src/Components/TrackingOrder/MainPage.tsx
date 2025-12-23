import { useEffect, useState } from "react";
import { Navbar } from "../HomeLayoutComponent/Navbar";
import LeftSite from "./LeftSite";
import { useParams } from "react-router-dom";
import axios from "axios";
import { api_Config, UseApiUrl } from "../../services/api";
import type { order } from "../../types/type";
import { MapPin, X } from "lucide-react";
import RightSiteMap from "./RightSiteMap";

export const MainPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<order>();
  const [showMapMobile, setShowMapMobile] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${UseApiUrl(api_Config.Shop.LayDonHangTheoID)}?id=${id}`
      );
      setData(res.data);
    };
    fetch();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="hidden lg:flex w-full gap-6 px-8 py-6">
        <div className="w-2/5 max-w-xl">
          <LeftSite data={data} />
        </div>
        <div className="w-3/5">
          <RightSiteMap id={id} data={data} />
        </div>
      </div>

      <div className="lg:hidden px-4 py-4 pb-24">
        <LeftSite data={data} />
      </div>

      {showMapMobile && (
        <div className="fixed inset-0 z-[9999] bg-black">
       <button
            onClick={() => setShowMapMobile(false)}
            className="absolute top-4 right-4 z-[10000] bg-white rounded-full p-2 shadow"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <RightSiteMap id={id} data={data} />
        </div>
      )}

      {!showMapMobile && (
        <button
          onClick={() => setShowMapMobile(true)}
          className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 
          bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg 
          flex items-center gap-2 z-[999]"
        >
          <MapPin className="w-5 h-5" />
          Xem bản đồ giao hàng
        </button>
      )}
    </>
  );
};
