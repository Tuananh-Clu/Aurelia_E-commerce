import React from "react";
import Icon from "./icon";

const BestSeller: React.FC<{ TOP_PRODUCTS: any[] }> = ({ TOP_PRODUCTS }) => {
  return (
    <div className="bg-white dark:bg-dark-surface p-8 shadow-xl h-full">
      <div className="flex items-center gap-2 mb-8">
        <Icon name="Star" className="" size={20} />
        <h4 className="serif text-xl font-normal ">
          Sản phẩm bán chạy
        </h4>
      </div>

      <div className="space-y-6">
        {TOP_PRODUCTS.map((product, i) => (
          <div
            key={product.id}
            className="flex items-center gap-4 group cursor-pointer"
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
              <div className="flex justify-between items-start">
                <h5 className="text-[11px] font-bold  truncate uppercase tracking-tight">
                  {product.name}
                </h5>
                <span
                  className={`text-[10px] font-bold ${product.sales > 0 ? "text-primary dark:text-white" : "text-accent"}`}
                >
                  {product.price}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-[9px] font-bold text-accent uppercase tracking-[0.15em]">
                  {product.type}
                </p>
                <p className="text-[9px] text-accent font-medium">
                  {product.sold} đã bán
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
