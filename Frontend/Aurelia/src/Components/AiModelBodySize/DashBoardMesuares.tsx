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
    { label: "Vai", value: datas?.vai, icon: <Move className="w-4 h-4 text-blue-600" />, unit: "cm" },
    { label: "Ngực", value: datas?.nguc, icon: <Heart className="w-4 h-4 text-pink-600" />, unit: "cm" },
    { label: "Eo", value: datas?.eo, icon: <Circle className="w-4 h-4 text-green-600" />, unit: "cm" },
    { label: "Hông", value: datas?.hong, icon: <Square className="w-4 h-4 text-purple-600" />, unit: "cm" },
    { label: "Chiều cao", value: datas?.chieuCao, icon: <ArrowUpDown className="w-4 h-4 text-orange-600" />, unit: "cm" },
  ];

  const hasData = measures.some((m) => m.value);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 h-full flex items-start justify-center mt-4 ">
      <div className="bg-white shadow-xl rounded-2xl w-[400px] md:w-full md:max-w-lg  border border-gray-200 p-5 sm:p-6 space-y-4">

        {/* Camera icon */}
        <div className="md:flex md:flex-col items-center text-center hidden sm:block">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-3">
            {iscameraOn ? <Camera className="w-7 h-7" /> : <CameraOff className="w-7 h-7" />}
          </div>
          <h2 className="text-xl font-bold text-gray-800">Bảng Thông Số Cơ Thể</h2>
          <p className="text-xs text-gray-500 mt-1">Vui lòng đứng trước khung hình</p>
          <span className="text-sm text-gray-600">{hasData ? "Kết quả đo mới nhất" : "Chưa có dữ liệu đo"}</span>
        </div>

        {/* Camera status */}
        <div className="flex flex-col justify-center items-center mb-4">
          <h1 className="text-lg font-semibold mr-4 block md:hidden">Số đo</h1>
          <span
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              iscameraOn ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${iscameraOn ? "bg-green-500" : "bg-gray-400"}`} />
            {iscameraOn ? "Camera đang bật" : "Camera đang tắt"}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 overflow-hidden w-full">
          <table className="w-full text-sm hidden md:table">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left font-semibold text-gray-700">Vị trí</th>
                <th className="p-3 text-right font-semibold text-gray-700">Số đo</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((m, i) => (
                <tr
                  key={i}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3 flex items-center gap-3">
                    <div className="p-2 rounded-md bg-gray-100">{m.icon}</div>
                    <span className="text-gray-700 font-medium">{m.label}</span>
                  </td>
                  <td className="p-3 text-right font-bold text-gray-900">
                    {m.value ? `${m.value} ${m.unit}` : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {/* Mobile View */}
            <div className="md:hidden grid grid-cols-2 gap-4">
              {measures.map((m, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="p-2 rounded-md bg-gray-100 mb-2">{m.icon}</div>
                  <span className="text-gray-700 font-medium mb-1">{m.label}</span>
                  <span className="text-gray-900 font-bold">
                    {m.value ? `${m.value} ${m.unit}` : "--"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:gap-3 gap-2">
          <button
            onClick={() => setIsCameraOn(!iscameraOn)}
            className={` hidden md:flex-1 md:flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-white transition ${
              iscameraOn
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            }`}
          >
            {iscameraOn ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            {iscameraOn ? "Tắt Camera" : "Bắt đầu đo"}
          </button>

          {hasData && (
            <button
              onClick={() => setDatas(true)}
              className=" hiddenmd:flex-1 md:flex items-center justify-center gap-2 py-3 rounded-full font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <RefreshCcw className="w-5 h-5" />
              Lưu
            </button>
          )}
        </div>

        {/* Note */}
        {hasData && (
          <p className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
            💡 Sai lệch có thể ±3–5cm tùy môi trường đo
          </p>
        )}
      </div>
    </div>
  );
};
