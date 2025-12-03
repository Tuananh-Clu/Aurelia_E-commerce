import { useContext, useState } from "react";
import type { Coupon } from "../../types/type";
import { Copy, Check, Gift, Percent, Zap, TruckIcon } from "lucide-react";
import { AdminContext } from "../../contexts/AdminContext";
import toast from "react-hot-toast";
export const CouponCard = ({
  setIsOpen,
  selectvoucher,
  setSelectvoucher,
  type,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectvoucher: Coupon[];
  setSelectvoucher: React.Dispatch<React.SetStateAction<Coupon[]>>;
  type: string;
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { coupons, dataVoucher } = useContext(AdminContext);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatValue = (value: number, type: string) => {
    if (type === "percent") {
      return `${value}%`;
    } else if (type === "money") {
      return `${(value / 1000).toFixed(0)}K`;
    } else {
      return "Free";
    }
  };

  const getGradientByType = (type: string, apDungCho: string) => {
    if (apDungCho === "Khách Hàng Vip") return "from-amber-500 to-orange-600";
    if (type === "Phần trăm") return "from-violet-500 to-purple-600";
    if (type === "Miễn phí vận chuyển") return "from-emerald-500 to-teal-600";
    return "from-rose-500 to-pink-600";
  };

  const getBadge = (apDungCho: string, reuse: string) => {
    if (apDungCho === "Khách Hàng Vip") return "VIP";
    if (apDungCho === "Khách hàng mới") return "NEW";
    if (reuse === "Nhiều lần") return "REUSE";
    return "HOT";
  };

  const getIcon = (type: string) => {
    if (type === "order") return <Percent className="w-5 h-5" />;
    if (type === "ship") return <TruckIcon className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
  };
  const applyCoupon = (coupon: Coupon) => {
    const hasOrderCoupon =selectvoucher?.find((a) => a.typeCoupon === "order");
    const hasShipCoupon = selectvoucher?.find((a) => a.typeCoupon === "ship");
    if (coupon.typeCoupon === "order" && hasOrderCoupon?.code.length! > 0) {
      alert("Chỉ được áp dụng 1 mã giảm giá đơn hàng");
      return;
    }
    if (coupon.typeCoupon === "ship" && hasShipCoupon?.code.length! > 0) {
      alert("Chỉ được áp dụng 1 mã giảm phí ship");
      return;
    }
    setSelectvoucher((prev) => [...(prev || []), coupon]);
    toast.success("Áp dụng mã giảm giá thành công");
  };
  const removeAppliedCoupon = (couponId: string) => {
    setSelectvoucher((prev) =>
      (prev || []).filter((item) => item.id !== couponId)
    );
  };
  return (
    <div className="space-y-5">
      {coupons
        .filter((coupon: Coupon) => coupon.isActive && coupon.typeCoupon === type)
        .map((coupon) => (
          <div
            key={coupon.id}
            className="relative group bg-slate-700/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 hover:scale-[1.02] transition-all"
          >
            <div
              className={`absolute -top-3 -right-3 bg-gradient-to-r ${getGradientByType(
                coupon.theLoaiApDung,
                coupon.phamViApDung
              )} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
            >
              {getBadge(coupon.phamViApDung, coupon.reuse)}
            </div>

            <div className="flex items-center gap-6">
              <div
                className={`bg-gradient-to-br ${getGradientByType(
                  coupon.theLoaiApDung,
                  coupon.phamViApDung
                )} p-6 rounded-2xl text-white shadow-2xl min-w-[120px] flex flex-col items-center group-hover:scale-110 transition-transform`}
              >
                <div className="mb-1">{getIcon(coupon.typeCoupon)}</div>
                <div className="text-3xl font-black">
                  {formatValue(coupon.giaTri, coupon.loaiGiam)}
                </div>
                <div className="text-xs opacity-90 font-semibold">{coupon.typeCoupon==="order" ? "OFF" : coupon.typeCoupon==="ship" ? "FREE" : "HOT"}</div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl border border-purple-500/30">
                    <code className="text-purple-400 font-bold text-lg">
                      {coupon.code}
                    </code>
                  </div>
                  <button
                    onClick={() => copyCode(coupon.code, coupon.id)}
                    className="text-purple-400 hover:text-purple-300 p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
                  >
                    {copiedCode === coupon.id ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-gray-200 font-medium mb-3">
                  {coupon.dieuKienApDung}
                </p>

                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="bg-slate-900/60 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-500/20">
                    {coupon.phamViApDung}
                  </span>
                  <span className="bg-slate-900/60 text-pink-300 px-3 py-1.5 rounded-lg border border-pink-500/20">
                    {coupon.moTa}
                  </span>
                  <span className="bg-slate-900/60 text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                    HSD: {formatDate(coupon.ngayKetThuc)}
                  </span>
                  {coupon.soLuong > 0 && (
                    <span className="bg-slate-900/60 text-yellow-300 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                      Còn: {coupon.soLuong}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-5">
                <button
                  onClick={() => applyCoupon(coupon)}
                  disabled={dataVoucher.find((item) => item.code === coupon.code) ? false : true}
                  className={`px-8 py-4 rounded-xl font-bold transition-all shadow-lg whitespace-nowrap  ${
                    dataVoucher.find((item) => item.code === coupon.code)
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 hover:shadow-xl"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {selectvoucher != null && selectvoucher.find((item) => item.id === coupon.id)
                    ? "Đã áp dụng"
                    : dataVoucher.find((item) => item.code === coupon.code)
                    ? "Áp dụng"
                    : "Không thể áp dụng"}
                </button>
                {selectvoucher?.find((item) => item.id === coupon.id) && (
                  <button
                    onClick={() => removeAppliedCoupon(coupon.id)}
                    className="bg-red-500 text-white px-8 py-4   rounded-md"
                  >
                    <h1>Bỏ áp dụng</h1>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
