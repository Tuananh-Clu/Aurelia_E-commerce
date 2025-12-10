import { CreditCard, Truck, Wallet } from "lucide-react";
import { motion } from "framer-motion";

type PaymentOptionsProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const paymentOptions = [
  {
    value: "cod",
    label: "Thanh toán khi nhận hàng",
    icon: <Truck size={32} className="text-gray-700" />,
  },
  {
    value: "card",
    label: "Thẻ tín dụng / ghi nợ",
    icon: <CreditCard size={32} className="text-gray-700" />,
  },
  {
    value: "paypal",
    label: "PayPal",
    icon: <Wallet size={32} className="text-gray-700" />,
  },
];

export const PaymentOptions = ({ value, onChange }: PaymentOptionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      {paymentOptions.map((opt) => (
        <motion.label
          key={opt.value}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex flex-col items-center justify-center gap-3 border rounded-2xl p-6 cursor-pointer transition ${
            value === opt.value
              ? "border-black bg-gray-50 shadow-md"
              : "border-gray-300 hover:border-gray-500"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            className="hidden"
          />
          {opt.icon}
          <span className="text-sm font-medium text-gray-800 text-center">
            {opt.label}
          </span>
        </motion.label>
      ))}
    </div>
  );
};
