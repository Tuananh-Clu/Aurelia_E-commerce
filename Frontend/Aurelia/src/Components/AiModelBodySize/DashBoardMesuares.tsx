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

type MeasureItem = {
  label: string;
  value?: string;
  icon: React.ReactNode;
  unit: string;
};

type MeasuresProps = {
  iscameraOn: boolean;
  setDatas: React.Dispatch<React.SetStateAction<boolean>>;
  datas?: Measure;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DashBoardMeasures: React.FC<MeasuresProps> = ({
  iscameraOn,
  setIsCameraOn,
  datas,
  setDatas,
}) => {
  const measures: MeasureItem[] = [
    { label: "Vai", value: datas?.vai, icon: <Move className="w-5 h-5 text-blue-600" />, unit: "cm" },
    { label: "Ngực", value: datas?.nguc, icon: <Heart className="w-5 h-5 text-pink-600" />, unit: "cm" },
    { label: "Eo", value: datas?.eo, icon: <Circle className="w-5 h-5 text-green-600" />, unit: "cm" },
    { label: "Hông", value: datas?.hong, icon: <Square className="w-5 h-5 text-purple-600" />, unit: "cm" },
    { label: "Chiều cao", value: datas?.chieuCao, icon: <ArrowUpDown className="w-5 h-5 text-orange-600" />, unit: "cm" },
  ];

  const hasData = measures.some((m) => m.value);

  return (
    <div className="flex justify-center p-4">
      <div className="
        w-full max-w-lg
        bg-white/80 backdrop-blur-xl
        rounded-3xl
        border border-white/60
        shadow-2xl shadow-blue-100/40
        p-6 space-y-6
      ">
        <header className="flex flex-col items-center text-center">
          <div
            className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              shadow-lg
              ${iscameraOn
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : "bg-gradient-to-br from-gray-400 to-gray-600"}
            `}
          >
            {iscameraOn ? (
              <Camera className="w-8 h-8 text-white" />
            ) : (
              <CameraOff className="w-8 h-8 text-white" />
            )}
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Thông số cơ thể
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {iscameraOn
              ? "Giơ tay phải ngang vai để bắt đầu đo"
              : "Camera đang tắt"}
          </p>

          <span
            className={`
              mt-2 px-3 py-1 rounded-full text-xs font-medium
              ${hasData
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-500"}
            `}
          >
            {hasData ? "Kết quả đo gần nhất" : "Chưa có dữ liệu"}
          </span>
        </header>


        <section>
          <table className="hidden md:table w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-700">Vị trí</th>
                <th className="p-3 text-right font-semibold text-gray-700">Số đo</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((m, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {m.icon}
                    </div>
                    <span className="font-medium text-gray-700">
                      {m.label}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-lg font-bold text-gray-900">
                      {m.value ?? "--"}
                    </span>
                    {m.value && (
                      <span className="text-sm text-gray-500 ml-1">
                        {m.unit}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="md:hidden grid grid-cols-2 gap-4">
            {measures.map((m, i) => (
              <div
                key={i}
                className="
                  p-4 rounded-2xl
                  bg-gradient-to-br from-gray-50 to-white
                  border border-gray-200
                  shadow-sm
                  flex flex-col items-center
                "
              >
                <div className="p-3 rounded-xl bg-white shadow mb-2">
                  {m.icon}
                </div>

                <span className="text-sm text-gray-500">
                  {m.label}
                </span>

                <span className="mt-1 text-xl font-bold text-gray-900">
                  {m.value ?? "--"}
                  {m.value && (
                    <span className="text-sm font-medium text-gray-500 ml-1">
                      {m.unit}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-3">
          <button
            onClick={() => setIsCameraOn(!iscameraOn)}
            className={`
              flex-1 flex items-center justify-center gap-2
              py-3 rounded-full font-semibold text-white
              shadow-lg transition
              ${iscameraOn
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-indigo-700"}
            `}
          >
            {iscameraOn ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            {iscameraOn ? "Tắt camera" : "Bắt đầu đo"}
          </button>

          {hasData && (
            <button
              onClick={() => setDatas(true)}
              className="
                flex-1 flex items-center justify-center gap-2
                py-3 rounded-full font-semibold
                bg-gray-100 text-gray-700
                hover:bg-gray-200 transition
              "
            >
              <RefreshCcw className="w-5 h-5" />
              Lưu
            </button>
          )}
        </div>

        {/* Note */}
        {hasData && (
          <p className="
            text-xs text-gray-500 text-center
            pt-3 border-t border-dashed border-gray-200
          ">
            Sai lệch có thể ±3–5cm tùy ánh sáng và tư thế đứng
          </p>
        )}
      </div>
    </div>
  );
};
