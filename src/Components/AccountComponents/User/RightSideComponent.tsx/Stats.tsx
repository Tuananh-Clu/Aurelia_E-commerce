import { motion } from "framer-motion";
import { Clock, Heart,
  ShieldCheck, ShoppingBag } from "lucide-react";

export const Stats = ({tongThuChi,soLuongDonHang,lastPurchaseDate,userRole,dataFavouriteItemUser}:any) => {

  const stats = [
    {
      title: "Tổng Chi Tiêu",
      value: `${tongThuChi.toLocaleString("vi-VN")}₫`,
      subtitle: `${soLuongDonHang} đơn`,
      icon: ShoppingBag,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Mua Gần Nhất",
      value: lastPurchaseDate.toLocaleDateString(),
      subtitle: "Lần mua gần đây",
      icon: Clock,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Trạng Thái",
      value: "Hoạt động",
      subtitle: `Thành viên ${userRole ?? ""}`,
      icon: ShieldCheck,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Sản Phẩm Yêu Thích",
      value: `${dataFavouriteItemUser.length}`,
      subtitle: "Đã lưu",
      icon: Heart,
      color: "from-rose-500 to-pink-500",
    },
  ];
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-5 rounded-2xl bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md border border-gray-100 flex flex-col items-center text-center transition-all"
            >
              <div
                className={`p-3 rounded-full bg-gradient-to-br ${s.color} text-white shadow-md mb-3`}
              >
                <Icon size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">{s.value}</h2>
              <p className="text-sm text-gray-500">{s.title}</p>
              <span className="text-xs text-gray-400">{s.subtitle}</span>
            </motion.div>
          );
        })}
      </div>
  )
}
