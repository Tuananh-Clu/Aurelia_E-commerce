import { useContext, useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  Package,
  Grid,
  List,
  Filter,
  ArrowRight,
  File,
} from "lucide-react";
import { FilterProductContext } from "../../../config/FIlterProduct";
import ImportExcel from "./ProductManagementComponents/ImportExcel";
export default function ProductManagement() {
  const { dataProduct } = useContext(FilterProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [activeAddProduct, setActiveAddProduct] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const filteredProducts = useMemo(() => {
    return dataProduct.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dataProduct, searchTerm]);
  return (
    <div className="max-h-screen bg-black text-white p-8 relative overflow-hidden">
      {/* Import Excel Modal */}
      {openImportModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
        <ImportExcel setOpenImportModal={setOpenImportModal} />
        </div>}
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
                  Products
                </h1>
              </div>
              <p className="text-gray-400 text-lg">
                Refined. Reactive. Radiant.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveAddProduct(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg overflow-hidden transform hover:scale-105 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center gap-3">
                  <Plus className="w-6 h-6" />
                  <span>Add Product</span>
                </div>
              </button>
              <button onClick={()=>{setOpenImportModal(true)}} className="group relative px-6 py-1 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl font-bold text-lg overflow-hidden transform hover:scale-105 transition-all ">
                <h1 className="text-lg font-bold">
                  Import From Excel{" "}
                  <ArrowRight className="inline-block w-4 h-4" />
                </h1>
                  <span>
                    Upload <File className="inline-block w-4 h-4" />
                  </span>
              </button>
            </div>
          </div>

          {/* Search + View Switch */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-white placeholder-gray-500"
              />
            </div>
            <button className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <Filter className="w-5 h-5" />
            </button>
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-purple-600" : "hover:bg-white/10"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === "list" ? "bg-purple-600" : "hover:bg-white/10"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div
          className={`grid gap-8 max-h-screen overflow-y-scroll ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredProducts?.map((p, index) => (
            <div
              key={p.id}
              className="group relative"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="relative h-[500px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02]">
                {/* Image */}
                <div className="absolute inset-0">
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Floating actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  {[Eye, Edit, Trash2].map((Icon, i) => (
                    <button
                      key={i}
                      className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-transform hover:scale-110"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <div className="transform transition-all duration-500 group-hover:-translate-y-4">
                    <div className="inline-block mb-3 px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
                      <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {p.type.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black mb-3 leading-tight">
                      {p.name}
                    </h3>
                    <p className="text-gray-300 mb-3 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-pink-400">
                        ${p.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        {Array.from({ length: Math.round(p.rating || 4) }).map(
                          (_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Stock: {p.stock}</span>
                      <span>Sold: {p.sold}</span>
                      {p.discountValue > 0 && (
                        <span className="text-rose-400 font-semibold">
                          -{p.discountValue}
                          {p.discountType === "percent" ? "%" : "$"}
                        </span>
                      )}
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      className="w-full group/btn relative px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold overflow-hidden transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 mt-5"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        <span>View Details</span>
                        <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <div
            className="group cursor-pointer"
            style={{
              animation: `fadeInUp 0.6s ease-out ${
                (filteredProducts?.length || 0) * 0.1
              }s both`,
            }}
          >
            <div className="h-[500px] backdrop-blur-xl bg-white/5 border-2 border-dashed border-white/20 rounded-3xl hover:border-purple-500 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div
                  onClick={() => setActiveAddProduct(true)}
                  className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <Plus className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black mb-2">Add Product</h3>
                <p className="text-gray-400">Create a new item</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
