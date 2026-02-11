import { motion, type Variants } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Percent,
  BarChart3,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
import type { ChartOptions, ChartData } from "chart.js";
import { useContext } from "react";
import { AdminContext } from "../../../contexts/AdminContext";
import { Bar } from "react-chartjs-2";
import BestSeller from "./BestSeller";
import StatsCard from "./StatsCard";

export const OverView = () => {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const { dataRevenue, dataUser, doanhThuCuaHang, bestSellingProducts } =
    useContext(AdminContext);

  const data: ChartData<"bar"> = {
    labels: doanhThuCuaHang.map((item) => item.shopName),
    datasets: [
      {
        label: "Doanh thu theo tháng",
        data: doanhThuCuaHang.map((item) => item.revenue),
        backgroundColor: [
          "rgb(201, 203, 207)",
          "black",
        ],
        borderColor: [
          "rgba(201, 203, 207, 0.2)",
          "rgba(0, 0, 0, 0.2)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: "white",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#6b7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#6b7280",
        },
      },
    },
  };

  const cards = [
    {
      icon: <DollarSign className="text-white" size={24} />,
      title: "Doanh thu",
      value: dataRevenue?.totalRevenue.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
      trend:
        dataRevenue?.growthRateRevenue >= 0
          ? `+${dataRevenue?.growthRateRevenue}%`
          : `${dataRevenue?.growthRateRevenue}%`,
      isPositive: dataRevenue?.growthRateRevenue >= 0,
      color: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      iconBg: "bg-emerald-500/10",
    },
    {
      icon: <ShoppingBag className="text-white" size={24} />,
      title: "Đơn hàng",
      value: dataRevenue?.totalOrders.toLocaleString("vi-VN"),
      trend:
        dataRevenue?.growthRateOrders >= 0
          ? `+${dataRevenue?.growthRateOrders}%`
          : `${dataRevenue?.growthRateOrders}%`,
      isPositive: dataRevenue?.growthRateOrders >= 0,
      color: "from-indigo-500/10 via-indigo-500/5 to-transparent",
      iconBg: "bg-indigo-500/10",
    },
    {
      icon: <Users className="text-white" size={24} />,
      title: "Khách hàng",
      value: dataUser?.soLuongKhachDangKy.toLocaleString("vi-VN"),
      trend:
        dataUser?.tyLeKhachHang >= 0
          ? `+${dataUser?.tyLeKhachHang}%`
          : `${dataUser?.tyLeKhachHangMoi}%`,
      isPositive: dataUser?.tyLeKhachHang >= 0,
      color: "from-purple-500/10 via-purple-500/5 to-transparent",
      iconBg: "bg-purple-500/10",
    },
    {
      icon: <Percent className="text-white" size={24} />,
      title: "Mã giảm giá",
      value: dataUser?.soLuongCoupon.toLocaleString("vi-VN"),
      trend:
        dataUser?.tyLeCoupon >= 0
          ? `+${dataUser?.tyLeCoupon}%`
          : `${dataUser?.tyLeCoupon}%`,
      isPositive: dataUser?.tyLeCoupon >= 0,
      color: "from-orange-500/10 via-orange-500/5 to-transparent",
      iconBg: "bg-orange-500/10",
    },
  ];

  return (
    <motion.div
      className="max-h-screen p-6 md:p-8 bg-gradient-to-br overflow-y-auto from-slate-50 via-white to-slate-50 "
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } },
      }}
    >
      <motion.div className="mb-8" variants={fadeUp}>
        <h2 className="serif text-4xl lg:text-5xl font-normal  mb-3">
          Bảng tổng quan thương hiệu
        </h2>
        <p className="text-secondary dark:text-accent text-sm font-light tracking-wide">
          Cập nhật hiệu suất và tình hình kinh doanh mới nhất
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {
        cards.map((card) => (
          <StatsCard data={card} />
        ))
      }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={fadeUp}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Doanh thu theo cửa hàng
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Hiệu suất doanh thu tháng này
              </p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
              Xem chi tiết →
            </button>
          </div>

          {doanhThuCuaHang.length > 0 ? (
            <div className="h-80">
              <Bar data={data} options={options} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-gray-400 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-200">
              <BarChart3 className="w-12 h-12 mb-3 text-indigo-300" />
              <span className="text-sm font-medium text-gray-600">
                Biểu đồ đang được cập nhật...
              </span>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col">
          <BestSeller TOP_PRODUCTS={bestSellingProducts.slice(0, 5)} />

          <button className="w-full mt-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>
    </motion.div>
  );
};
