import React from 'react';
import type { order } from '../../../../types/type';

interface RecentActivityProps {
  orders: order[];
  setActiveItem: React.Dispatch<React.SetStateAction<string>> | undefined;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ orders, setActiveItem }) => {
  return (
    <div className="lg:col-span-2">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-medium">
          Recent Activity
        </h3>
        <button 
          onClick={() => setActiveItem && setActiveItem("recentOrder")}
          className="text-xs uppercase tracking-widest  underline decoration-1 underline-offset-4 hover:text-primary transition-colors"
        >
          View All
        </button>
      </div>
      <div className="w-full">
        {orders.slice(0, 5).map((order) => (
          <div
            key={order.orderId}
            className="group flex items-center justify-between py-6 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors px-2 -mx-2 rounded-sm"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-text-main dark:text-white">
                Order #{order.orderId}
              </span>
              <span className="text-xs text-gray-500 font-light">
                {order.ngayTaoDon}
              </span>
            </div>
            <div className="flex items-center gap-8 text-right">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                {order.status}
              </span>
              <span className="text-sm font-display text-text-main dark:text-white w-20">
                ${order.product.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};