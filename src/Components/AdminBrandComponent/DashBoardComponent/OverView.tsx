import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Percent,
  BarChart3,
  TrendingUp,
  TrendingDown,
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
  Legend
);
import { useContext } from "react";
import { AdminContext } from "../../../config/AdminContext";
import { Bar } from "react-chartjs-2";

export const OverView = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const { dataRevenue, dataUser, doanhThuCuaHang, bestSellingProducts } =
    useContext(AdminContext);

  const data = {
    labels: doanhThuCuaHang.map((item) => item.shopName),
    datasets: [
      {
        label: "Doanh thu theo tháng",
        data: doanhThuCuaHang.map((item) => item.revenue),
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(99, 102, 241, 1)",
      },
    ],
  };

  const options = {
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
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
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
          drawBorder: false,
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
      icon: <DollarSign className="text-emerald-500" size={24} />,
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
      icon: <ShoppingBag className="text-indigo-500" size={24} />,
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
      icon: <Users className="text-purple-500" size={24} />,
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
      icon: <Percent className="text-orange-500" size={24} />,
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
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Bảng tổng quan thương hiệu
        </h1>
        <p className="text-base text-gray-600">
          Cập nhật hiệu suất và tình hình kinh doanh mới nhất
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative overflow-hidden p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300`}
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} rounded-full blur-3xl -z-0`}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${item.iconBg} rounded-xl`}>
                  {item.icon}
                </div>
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                    item.isPositive ? "bg-emerald-50" : "bg-rose-50"
                  }`}
                >
                  {item.isPositive ? (
                    <TrendingUp size={14} className="text-emerald-600" />
                  ) : (
                    <TrendingDown size={14} className="text-rose-600" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      item.isPositive ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {item.trend}
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-500 mb-1">
                {item.title}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {item.value}
              </h2>
              <p className="text-xs text-gray-400 mt-2">so với tháng trước</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart and Best Sellers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
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

        {/* Best Sellers */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔥</span>
            <h2 className="text-xl font-bold text-gray-900">
              Sản phẩm bán chạy
            </h2>
          </div>

          <div className="space-y-4">
            {bestSellingProducts?.slice(0, 5)?.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${
                    i === 0
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                      : i === 1
                      ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                      : i === 2
                      ? "bg-gradient-to-br from-yellow-600 to-yellow-800 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500">{p.type}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-emerald-600">
                    {p.price * p.sold.toLocaleString("vi-VN")} VND
                  </p>
                  <p className="text-xs text-gray-500">{p.sold} đã bán</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            Xem tất cả sản phẩm
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
