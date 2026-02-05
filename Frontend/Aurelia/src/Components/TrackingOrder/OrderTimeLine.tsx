import React, { useMemo } from "react";
import type { order } from "../../types/type";
import { Calendar, CheckCircle, Home, Package2Icon, Truck } from "lucide-react";

interface OrderTimelineProps {
  data: order | undefined;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ data }) => {
  const status = data?.status;
  const dataLable = [
    {
      status: "Chờ Xác Nhận",
      date: data?.ngayTaoDon,
      icon: <Calendar className="w-7" />,
    },
    {
      status: "Xác Nhận",
      date: data?.tracking?.updateTime,
      icon: <CheckCircle className="w-7" />,
    },
    {
      status: "Đóng Gói",
      date: data?.tracking?.updateTime,
      icon: <Package2Icon className="w-7" />,
    },
    {
      status: "Đang giao",
      date: data?.tracking?.updateTime,
      icon: <Truck className="w-7" />,
    },
    {
      status: "Đã Giao",
      date: data?.tracking?.updateTime,
      icon: <Home className="w-7" />,
    },
  ];
  const statusIndex = useMemo(() => {
    const table: Record<string, number> = {
      "Chờ Xác Nhận": 0,
      "Xác Nhận": 1,
      "Đóng Gói": 2,
      "Đang giao": 3,
      "Đã Giao": 4,
    };
    return table[status ?? ""] ?? 0;
  }, [status]);

  const progressPercentage = (statusIndex / (dataLable.length - 1)) * 100;

  return (
    <div className="mb-16 mx-a w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="min-w-[600px] flex items-center justify-between relative px-10">
        <div className="absolute top-1/2 left-0 w-full h-[5px] bg-[#dbdfe6]  -z-10 -translate-y-1/2"></div>

        <div
          className="absolute top-1/2 left-0 h-[2px] bg-red-600 -z-10 -translate-y-1/2 transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>

        {dataLable.map((step,index) => {

          return (
            <div
              key={step.status}
              className="flex flex-col items-center gap-3 bg-background-light dark:bg-background-dark px-2"
            >
              <div
                className={`
                                size-8 rounded-full flex items-center justify-center shadow-sm ring-4 ring-background-light dark:ring-background-dark
                              ${index === statusIndex
                    ? "bg-green-700 text-white size-12 shadow-lg"
                    : index < statusIndex
                    ? "bg-primary text-white size-8 shadow-sm"
                    : "bg-[#dbdfe6] dark:bg-gray-700 text-white"}
                            `}
                >
                {step.icon}
              </div>
              <div className="text-center">
                <p
                  className={`text-sm font-bold ${index === statusIndex ? "text-shadow-amber-400" : index < statusIndex ? "text-[#111318] dark:text-white" : "text-[#616f89] dark:text-gray-500"}`}
                >
                  {step.status}
                </p>
                <p
                  className={`text-xs ${index === statusIndex ? "text-[#616f89] dark:text-gray-400" : index < statusIndex ? "text-[#616f89] dark:text-gray-400" : "text-[#616f89] dark:text-gray-500"}`}
                >
                  {new Date(step.date ?? "").toLocaleString().slice(0, 16)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
