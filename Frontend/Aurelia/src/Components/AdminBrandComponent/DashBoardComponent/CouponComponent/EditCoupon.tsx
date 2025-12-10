import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Edit3 } from "lucide-react";
import { Save } from "lucide-react";
import { AdminContext } from "../../../../contexts/AdminContext";
import { useContext } from "react";

export const EditCoupon = ({ editing, setEditing }: any) => {
  const { handleUpdateCoupon } = useContext(AdminContext);
  const handleClick = () => {
    handleUpdateCoupon(editing);
    setEditing(null);
  };
  return (
    <AnimatePresence>
      {editing && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setEditing(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditing(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Edit3 className="text-indigo-600" size={28} />
              Chỉnh Sửa Mã Giảm Giá
            </h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã giảm giá
                  </label>
                  <input
                    value={editing.code}
                    onChange={(e) =>
                      setEditing({ ...editing, code: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá trị
                  </label>
                  <input
                    type="number"
                    value={editing.GiaTri}
                    onChange={(e) =>
                      setEditing({ ...editing, GiaTri: Number(e.target.value) })
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
                    value={editing.TheLoaiApDung}
                    onChange={(e) =>
                      setEditing({ ...editing, TheLoaiApDung: e.target.value })
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
                    value={editing.SoLuong}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        SoLuong: Number(e.target.value),
                      })
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
                  value={editing.PhamViApDung}
                  onChange={(e) =>
                    setEditing({ ...editing, PhamViApDung: e.target.value })
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
                    value={editing.DieuKienApDung}
                    onChange={(e) =>
                      setEditing({ ...editing, DieuKienApDung: e.target.value })
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
                    value={editing.Apdungcho}
                    onChange={(e) =>
                      setEditing({ ...editing, Apdungcho: e.target.value })
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
                    value={editing.NgayBatDau}
                    onChange={(e) =>
                      setEditing({ ...editing, NgayBatDau: e.target.value })
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
                    value={editing.NgayKetThuc}
                    onChange={(e) =>
                      setEditing({ ...editing, NgayKetThuc: e.target.value })
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
                  value={editing.Reuse}
                  onChange={(e) =>
                    setEditing({ ...editing, Reuse: e.target.value })
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
                  id="editActive"
                  checked={editing.isActive}
                  onChange={(e) =>
                    setEditing({ ...editing, isActive: e.target.checked })
                  }
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-400"
                />
                <label
                  htmlFor="editActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Mã đang hoạt động
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleClick}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Save size={20} />
                Lưu Thay Đổi
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
