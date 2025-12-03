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
    bgGradient: "from-red-50 to-white",
    textColor: "text-red-500",
    key: "recentOrder",
  },
  {
    label: "Sản phẩm yêu thích",
    icon: HeartIcon,
    bgGradient: "from-pink-50 to-white",
    textColor: "text-pink-600",
    key: "favourite",
  },
  {
    label: "Lịch hẹn",
    icon: ListOrdered,
    bgGradient: "from-gray-50 to-white",
    textColor: "text-gray-600",
    key: "listAppointment",
  },
  {
    label: "Voucher",
    icon: Ticket,
    bgGradient: "from-yellow-50 to-white",
    textColor: "text-yellow-600",
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
    const fetchAppointments = async () => {
      try {
        const data = await LayDachSachLichHenCuaUser();
        setDataAppointment(Array.isArray(data) ? data : []);
      } catch {
        setDataAppointment(null);
      }
    };
    fetchAppointments();
  }, []);

  const renderContent = () => {
    switch (activeSite) {
      case "stats":
        return (
          <div className="space-y-6">
            <Stats
              tongThuChi={tongThuChi}
              soLuongDonHang={soLuongDonHang}
              lastPurchaseDate={lastPurchaseDate}
              dataFavouriteItemUser={dataFavouriteItemUser}
              userRole={userRole}
            />
            <h1 className="text-2xl font-semibold text-gray-700">Bảng điều khiển</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        return <div className="text-gray-500 text-center py-10">Chưa có dữ liệu Voucher</div>;
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto space-y-10 overflow-y-auto max-h-screen p-4">
      {activeSite !== "stats" && (
        <button
          className="mb-4 px-3 py-2 bg-gray-700 text-white rounded-full flex items-center hover:bg-white hover:text-gray-700 transition"
          onClick={() => setActiveSite("stats")}
        >
          <ArrowBigLeft className="w-5 h-5 mr-2" />
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
  const { label, icon: Icon, bgGradient, textColor } = card;
  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-4 rounded-xl
        bg-gradient-to-b ${bgGradient} shadow-sm
        hover:shadow-lg hover:-translate-y-1 transition-all duration-300
        cursor-pointer group
      `}
    >
      <Icon className={`w-10 h-10 ${textColor} group-hover:scale-110 transition-all`} />
      <span className="mt-2 text-sm font-semibold text-gray-700">{label}</span>
    </div>
  );
};


const MotionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);
