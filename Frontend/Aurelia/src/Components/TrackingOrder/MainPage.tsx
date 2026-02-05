import { useEffect, useState } from "react";
import { Navbar } from "../HomeLayoutComponent/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { api_Config, UseApiUrl } from "../../services/api";
import type { order } from "../../types/type";

export const MainPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<order>();

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
      
    </>
  );
};
