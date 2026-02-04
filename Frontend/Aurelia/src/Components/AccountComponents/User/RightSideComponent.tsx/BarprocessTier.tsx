
import { Crown, Gift, Sparkles, Star, Shield } from "lucide-react";
import { AuthContext } from "../../../../contexts/Author";
import { useContext } from "react";

export const BarprocessTier = ({userRole}: {userRole: string}) => {
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
    userData?.point <= 1000
      ? "Silver"
      : userData.point <= 5000
        ? "Gold"
        : userData.point <= 10000
          ? "Diamond"
          : userData.point <= 20000
            ? "Royal"
            : "Royal Plus";

  const tierInfo = tiers[pointNextTier as keyof typeof tiers];
  const percentNextTier = Math.min((userData.point / tierInfo.max) * 100, 100);

  return (
    <section className="mb-20 animate-fade-in-up">
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="text-lg font-serif italic">
          Aurelia {userRole}
        </h3>
        <span className="text-xs uppercase tracking-widest text-primary font-medium">
          {userData.tier} Status
        </span>
      </div>
      <div className="relative h-[1px] w-full bg-gray-200 dark:bg-gray-800 mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${percentNextTier}%` }}
        ></div>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary ring-4 ring-white dark:ring-[#111318] transition-all duration-1000 ease-out"
          style={{ left: `${percentNextTier}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-start text-xs text-gray-500 dark:text-gray-400">
        <span>{userData.point} pts</span>
        <div className="text-right">
          <p className="mb-1">
            <span className=" font-medium">
              {tierInfo.max} pts
            </span>{" "}
            to {pointNextTier} Tier
          </p>
          <p className="font-light italic">
            Next Reward: {tierInfo.benefits[0]}
          </p>
        </div>
      </div>
    </section>
  );
};
