import { Ruler, ArrowLeftRight, Heart, ScanLine } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


export const MeasureDashBoard = ({ DataMeasure }: { DataMeasure: any }) => {
  const bodyMeasurements = [
    {
      name: "Vai",
      value: DataMeasure?.vai,
      unit: "cm",
      icon: ArrowLeftRight,
    },
    {
      name: "Ngực",
      value: DataMeasure?.nguc,
      unit: "cm",
      icon: Heart,
    },
    {
      name: "Eo",
      value: DataMeasure?.eo,
      unit: "cm",
      icon: ScanLine,
    },
    {
      name: "Hông",
      value: DataMeasure?.hong,
      unit: "cm",
      icon: Ruler,
    },
  ];
  const navigate=useNavigate();
  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 shadow-sm p-6">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
            Số đo cơ thể
          </h2>
          <p className="text-sm text-gray-500">
            Thông tin phục vụ cá nhân hoá sản phẩm
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-5">
        {bodyMeasurements.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ y: -2 }}
              className="
                bg-white
                border border-gray-200
                shadow-sm
                hover:shadow-md
                transition-all
                p-5
                flex flex-col justify-between
              "
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">
                  {item.name}
                </p>
                <div className="w-9 h-9 flex items-center justify-center border border-gray-300 text-gray-500">
                  <Icon size={18} />
                </div>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-semibold text-gray-800">
                  {item.value ?? "--"}
                </span>
                <span className="text-sm text-gray-500 mb-1">
                  {item.unit}
                </span>
              </div>
            </motion.div>
          );
        })}
        <button
          onClick={() => navigate("/bodyMeasurements")}
          className="col-span-2 mt-2 py-3 px-4 w-full bg-gray-400 text-white text-center font-medium hover:bg-blue-700 transition-all"
        >
          Thêm số đo
        </button>
      </div>
    </div>
  );
};
