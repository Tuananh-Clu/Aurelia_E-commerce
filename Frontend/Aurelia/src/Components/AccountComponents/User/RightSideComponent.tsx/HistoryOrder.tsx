import { ListOrdered, Scissors } from "lucide-react";
import { motion } from "framer-motion";


export const HistoryOrder = ({dataAppointment}:{dataAppointment:any}) => {
  return (
     <div className="space-y-4">
        <h1 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <ListOrdered size={18} className="text-indigo-500" />
          Lịch Sử Đặt Hẹn
        </h1>

        <div className="grid md:grid-cols-2 gap-5">
          {Array.isArray(dataAppointment) &&
            dataAppointment.map((item, idx) => {
              const statusColor =
                item.status === "Confirmed"
                  ? "bg-green-100 text-green-600"
                  : item.status === "Pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : item.status === "Cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600";

              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl bg-white/80 backdrop-blur-md shadow-sm hover:shadow-lg border border-gray-100 p-5 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Scissors size={18} className="text-indigo-500" />
                      {item.shopName}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Dịch vụ:</span> {item.service}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Ngày:</span> {item.date}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {item.status}
                    </span>
                    <button className="px-3 py-1.5 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition text-sm">
                      Xem thêm
                    </button>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
  )
}
