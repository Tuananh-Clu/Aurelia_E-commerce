import { useContext, useEffect, useState } from "react";
import { Navbar } from "../../HomeLayoutComponent/Navbar";
import { LeftSide } from "./LeftSide";
import { RightSide } from "./RightSide";
import { FilterProductContext } from "../../../contexts/FIlterProduct";
import type { Clients } from "../../../types/type";
import { AiPoseMeasureContext } from "../../../contexts/AIPoseMeasure";
import EditProfile from "./EditProfile";
import { useLocation } from "react-router-dom";

export const DashBoard = () => {
  const userString = localStorage.getItem("user");
  const [openeditProfile, setOpeneditProfile] = useState(false);
  const { DataMeasure } = useContext(AiPoseMeasureContext);
  const location=useLocation();
  const [user, setUser] = useState<Clients | null>(null);
  useEffect(() => {
    setUser(userString ? JSON.parse(userString) : null);
  }, [location]);
  const {
    dataFavouriteItemUser,
    soLuongDonHang,
    TongThuChi,
    DonHang,
    donhangMoiNhat,
  } = useContext(FilterProductContext);
  return (
    <>
      <div>
        <Navbar />
      </div>
      {openeditProfile && (
        <div className="w-full fixed inset-0 h-screen py-20 z-99 bg-black/90">
          <EditProfile setState={setOpeneditProfile} />
        </div>
      )}
      <div className="mt-24 px-6 md:px-20 lg:px-40 relative mb-10 ">
        <div className="flex flex-row justify-between gap-8 relative  ">
          <div className=" ">
            <LeftSide
              userString={userString }
              SanPhamDaThich={dataFavouriteItemUser.length}
              SoLuongDon={soLuongDonHang}
              Voucher={0}
              soDo={DataMeasure}
              setState={setOpeneditProfile}
            />
          </div>
          <div className=" w-full md:w-4/5 ">
            <RightSide
              dataFavouriteItemUser={dataFavouriteItemUser}
              userRole={user?.tier}
              soLuongDonHang={soLuongDonHang}
              tongThuChi={TongThuChi}
              donHangChiTiet={DonHang}
              donhangMoiNhat={donhangMoiNhat}
            />
          </div>
        </div>
      </div>
    </>
  );
};
