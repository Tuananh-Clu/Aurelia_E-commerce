import { useContext, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export const MockPayPal = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const {dataOrder,handleClickPayment,setCartDataAdd}=useContext(CartContext)
  const handlePay = () => {
    setLoading(true);
     handleClickPayment()
    setTimeout(() => {
      setLoading(false);
      navigate("/")
    }, 1500);
    setCartDataAdd([])
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <img
            src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-color.svg"
            alt="PayPal"
            className="h-8"
          />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Thanh toán bằng PayPal
            </h2>
            <p className="text-sm text-gray-500">
              Bạn đang thanh toán đơn hàng:
            </p>
            <div className="mt-3 border rounded-lg p-3">
              <p className="font-medium">{dataOrder?.product[0].name}</p>
              <p className="text-blue-600 font-bold text-xl mt-1">
                {dataOrder?.product[0].price}
              </p>
            </div>
          </div>

          {/* Mock login form */}
          <div className="space-y-3">
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Email PayPal"
                className="w-full outline-none text-sm"
              />
            </div>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#0070BA] hover:bg-[#005EA6] disabled:bg-blue-300 text-white py-3 rounded-full font-semibold text-base shadow-md transition-colors"
          >
            {loading ? (
              <span className="animate-pulse">Đang xử lý...</span>
            ) : (
              <>
                <img
                  src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-color.svg"
                  alt="pp"
                  className="h-5"
                />
                Thanh toán bằng PayPal
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
