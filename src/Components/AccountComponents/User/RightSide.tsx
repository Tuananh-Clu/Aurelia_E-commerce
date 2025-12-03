import type { AppointmentCustomer, order, Product } from "../../../types/type";
import { useContext, useEffect, useState } from "react";
import { AppointmentContext } from "../../../contexts/AppointmentContext";
import { Stats } from "./RightSideComponent.tsx/Stats";
import { RecentOrder } from "./RightSideComponent.tsx/RecentOrder";
import { HistoryOrder } from "./RightSideComponent.tsx/HistoryOrder";
import { Favourite } from "./RightSideComponent.tsx/Favourite";
import { BarprocessTier } from "./RightSideComponent.tsx/BarprocessTier";

type NewType = {
  dataFavouriteItemUser: Product[];
  userRole?: string;
  tongThuChi: number;
  soLuongDonHang: number;
  donHangChiTiet: order[];
  donhangMoiNhat: number;
};

type RightProps = NewType;

export const RightSide: React.FC<RightProps> = ({
  dataFavouriteItemUser,
  userRole,
  tongThuChi,
  soLuongDonHang,
  donHangChiTiet,
  donhangMoiNhat,
}) => {
  const { LayDachSachLichHenCuaUser } = useContext(AppointmentContext);

  const [dataAppointment, setDataAppointment] = useState<
    AppointmentCustomer[] | null
  >(null);

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

  const lastPurchaseDate = new Date(Number(donhangMoiNhat));

  return (
    <div className="w-full mx-auto max-w-6xl space-y-10 overflow-y-auto max-h-screen ">
      <div>
        <Stats
          tongThuChi={tongThuChi}
          soLuongDonHang={soLuongDonHang}
          lastPurchaseDate={lastPurchaseDate}
          dataFavouriteItemUser={dataFavouriteItemUser}
          userRole={userRole}
        />
      </div>
      <div>
        <BarprocessTier/>
      </div>
      {/* --- Recent Orders --- */}
      <div>
        <RecentOrder donHangChiTiet={donHangChiTiet} />
      </div>

      {/* --- Appointment History --- */}
      <div>
        <HistoryOrder dataAppointment={dataAppointment} />
      </div>
      {/* --- Favourite Products --- */}
      <div>
        <Favourite dataFavouriteItemUser={dataFavouriteItemUser} />
      </div>
    </div>
  );
};
