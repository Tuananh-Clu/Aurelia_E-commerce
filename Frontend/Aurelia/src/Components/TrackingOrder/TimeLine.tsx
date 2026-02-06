import { useMemo } from "react";
import type { order } from "../../types/type";
import { Calendar, CheckCircle, Home, Package2Icon, Truck } from "lucide-react";

const Timeline= ({ data }: { data: order | undefined }) => {
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

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pr-2 mt-8">
      <div className="relative pl-2">
        <div className="absolute left-[7px] top-2 bottom-4 w-[1px] bg-aurelia-silver"></div>

        {dataLable.map((step,index) => {

          return (
            <div
              
              className={`relative flex gap-6 pb-10 ${statusIndex < index ? 'opacity-40' : ''}`}
            >
              <div className="z-10 flex flex-col items-center">
                {statusIndex > index ? (
                  <div className="size-4 rounded-full bg-gray-900 border border-aurelia-charcoal mt-1 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[10px]">check</span>
                  </div>
                ) : statusIndex === index ? (
                  <div className="size-4 rounded-full border-2 border-primary bg-gray-900 mt-1 shadow-[0_0_0_4px_rgba(19,91,236,0.1)]"></div>
                ) : (
                  <div className="size-4 rounded-full border border-aurelia-charcoal bg-white mt-1"></div>
                )}
              </div>

              <div className="flex flex-col">
                <p className={`text-sm font-medium leading-none mb-1 ${statusIndex === index ? 'text-primary font-bold' : 'text-aurelia-charcoal'}`}>
                  {step.status}
                </p>
                {(data?.address || step.date) && (
                  <p className="text-aurelia-gray text-xs">
                    {data?.address} {data?.address && step.date ? '•' : ''} {step.date}
                  </p>
                )}
                {data?.address && index!==statusIndex && (
                    <p className="text-aurelia-gray text-xs mt-1">{step.status}</p>
                )}
                {data?.address && index===statusIndex && (
                  <p className="text-aurelia-gray text-xs mt-2 leading-relaxed max-w-[280px]">
                    {step.status}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
