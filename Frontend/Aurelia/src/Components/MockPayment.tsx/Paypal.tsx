import { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../LoadingOverlay";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { api_Config, UseApiUrl } from "../../services/api";
import axios from "axios";

export const MockPayPal = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dataOrder, handleClickPayment, setCartDataAdd } =
    useContext(CartContext);
  const handlePay = async ({ orderId }: { orderId: string }) => {
    setLoading(true);
    const response = await axios.post(
      UseApiUrl(api_Config.User.PaypalPayment),
      {
        orderId: orderId,
        order: dataOrder,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status === 200) {
      handleClickPayment();
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 1500);
      setCartDataAdd([]);
    }
  };
  const totalAmount = dataOrder?.product?.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  return (
    <>
      <LoadingOverlay isLoading={loading} message="Đang xử lý thanh toán..." />
      <div className="flex justify-center mt-10">
        <PayPalScriptProvider
          options={{
            "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
            currency: "USD",
          }}
        >
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
            }}
            createOrder={(_, actions) => {
              const total = totalAmount || 0;

              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    description: `Thanh toán đơn hàng của ${dataOrder?.name || "Khách hàng"}`,
                    custom_id: dataOrder?.orderId?.toString() || "guest",
                    invoice_id: `INV_${Date.now()}`,
                    amount: {
                      currency_code: "USD",
                      value: total.toFixed(2),
                      breakdown: {
                        item_total: {
                          currency_code: "USD",
                          value: total.toFixed(2),
                        },
                      },
                    },
                    items: dataOrder?.product?.map((item) => ({
                      name: item.name,
                      unit_amount: {
                        currency_code: "USD",
                        value: item.price.toFixed(2),
                      },
                      quantity: item.quantity.toString(),
                    })),
                  },
                ],
              });
            }}
            onApprove={async (_, actions) => {
              const order = await actions?.order?.capture();
              await handlePay({ orderId: order?.id || "" });
              setCartDataAdd([]);
              navigate("/");
            }}
          />
        </PayPalScriptProvider>
      </div>
    </>
  );
};
