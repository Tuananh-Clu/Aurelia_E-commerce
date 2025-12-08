import React from "react";
import { Package, MapPin, Store } from "lucide-react";

export type LeftSites = {
  data: any;
};

const LeftSite: React.FC<LeftSites> = ({ data }) => {
  return (
  <div className="py-10 lg:py-20 bg-slate-50 lg:max-h-screen lg:overflow-y-scroll">
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-md p-8 border border-slate-100">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-md">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Thông Tin Đơn Hàng</h2>
          </div>
          <p className="text-slate-500 ml-16 text-sm">Thông tin chi tiết về đơn hàng</p>
        </div>

        {/* Product List */}
        <div className="space-y-6">
          {data?.data.product.map((item: any, index: any) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="relative w-full md:w-40 h-40 rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                  <img
                    src={item.thumnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow text-xs font-semibold text-blue-600">
                    #{index + 1}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Màu sắc</p>
                      <p className="text-sm font-medium text-slate-700">{item.color}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Kích thước</p>
                      <p className="text-sm font-medium text-slate-700">{item.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Số lượng</p>
                      <p className="text-sm font-medium text-slate-700">x{item.quantity}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3 flex flex-wrap gap-6 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-600">{item.price}</span>
                      <span className="text-slate-500">Tổng tiền</span>
                    </div>
                    <div>
                      <span className="text-slate-500 mr-1">Ngày mua:</span>
                      <span className="font-medium">
                        {new Date(Number(item.dateBuy)).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shop Info */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-600 rounded-xl shadow-md">
              <Store className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Thông Tin Cửa Hàng</h2>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <p className="text-xs text-slate-500 uppercase">Cửa hàng</p>
            <p className="text-lg font-semibold text-slate-800">{data?.shopName}</p>
            <p className="text-slate-600 mt-1 flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 text-slate-400" />
              {data?.address}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5" />
              <h3 className="text-sm uppercase font-semibold">Địa chỉ giao hàng</h3>
            </div>
            <p className="text-xl font-bold">{data?.data.name}</p>
            <p className="text-blue-100 text-sm mt-1">{data?.data.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSite;
