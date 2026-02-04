import { ListOrdered, Scissors, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_MAP: Record<string, string> = {
  Confirmed: "text-green-600 bg-green-50 border-green-200",
  Pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  Cancelled: "text-red-600 bg-red-50 border-red-200",
};

export const HistoryOrder = ({
  dataAppointment,
}: {
  dataAppointment: any[];
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ListOrdered size={18} className="text-gray-700" />
        <h1 className="text-lg font-semibold text-gray-900">
          Lịch sử đặt hẹn
        </h1>
      </div>

      {/* List */}
      <div className="space-y-4">
        {Array.isArray(dataAppointment) &&
          dataAppointment.map((item, idx) => {
            const statusStyle =
              STATUS_MAP[item.status] ||
              "text-gray-600 bg-gray-50 border-gray-200";

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                className="
                  bg-white
                  border border-gray-200
                  p-5
                  transition
                  hover:shadow-md
                "
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Info */}
                  <div className="space-y-2">
                    <h2 className="font-medium text-gray-900 flex items-center gap-2">
                      <Scissors size={16} className="text-gray-600" />
                      {item.shopName}
                    </h2>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="text-gray-500">Dịch vụ:</span>{" "}
                        {item.service}
                      </p>
                      <p>
                        <span className="text-gray-500">Ngày hẹn:</span>{" "}
                        {item.date}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`
                        text-xs font-medium px-3 py-1
                        border
                        ${statusStyle}
                      `}
                    >
                      {item.status}
                    </span>

                    <button
                      className="
                        flex items-center gap-1
                        text-sm
                        text-gray-700
                        hover:text-black
                        transition
                      "
                    >
                      Chi tiết
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

        {/* Empty state */}
        {(!dataAppointment || dataAppointment.length === 0) && (
          <div className="border border-dashed border-gray-300 p-8 text-center text-gray-500">
            Bạn chưa có lịch đặt hẹn nào.
          </div>
        )}
      </div>
    </div>
  );
};
