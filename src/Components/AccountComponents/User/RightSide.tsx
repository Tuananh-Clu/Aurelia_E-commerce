import type { AppointmentCustomer, order, Product } from "../../../types/type";
import { useContext, useEffect, useState } from "react";
import { AppointmentContext } from "../../../contexts/AppointmentContext";
import { Stats } from "./RightSideComponent.tsx/Stats";
import { RecentOrder } from "./RightSideComponent.tsx/RecentOrder";
import { HistoryOrder } from "./RightSideComponent.tsx/HistoryOrder";
import { Favourite } from "./RightSideComponent.tsx/Favourite";
import { BarprocessTier } from "./RightSideComponent.tsx/BarprocessTier";
import { motion } from "framer-motion";
import { ArrowBigLeft, BoxIcon, HeartIcon, ListOrdered, Ticket } from "lucide-react";
import Voucher from "./RightSideComponent.tsx/Voucher";

type RightProps = {
  dataFavouriteItemUser: Product[];
  userRole?: string;
  tongThuChi: number;
  soLuongDonHang: number;
  donHangChiTiet: order[];
  donhangMoiNhat: number;
};

const DASHBOARD_CARDS = [
  {
    label: "Đơn hàng gần đây",
    icon: BoxIcon,
    bg: "bg-gradient-to-b from-[#fff5f5] to-white",
    color: "text-red-500",
    key: "recentOrder",
  },
  {
    label: "Sản phẩm yêu thích",
    icon: HeartIcon,
    bg: "bg-gradient-to-b from-[#ffeaf4] to-white",
    color: "text-pink-600",
    key: "favourite",
  },
  {
    label: "Lịch hẹn",
    icon: ListOrdered,
    bg: "bg-gradient-to-b from-[#f7f7f7] to-white",
    color: "text-gray-600",
    key: "listAppointment",
  },
  {
    label: "Voucher",
    icon: Ticket,
    bg: "bg-gradient-to-b from-[#fff7d6] to-white",
    color: "text-yellow-600",
    key: "voucher",
  },
];

export const RightSide: React.FC<RightProps> = ({
  dataFavouriteItemUser,
  userRole,
  tongThuChi,
  soLuongDonHang,
  donHangChiTiet,
  donhangMoiNhat,
}) => {
  const { LayDachSachLichHenCuaUser } = useContext(AppointmentContext);
  const [dataAppointment, setDataAppointment] = useState<AppointmentCustomer[] | null>(null);
  const [activeSite, setActiveSite] = useState<"stats" | "recentOrder" | "listAppointment" | "favourite" | "voucher">("stats");

  const lastPurchaseDate = new Date(Number(donhangMoiNhat));

  useEffect(() => {
    const load = async () => {
      try {
        const data = await LayDachSachLichHenCuaUser();
        setDataAppointment(Array.isArray(data) ? data : []);
      } catch {
        setDataAppointment(null);
      }
    };
    load();
  }, []);

  const renderContent = () => {
    switch (activeSite) {
      case "stats":
        return (
          <div className="space-y-10">
            <Stats
              tongThuChi={tongThuChi}
              soLuongDonHang={soLuongDonHang}
              lastPurchaseDate={lastPurchaseDate}
              dataFavouriteItemUser={dataFavouriteItemUser}
              userRole={userRole}
            />

            <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
              Bảng điều khiển
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {DASHBOARD_CARDS.map((card) => (
                <DashboardCard key={card.key} card={card} onClick={() => setActiveSite(card.key as any)} />
              ))}
            </div>

            <BarprocessTier />
          </div>
        );

      case "recentOrder":
        return (
          <MotionWrapper>
            <RecentOrder donHangChiTiet={donHangChiTiet} />
          </MotionWrapper>
        );

      case "listAppointment":
        return (
          <MotionWrapper>
            <HistoryOrder dataAppointment={dataAppointment} />
          </MotionWrapper>
        );

      case "favourite":
        return (
          <MotionWrapper>
            <Favourite dataFavouriteItemUser={dataFavouriteItemUser} />
          </MotionWrapper>
        );

      case "voucher":
        return (
          <MotionWrapper>
            <Voucher />
          </MotionWrapper>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto  overflow-y-auto max-h-screen px-4 md:px-10 py-6">
      {activeSite !== "stats" && (
        <button
          onClick={() => setActiveSite("stats")}
          className="
            mb-4 px-4 py-2 flex items-center gap-2 rounded-full
            bg-white/20 backdrop-blur-md border border-white/30
            text-gray-900 shadow-md transition-all duration-200
            hover:bg-white hover:text-gray-800
          "
        >
          <ArrowBigLeft className="w-5 h-5" />
          Quay lại
        </button>
      )}

      {renderContent()}
    </div>
  );
};

const DashboardCard = ({
  card,
  onClick,
}: {
  card: typeof DASHBOARD_CARDS[number];
  onClick: () => void;
}) => {
  const { label, icon: Icon, bg, color } = card;

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        ${bg} ${color}
        flex flex-col items-center justify-center
        rounded-2xl p-6 cursor-pointer
        shadow-[0_4px_20px_rgba(0,0,0,0.06)]
        hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)]
        transition-all group
      `}
    >
      <Icon className={`w-10 h-10 ${color} group-hover:scale-125 transition-all duration-300`} />
      <span className="mt-3 text-sm font-medium text-gray-700">{label}</span>
    </motion.div>
  );
};

const MotionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);
