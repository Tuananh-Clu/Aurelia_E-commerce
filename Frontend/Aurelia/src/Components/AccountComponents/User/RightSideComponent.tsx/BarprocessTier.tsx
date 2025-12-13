import { motion } from "framer-motion";
import { Crown, Gift, Sparkles, Star, Shield } from "lucide-react";
import { AuthContext } from "../../../../contexts/Author";
import { useContext } from "react";

export const BarprocessTier = () => {
  const { userData } = useContext(AuthContext);

  const tiers = {
    Bronze: {
        max: 500,
        color: "from-yellow-700 to-yellow-900",
        bg: "bg-gradient-to-br from-yellow-100 to-yellow-200",
        icon: <Star className="text-yellow-800" />,
        benefits: ["Ưu đãi sinh nhật 3%"],
      },
    Silver: {
      max: 1000,
      color: "from-gray-300 to-gray-500",
      bg: "bg-gradient-to-br from-gray-100 to-gray-200",
      icon: <Shield className="text-gray-500" />,
      benefits: ["Miễn phí vận chuyển đơn đầu tiên", "Ưu đãi sinh nhật 5%"],
    },
    Gold: {
      max: 5000,
      color: "from-yellow-400 to-yellow-600",
      bg: "bg-gradient-to-br from-yellow-100 to-yellow-200",
      icon: <Star className="text-yellow-500" />,
      benefits: ["Giảm 10% cho tất cả sản phẩm", "Ưu tiên hỗ trợ khách hàng"],
    },
    Diamond: {
      max: 10000,
      color: "from-blue-400 to-blue-600",
      bg: "bg-gradient-to-br from-blue-100 to-blue-200",
      icon: <Sparkles className="text-blue-500" />,
      benefits: ["Giảm 15%", "Tặng quà tri ân mỗi quý"],
    },
    Royal: {
      max: 20000,
      color: "from-purple-400 to-purple-700",
      bg: "bg-gradient-to-br from-purple-100 to-purple-200",
      icon: <Crown className="text-purple-600" />,
      benefits: ["Giảm 20%", "Hỗ trợ riêng 24/7", "Ưu đãi sự kiện VIP"],
    },
    "Royal Plus": {
      max: 999999,
      color: "from-rose-400 to-amber-500",
      bg: "bg-gradient-to-br from-rose-100 to-amber-100",
      icon: <Gift className="text-rose-500" />,
      benefits: ["Giảm 30%", "Quà tặng độc quyền", "Trải nghiệm cao cấp"],
    },
  };

  const pointNextTier =
    userData.point <= 1000
      ? "Silver"
      : userData.point <= 5000
      ? "Gold"
      : userData  .point <= 10000
      ? "Diamond"
      : userData.point <= 20000
      ? "Royal"
      : "Royal Plus";

  const tierInfo = tiers[pointNextTier as keyof typeof tiers];
  const percentNextTier = Math.min((userData.point / tierInfo.max) * 100, 100);

  return (
    <div
      className={`w-full p-5 rounded-2xl shadow-md border border-white/30 ${tierInfo.bg}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {tierInfo.icon}
          <h1 className="text-lg font-semibold text-gray-800">
            Tiến trình thăng hạng
          </h1>
        </div>
        <span className="text-sm text-gray-600 italic">
          Hạng hiện tại:{" "}
          <span className="font-semibold">{userData.tier || "Chưa có"}</span>
        </span>
      </div>

      {/* Tiến trình */}
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Điểm: {userData.point}</span>
          <span>Hạng tiếp theo: {pointNextTier}</span>
        </div>
        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentNextTier}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`h-4 rounded-full bg-gradient-to-r ${tierInfo.color} shadow-inner`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{userData.point} điểm</span>
          <span>{tierInfo.max} điểm</span>
        </div>
      </div>

      {/* Thông tin thêm */}
      <div className="mt-3 bg-white/50 p-3 rounded-xl shadow-inner">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">
          Quyền lợi hạng {pointNextTier}
        </h2>
        <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
          {tierInfo.benefits.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
