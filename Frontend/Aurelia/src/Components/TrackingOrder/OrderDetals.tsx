import { ArrowRight, ReceiptText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { order } from "../../types/type";
import axios from "axios";
import { api_Config, UseApiUrl } from "../../services/api";
import { OrderSummaryGrid } from "./OrderSummary";
import { OrderItemsTable } from "./OrderItemsTable";
import { OrderTimeline } from "./OrderTimeLine";
import { Navbar } from "../HomeLayoutComponent/Navbar";
import { Footer } from "../HomeLayoutComponent/Footer";

export const OrderDetals = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>();
const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${UseApiUrl(api_Config.Shop.LayDonHangTheoID)}?id=${id}`,
      );
      console.log(res.data);
      setData(res.data);
    };
    fetch();
  }, [id]);
  return (
    <>
    <Navbar />
    <main className="mt-18 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-5" >
      <OrderHeader order={data?.data} />
      <OrderTimeline data={data?.data} />
      <OrderItemsTable  data={data?.data?.product} />
      <OrderSummaryGrid data={data?.data}
      />
      <FooterActions navigate={navigate} id={data?.data?.orderId ?? ""} />
    </main>
    <Footer/>
    </>
    
  );
};

const OrderHeader: React.FC<{ order: order|undefined }> = ({ order }) => {
  const orderId = order?.orderId ?? "";

  return (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#dbdfe6] dark:border-gray-700 pb-8">
    <div>
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#111318] tracking-tight">
          Order #{orderId.length > 8 ? orderId.slice(0, 8) : orderId}
        </h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          {order?.status}
        </span>
      </div>
      <p className="text-[#616f89] dark:text-gray-400 text-base">
        Placed on {order?.ngayTaoDon} • Estimated Delivery:{" "}
        {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
      </p>
    </div>
    <div className="flex gap-3">
      <button className="h-10 px-6 rounded border border-[#dbdfe6] dark:border-gray-600 text-[#111318]  font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
        <ReceiptText className="w-[18px] h-[18px]" />
        Invoice
      </button>
      <button className="h-10 px-6 rounded bg-[#f0f2f4] dark:bg-gray-800 text-[#111318] dark:text-white font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        Need Help?
      </button>
    </div>
  </div>
  );
};

const FooterActions: React.FC<{navigate: (id: string) => void, id: string}> = ({navigate, id}) => (
  
  <div className="flex justify-end gap-4 border-t border-[#dbdfe6] dark:border-gray-700 pt-8">
    <button onClick={() => navigate('/tracking/' + id)} className="h-12 px-8 rounded bg-white text-black font-bold shadow-lg shadow-blue-900/20 hover:bg-black  hover:text-white transition-colors flex items-center gap-2 group">
      Track Shipment
      <span className="transition-transform group-hover:translate-x-1">
        <ArrowRight className="w-[18px] h-[18px]" />
      </span>
    </button>
  </div>
);
