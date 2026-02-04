import { Clock, Heart, ShieldCheck, ShoppingBag } from "lucide-react";

export const Stats = ({
  tongThuChi,
  soLuongDonHang,
  lastPurchaseDate,
  userRole,
  dataFavouriteItemUser,
}: any) => {
  const stats = [
    {
      title: "Tổng Chi Tiêu",
      value: `${tongThuChi}₫`,
      subtitle: `${soLuongDonHang} đơn`,
      icon: ShoppingBag,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Mua Gần Nhất",
      value: lastPurchaseDate
        ? "Chưa có đơn"
        : new Date(lastPurchaseDate).toLocaleDateString("vi-VN"),
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
      value: `${dataFavouriteItemUser?.length}`,
      subtitle: "Đã lưu",
      icon: Heart,
      color: "from-rose-500 to-pink-500",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-8 max-w-md">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className="
          bg-white
          border border-neutral-200
          p-6
          flex flex-col
          justify-between
          min-h-[150px]
          transition-all
          hover:border-neutral-300
        "
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-widest uppercase text-neutral-500">
                {s.title}
              </span>
              <Icon className="text-neutral-400" size={18} />
            </div>
            <div>
              <p className="text-3xl font-light text-neutral-900 mt-4">
                {s.value.length > 7 ? "—" : s.value}
              </p>
              <p className="text-xs text-neutral-400 mt-1">{s.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
