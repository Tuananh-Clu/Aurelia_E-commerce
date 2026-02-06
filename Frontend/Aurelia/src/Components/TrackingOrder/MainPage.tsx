import { useEffect, useState } from "react";
import { Navbar } from "../HomeLayoutComponent/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { api_Config, UseApiUrl } from "../../services/api";
import type { order } from "../../types/type";
import RightSiteMap from "./RightSiteMap";
import Sidebar from "./SideBar";

export const MainPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<order>();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${UseApiUrl(api_Config.Shop.LayDonHangTheoID)}?id=${id}`,
      );
      setData(res.data);
    };
    fetch();
  }, [id]);

  return (
    <>
      <Navbar />
      <main className=" flex relative mt-16">
        <div className="w-2/3">
        <RightSiteMap data={data} id={id} />
        </div>
        <div className="w-1/3">
        <Sidebar data={data} />
        </div>

      </main>
      <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-aurelia-charcoal text-white rounded-full px-6 py-3 text-[10px] uppercase tracking-widest font-bold shadow-xl">
        Order Details
      </div>
    </>
  );
};
