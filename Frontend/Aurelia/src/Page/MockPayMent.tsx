import { useNavigate, useParams } from "react-router-dom";
import { MockPayPal } from "../Components/MockPayment.tsx/Paypal";
import { CreditCardPayment } from "../Components/MockPayment.tsx/CreditCard";

export const MockPayMent = () => {
  const { id } = useParams();
  let data: React.ReactNode = null;
  const navigate=useNavigate()
  const handleClickClose=()=>{
    navigate(-1)
  }
  switch (id) {
    case "paypal":
      data = <MockPayPal onClose={handleClickClose} />;
      break;
    case "card":
      data = <CreditCardPayment onClose={handleClickClose} />;
      break;
    case "cod":
      data = <p>Thanh toán khi nhận hàng</p>;
      break;
    default:
      data = <p>Không tìm thấy phương thức thanh toán</p>;
      break;
  }

  return <>{data}</>;
};
