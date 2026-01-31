import { CheckCircle2, XCircle } from "lucide-react";

export const NotifySuccessBooking = ({
  data,
  status,
}: {
  data: string | undefined;
  status: string;
}) => {
  const isSuccess = status === "Thêm Lịch Hẹn Thành Công!";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center animate-fadeIn">
        {isSuccess ? (
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
        ) : (
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
        )}

        <h1
          className={`text-2xl font-bold mb-4 ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </h1>

        {isSuccess ? (
          <p className="text-gray-600 leading-relaxed">
            Cảm ơn bạn đã đặt lịch tại{" "}
            <span className="font-semibold text-gray-800">{data}</span>.
            <br />
            Chúng tôi sẽ liên hệ xác nhận trong vòng{" "}
            <span className="text-purple-600 font-semibold">30 phút</span>.
          </p>
        ) : (
          <p className="text-gray-600 leading-relaxed">
            Rất tiếc, hệ thống không thể tạo lịch hẹn của bạn tại{" "}
            <span className="font-semibold text-gray-800">{data}</span>.
            <br />
            Vui lòng thử lại sau hoặc liên hệ trực tiếp qua{" "}
            <span className="text-purple-600 font-semibold">hotline</span> để
            được hỗ trợ.
          </p>
        )}

        <div className="mt-8">
          <button
            onClick={() => window.location.href = "/"}
            className={`px-6 py-3 rounded-xl shadow-md transition-all ${
              isSuccess
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {isSuccess ? "Quay lại Trang Chủ" : "Thử lại"}
          </button>
        </div>
      </div>
    </div>
  );
};
