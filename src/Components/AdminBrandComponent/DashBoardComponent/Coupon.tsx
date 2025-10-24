import { useContext, useState } from "react";
import {
  Plus,
  Tag,
  Percent,
  Trash2,
  Edit3,
  Calendar,
  TicketPercent,
  Package,
  RefreshCw,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminContext } from "../../../config/AdminContext";
import { AddCoupon } from "./CouponComponent/AddCoupon";
import { EditCoupon } from "./CouponComponent/EditCoupon";
import { v4 as uuid } from "uuid";
export default function Coupon() {
const { coupons,handleDeleteCoupon,handleToggleCouponStatus } = useContext(AdminContext);
  const [editing, setEditing] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  
  const [newCoupon, setNewCoupon] = useState({
    id: uuid(),
    code: "",
    NgayBatDau: "",
    NgayKetThuc: "",
    PhamViApDung: "",
    GiaTri: "",
    TheLoaiApDung: "Phần trăm",
    isActive: true,
    SoLuong: "",
    Reuse: "Một lần",
  });

  const handleDelete = (couponId: string) => {
    handleDeleteCoupon(couponId);
  }
  const handleToggleStatus = (couponId: string, bool: boolean) => {
    handleToggleCouponStatus(couponId, bool);
  }
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === "all" || 
                         (filterActive === "active" && coupon.isActive) ||
                         (filterActive === "inactive" && !coupon.isActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-h-screen overflow-y-scroll bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between lg:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <TicketPercent className="text-indigo-600" size={36} />
            Quản Lý Mã Giảm Giá
          </h1>
          <p className="text-gray-500 mt-2">
            Tạo và theo dõi các chương trình khuyến mãi của hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Plus size={20} />
          Thêm Mã Mới
        </button>
      </header>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterActive("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterActive === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterActive("active")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterActive === "active"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Hoạt động
            </button>
            <button
              onClick={() => setFilterActive("inactive")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterActive === "inactive"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Ngưng
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Tổng mã</p>
              <p className="text-3xl font-bold mt-2">{coupons.length}</p>
            </div>
            <Tag className="opacity-80" size={28} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium">Đang hoạt động</p>
              <p className="text-3xl font-bold mt-2">
                {coupons.filter((c) => c.isActive).length}
              </p>
            </div>
            <CheckCircle className="opacity-80" size={28} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-100 text-sm font-medium">Tổng số lượng</p>
              <p className="text-3xl font-bold mt-2">
                {coupons.reduce((sum, c) => sum + c.soLuong, 0)}
              </p>
            </div>
            <Package className="opacity-80" size={28} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-medium">Tái sử dụng</p>
              <p className="text-3xl font-bold mt-2">
                {coupons.filter((c) => c.Reuse === "Nhiều lần").length}
              </p>
            </div>
            <RefreshCw className="opacity-80" size={28} />
          </div>
        </motion.div>
      </div>

      {/* Coupons Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredCoupons.map((coupon, i) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 relative overflow-hidden"
            >
              {/* Top Accent */}
              <div className={`absolute top-0 left-0 w-full h-2 ${
                coupon.isActive ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-gray-400 to-gray-500"
              }`}></div>

              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold text-indigo-600">
                      {coupon.code}
                    </span>
                    {coupon.isActive ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <XCircle size={18} className="text-gray-400" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-mono">{coupon.id}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(coupon.id, !coupon.isActive)}
                    className={`p-2 rounded-lg transition-all ${
                      coupon.isActive
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {coupon.isActive ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  </button>
                  <button
                    onClick={() => setEditing(coupon)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Value Display */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Percent size={24} className="text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-600">Giá trị</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {coupon.theLoaiApDung === "Phần trăm"
                          ? `${coupon.giaTri}%`
                          : `${coupon.giaTri.toLocaleString()}đ`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Số lượng</p>
                    <p className="text-xl font-bold text-gray-800">{coupon.soLuong}</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Bắt đầu</p>
                    <p className="text-sm font-semibold text-gray-700">{coupon.ngayBatDau}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Kết thúc</p>
                    <p className="text-sm font-semibold text-gray-700">{coupon.ngayKetThuc}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {coupon.theLoaiApDung}
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                  {coupon.reuse}
                </span>
                {coupon.phamViApDung && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                    {coupon.phamViApDung}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCoupons.length === 0 && (
        <div className="text-center py-16">
          <TicketPercent size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Không tìm thấy mã giảm giá nào</p>
        </div>
      )}

      <div>
        <AddCoupon showAddModal={showAddModal} setShowAddModal={setShowAddModal} newCoupon={newCoupon} setNewCoupon={setNewCoupon}/>
      </div>

      {/* Edit Modal */}
      <div>
        <EditCoupon editing={editing} setEditing={setEditing} />
      </div>
    </div>
  );
  
}