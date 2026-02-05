import React from "react";
import type { Cart } from "../../types/type";

interface OrderItemsTableProps {
  items: Cart[];
}

export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
  return (
    <div className="bg-white dark:bg-[#1A202C] rounded border border-[#dbdfe6] dark:border-gray-700 overflow-hidden mb-12 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-[#dbdfe6] dark:border-gray-700">
            <tr>
              <th className="py-4 px-6 text-xs uppercase tracking-wider font-semibold text-[#616f89] dark:text-gray-400 w-[45%]">
                Product
              </th>
              <th className="py-4 px-6 text-xs uppercase tracking-wider font-semibold text-[#616f89] dark:text-gray-400">
                Price
              </th>
              <th className="py-4 px-6 text-xs uppercase tracking-wider font-semibold text-[#616f89] dark:text-gray-400 text-center">
                Qty
              </th>
              <th className="py-4 px-6 text-xs uppercase tracking-wider font-semibold text-[#616f89] dark:text-gray-400 text-right">
                Total
              </th>
              <th className="py-4 px-6 text-xs uppercase tracking-wider font-semibold text-[#616f89] dark:text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dbdfe6] dark:divide-gray-700">
            {items.map((item) => (
              <tr
                key={item.itemid}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-6 px-6">
                  <div className="flex gap-6">
                    <div className="w-20 h-28 flex-shrink-0 rounded bg-gray-200 overflow-hidden relative">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${item.thumnail}')` }}
                        title={item.name}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-serif text-lg font-bold text-[#111318] dark:text-white mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-[#616f89] dark:text-gray-400">
                        Color: {item.color}
                      </p>
                      <p className="text-sm text-[#616f89] dark:text-gray-400">
                        Size: {item.size}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-6 text-sm font-medium text-[#111318] dark:text-white">
                  ${item.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                </td>
                <td className="py-6 px-6 text-sm font-medium text-[#111318] dark:text-white text-center">
                  {item.quantity}
                </td>
                <td className="py-6 px-6 text-sm font-bold text-[#111318] dark:text-white text-right">
                  $
                  {(item.price * item.quantity)
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                </td>
                <td className="py-6 px-6 text-right">
                  {item.itemid.includes("1") ? (
                    <button className="text-sm font-bold  hover:text-primary/80 transition-colors">
                      Track Item
                    </button>
                  ) : (
                    <button className="text-sm font-bold text-[#616f89] hover:text-[#111318] dark:hover:text-white transition-colors">
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
