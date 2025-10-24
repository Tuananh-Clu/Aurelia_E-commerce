import type React from "react"
import { Package, MapPin, Store } from "lucide-react"

export type LeftSites = {
  data: any
}

export const LeftSite: React.FC<LeftSites> = ({ data }) => {
  return (
    <div className="  ">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Thông Tin Đơn Hàng
            </h2>
          </div>
          <p className="text-slate-500 ml-14">Chi tiết sản phẩm và đơn hàng của bạn</p>
        </div>

        {/* Products Section */}
        <div className="space-y-4">
          {data?.data.product.map((item: any, index: any) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-200 group"
            >
              <div className="flex flex-col md:flex-row gap-6 p-6">
                {/* Image Section */}
                <div className="relative overflow-hidden rounded-xl bg-slate-100 flex-shrink-0">
                  <img
                    src={item.thumnail}
                    alt={item.name}
                    className="w-full md:w-48 h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Màu sắc</span>
                      <span className="text-sm font-semibold text-slate-700">{item.color}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Kích thước</span>
                      <span className="text-sm font-semibold text-slate-700">{item.size}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">Số lượng</span>
                      <span className="text-sm font-semibold text-slate-700">x{item.quantity}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-600">Tổng tiền:</span>
                      <span className="text-lg font-bold text-blue-600">{item.price}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Ngày mua:</span>
                      <span className="text-sm font-semibold text-slate-700">
                        {new Date(Number(item.dateBuy)).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shop Info Section */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Thông Tin Cửa Hàng
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-2">Cửa hàng</h3>
              <p className="text-lg font-semibold text-slate-800">{data?.shopName}</p>
              <p className="text-slate-600 mt-1 flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-slate-400 flex-shrink-0" />
                <span>{data?.address}</span>
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5" />
                <h3 className="text-sm uppercase tracking-wider font-semibold">Địa chỉ giao hàng</h3>
              </div>
              <p className="text-xl font-bold mb-1">{data?.data.name}</p>
              <p className="text-blue-100">{data?.data.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSite