import { useContext, useState } from "react";
import { Navbar } from "../../HomeLayoutComponent/Navbar";
import { LeftSide } from "./LeftSide";
import { RightSide } from "./RightSide";
import { FilterProductContext } from "../../../contexts/FIlterProduct";
import { AiPoseMeasureContext } from "../../../contexts/AIPoseMeasure";
import EditProfile from "./EditProfile";
import { AuthContext } from "../../../contexts/Author";



export const DashBoard = () => {
  const {userData}=useContext(AuthContext);
  const [openeditProfile, setOpeneditProfile] = useState(false);
  const { DataMeasure } = useContext(AiPoseMeasureContext);

  const {
    dataFavouriteItemUser,
    soLuongDonHang,
    TongThuChi,
    DonHang,
    donhangMoiNhat,
  } = useContext(FilterProductContext);

  return (
    <div className="min-h-screen  relative">
      {/* NAVBAR */}
      <Navbar />

      {/* EDIT PROFILE MODAL */}
      {openeditProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] overflow-y-auto py-10 flex justify-center px-4 h-full">
          <EditProfile setState={setOpeneditProfile} />
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="mt-24 px-4 sm:px-6 lg:px-20 xl:px-40 mb-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT PANEL — MOBILE ON TOP */}
          <div className="w-full lg:w-1/3 xl:w-1/4 md:h-screen lg:h-auto">
            <LeftSide
              userString={userData}
              SanPhamDaThich={dataFavouriteItemUser.length}
              SoLuongDon={soLuongDonHang}
              Voucher={0}
              soDo={DataMeasure}
              setState={setOpeneditProfile}
            />
          </div>

          {/* RIGHT PANEL — MAIN CONTENT */}
          <div className="w-full  lg:w-2/3 xl:w-3/4 h-screen lg:h-auto">
            <RightSide
              dataFavouriteItemUser={dataFavouriteItemUser}
              userRole={userData?.tier}
              soLuongDonHang={soLuongDonHang}
              tongThuChi={TongThuChi}
              donHangChiTiet={DonHang}
              donhangMoiNhat={donhangMoiNhat}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
