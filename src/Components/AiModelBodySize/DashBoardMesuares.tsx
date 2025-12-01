import React from "react";
import {
  Heart,
  Move,
  Circle,
  Square,
  ArrowUpDown,
  RefreshCcw,
  Camera,
  CameraOff,
} from "lucide-react";
import type { Measure } from "../../types/type";

type Measures = {
  label: string;
  value: string | undefined;
  icon: React.ReactNode;
  unit: string;
};

type MeasuresProps = {
  iscameraOn: boolean;
  setDatas: React.Dispatch<React.SetStateAction<boolean>>;
  datas: Measure | undefined;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DashBoardMeasures: React.FC<MeasuresProps> = ({
  setIsCameraOn,
  iscameraOn,
  datas,
  setDatas,
}) => {
  const measures: Measures[] = [
    {
      label: "Vai",
      value: datas?.vai,
      icon: <Move className="w-4 h-4 text-blue-600" />,
      unit: "cm",
    },
    {
      label: "Ngực",
      value: datas?.nguc,
      icon: <Heart className="w-4 h-4 text-pink-600" />,
      unit: "cm",
    },
    {
      label: "Eo",
      value: datas?.eo,
      icon: <Circle className="w-4 h-4 text-green-600" />,
      unit: "cm",
    },
    {
      label: "Hông",
      value: datas?.hong,
      icon: <Square className="w-4 h-4 text-purple-600" />,
      unit: "cm",
    },
    {
      label: "Chiều cao",
      value: datas?.chieuCao,
      icon: <ArrowUpDown className="w-4 h-4 text-orange-600" />,
      unit: "cm",
    },
  ];

  const handleMeasure = () => {
    setIsCameraOn(!iscameraOn);
  };

  const hasData = measures.some((m) => m.value);

  return (
    <div className="bg-gradient-to-br p-6 max-h-[700px] from-gray-50 to-gray-100  flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl px-6 py-2 w-full max-w-md border border-gray-200">
        <div className="text-center mb-1">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            {iscameraOn ? (
              <Camera className="w-8 h-8 text-white" />
            ) : (
              <CameraOff className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Bảng Thông Số Cơ Thể
          </h2>
          <h2 className="text-sm font-bold text-gray-800">
            Vui Lòng Đứng Trước Khung Hình
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {hasData ? "Kết quả đo mới nhất" : "Chưa có dữ liệu đo"}
          </p>
        </div>

        <div className="flex items-center justify-center ">
          <div
            className={`flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium ${
              iscameraOn
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                iscameraOn ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            {iscameraOn ? "Camera đang bật" : "Camera đang tắt"}
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 ">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Vị trí
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  Số đo
                </th>
              </tr>
            </thead>
            <tbody>
              {measures.map((m, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors duration-200 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50" 
                  } hover:bg-blue-50`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-50">{m.icon}</div>
                      <span className="font-medium text-gray-700">
                        {m.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-bold text-lg text-red-900">
                      {m.value ? `${m.value} ${m.unit}` : "--"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleMeasure}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              iscameraOn
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {iscameraOn ? (
              <>
                <CameraOff className="w-5 h-5" />
                Tắt Camera
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Bắt Đầu Đo
              </>
            )}
          </button>

          {hasData && (
            <button
              onClick={() => {
                setDatas(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300"
            >
              <RefreshCcw className="w-5 h-5" />
              Lưu
            </button>
          )}
        </div>
        {hasData && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              💡 Kết quả có thể sai lệch ±3-5cm so với đo thực tế
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
