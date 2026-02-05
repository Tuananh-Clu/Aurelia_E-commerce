export const OrderCard = ({
  order,
  calcOrderTotal,
  formatDate,
  huyDonHang,
  navigate,
}: any) => {
  return (
    <div
      className="
        border border-neutral-200
        bg-white
        p-6
        flex flex-col md:flex-row
        gap-6
        transition
        hover:border-neutral-300
      "
    >
      <img
        src={order.product[0]?.thumnail}
        alt="Product"
        className="w-24 h-24 object-cover"
      />

      <div className="flex-1 space-y-1">
        <p className="text-xs tracking-widest uppercase text-neutral-400">
          Order #{order.orderId}
        </p>

        <p className="text-sm text-neutral-600">
          Ngày đặt · {formatDate(Number(order.ngayTaoDon))}
        </p>

        <p className="text-lg font-light text-neutral-900 mt-2">
          {calcOrderTotal(order).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <span className="text-xs tracking-widest uppercase text-neutral-500">
          {order.status}
        </span>

        <div className="flex gap-6 mt-4">
          {order.status === "Chờ Xác Nhận" && (
            <button
              onClick={() => huyDonHang(order.orderId)}
              className="text-xs tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition"
            >
              Hủy đơn
            </button>
          )}

          <button
            onClick={() => navigate(`/orders/${order.orderId}`)}
            className="text-xs tracking-widest uppercase text-neutral-900 border-b border-neutral-900"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};
