import { useContext, useState } from "react";
import { Navbar } from "../../HomeLayoutComponent/Navbar";
import { LeftSide } from "./LeftSide";
import { RightSide } from "./RightSide";
import { FilterProductContext } from "../../../contexts/FIlterProduct";
import { AuthContext } from "../../../contexts/Author";
import { AiPoseMeasureContext } from "../../../contexts/AIPoseMeasure";



export const DashBoard = () => {
  const {userData}=useContext(AuthContext);
  const [navItem, setNavItem] = useState([
    { name: "Tổng quan",activeItem:true,value:"stats" },
    { name: "Đơn mua",activeItem:false,value:"recentOrder" },
    { name: "Sản phẩm yêu thích", activeItem:false,value:"favourite" },
    {name: "Lịch Đặt hẹn", activeItem:false,value:"listAppointment" },
    { name: "Mã giảm giá", activeItem:false,value:"voucher" },
    { name: "Số Đo Cơ Thể", activeItem:false,value:"bodyMeasurement" },
    { name: "Cài đặt tài khoản", activeItem:false,value:"accountSettings" },
  ]);
  const [activeItem, setActiveItem] = useState(navItem[0].value);
  const {DataMeasure}=useContext(AiPoseMeasureContext)
  const {
    dataFavouriteItemUser,
    soLuongDonHang,
    DonHang,
    TongThuChi,

  } = useContext(FilterProductContext);

  return (
    <div className="min-h-screen  relative">
      <Navbar />

      <div className="mt-16 px-4  mb-10">
        <div className="flex flex-col lg:flex-row gap-10">

          <div className="w-full lg:w-1/3 xl:w-1/4 md:h-screen lg:h-auto">
            <LeftSide
              userString={userData}
              navItems={navItem}
              activeItem={activeItem}
              setActiveItem={setActiveItem}

            />
          </div>
          <div className="w-full  lg:w-2/3 xl:w-3/4 h-screen lg:h-auto">
            <RightSide
              setActiveItem={setActiveItem}
              dataFavouriteItemUser={dataFavouriteItemUser}
              userRole={userData?.tier}
              soLuongDonHang={soLuongDonHang}
              tongThuChi={TongThuChi}
              donHangChiTiet={DonHang}
              userString={userData}
              isActive={activeItem}
              dataMeasure={DataMeasure}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
