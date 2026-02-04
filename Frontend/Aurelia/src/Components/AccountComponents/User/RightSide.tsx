import type { AppointmentCustomer, order, Product } from "../../../types/type";
import { useContext, useEffect, useState } from "react";
import { AppointmentContext } from "../../../contexts/AppointmentContext";

import { HistoryOrder } from "./RightSideComponent.tsx/HistoryAppointment";
import { Favourite } from "./RightSideComponent.tsx/Favourite";
import { BarprocessTier } from "./RightSideComponent.tsx/BarprocessTier";
import { motion } from "framer-motion";
import Voucher from "./RightSideComponent.tsx/Voucher";
import { RecentActivity } from "./RightSideComponent.tsx/RecentActivity";
import { Stats } from "./RightSideComponent.tsx/Stats";
import { RecentOrder } from "./RightSideComponent.tsx/RecentOrder";
import { MeasureDashBoard } from "./RightSideComponent.tsx/MeasureDashBoard";
import AccountSettings from "./AccountSettings";

type RightProps = {
  dataFavouriteItemUser: Product[];
  userRole?: string;
  tongThuChi: number;
  soLuongDonHang: number;
  donHangChiTiet: order[];
  userString: any;
  isActive?: string;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
  dataMeasure: any
};

export const RightSide: React.FC<RightProps> = ({
  dataFavouriteItemUser,
  userRole,
  donHangChiTiet,
  userString,
  isActive,
  setActiveItem,
  dataMeasure,
}) => {
  const { LayDachSachLichHenCuaUser } = useContext(AppointmentContext);
  const [dataAppointment, setDataAppointment] = useState<
    AppointmentCustomer[] | null
  >(null);

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
    switch (isActive ) {
      case "stats":
        return (
          <div className="space-y-10">
            <header className="mb-16 animate-fade-in">
              <h2 className="font-serif text-4xl text-text-main  mb-3">
                Bonjour, {userString.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-light text-sm tracking-wide">
                Welcome to your personal dashboard. Overview of your activity
                below.
              </p>
            </header>
            <BarprocessTier userRole={userRole ?? ""} />
            <div className="w-full flex ">
              <div className="w-2/3 mb-10">
                <RecentActivity orders={donHangChiTiet} setActiveItem={setActiveItem} />
              </div>
              <div className="w-1/3 ml-10">
                <h1>Stats </h1>
                <Stats />
              </div>
            </div>
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
            <HistoryOrder dataAppointment={dataAppointment ?? []} />
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
      case "bodyMeasurement":
        return (
          <MotionWrapper>
            <MeasureDashBoard DataMeasure={dataMeasure} />
          </MotionWrapper>
        );
      case "accountSettings"
        :
        return (
          <MotionWrapper>
            <AccountSettings  />
          </MotionWrapper>
        );
      case "listAppointment":
        return (
          <MotionWrapper>
            <HistoryOrder dataAppointment={dataAppointment ?? []} />
          </MotionWrapper>
        );
    }
  };
  return <div className="p-8 bg-white rounded-lg shadow-sm">{renderContent()}</div>;
}

const MotionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);
