import { useEffect, useState } from "react";
import { Navbar } from "../HomeLayoutComponent/Navbar";
import { RightSiteMap } from "./RightSiteMap";

import { useParams } from "react-router-dom";
import axios from "axios";
import { api_Config, UseApiUrl } from "../../services/api";
import type { order } from "../../types/type";
import LeftSite from "./LeftSite";

export const MainPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<order>();
  useEffect(() => {
    const fetch = async () => {
      const data = await axios.get(
        `${UseApiUrl(api_Config.Shop.LayDonHangTheoID)}?id=${id}`
      );
      setData(data.data);
    };
    fetch();
  }, [id]);
  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col lg:flex-row gap-4 justify-around px-4 lg:px-8 py-6">
        <div className="w-full lg:w-2/5 lg:max-w-xl">
          <LeftSite data={data} />
        </div>
        <div className="w-full lg:w-3/5 mt-6 lg:mt-20">
          <RightSiteMap data={data} />
        </div>
      </div>
    </>
  );
};
