import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Plus } from "lucide-react";
import { useContext } from "react";
import { AdminContext } from "../../../../config/AdminContext";

export const AddCoupon = ({
  showAddModal,
  setShowAddModal,
  newCoupon,
  setNewCoupon,
}: any) => {
  const { handleAddCoupon } = useContext(AdminContext);
  const handleCLick = () => {
    handleAddCoupon(newCoupon);
    setShowAddModal(false);
  };
  return (
    <AnimatePresence>
      {showAddModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Plus className="text-indigo-600" size={28} />
              Tạo Mã Giảm Giá Mới
            </h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã giảm giá *
                  </label>
                  <input
                    placeholder="VD: SALE50"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá trị *
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 20 hoặc 50000"
                    value={newCoupon.GiaTri}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, GiaTri: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thể loại áp dụng
                  </label>
                  <select
                    value={newCoupon.TheLoaiApDung}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        TheLoaiApDung: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  >
                    <option>Phần trăm</option>
                    <option>Cố định</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 100"
                    value={newCoupon.SoLuong}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, SoLuong: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phạm vi áp dụng
                </label>
                <input
                  placeholder="VD: Toàn bộ sản phẩm, Đơn hàng trên 500k..."
                  value={newCoupon.PhamViApDung}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, PhamViApDung: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điều kiện áp dụng
                  </label>
                  <input
                    placeholder="VD: Áp dụng cho đơn hàng từ 500k trở lên"
                    value={newCoupon.DieuKienApDung}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        DieuKienApDung: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Áp dụng cho
                  </label>
                  <input
                    placeholder="VD: Tất cả khách hàng, Khách hàng mới..."
                    value={newCoupon.Apdungcho}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, Apdungcho: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={newCoupon.NgayBatDau}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, NgayBatDau: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={newCoupon.NgayKetThuc}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        NgayKetThuc: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tái sử dụng
                </label>
                <select
                  value={newCoupon.Reuse}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, Reuse: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option>Một lần</option>
                  <option>Nhiều lần</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newCoupon.isActive}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, isActive: e.target.checked })
                  }
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-400"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Kích hoạt ngay sau khi tạo
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleCLick}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Tạo Mã
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
