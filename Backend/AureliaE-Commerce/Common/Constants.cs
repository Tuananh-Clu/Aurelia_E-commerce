namespace AureliaE_Commerce.Common
{
    public static class Constants
    {
        public const int BCRYPT_WORK_FACTOR = 12;
        public const int JWT_EXPIRATION_DAYS = 7;
        
        public static class UserTiers
        {
            public const string BRONZE = "Bronze";
            public const string SILVER = "Silver";
            public const string GOLD = "Gold";
            public const string PLATINUM = "Platinum";
        }

        public static class ErrorMessages
        {
            public const string INVALID_INPUT = "Dữ liệu đầu vào không hợp lệ";
            public const string NOT_FOUND = "Không tìm thấy dữ liệu";
            public const string UNAUTHORIZED = "Không có quyền truy cập";
            public const string INTERNAL_ERROR = "Đã xảy ra lỗi hệ thống";
            public const string EMAIL_EXISTS = "Email này đã được đăng ký";
            public const string INVALID_CREDENTIALS = "Email hoặc mật khẩu không đúng";
        }

        public static class SuccessMessages
        {
            public const string CREATED = "Tạo thành công";
            public const string UPDATED = "Cập nhật thành công";
            public const string DELETED = "Xóa thành công";
            public const string LOGIN_SUCCESS = "Đăng nhập thành công";
            public const string REGISTER_SUCCESS = "Đăng ký thành công";
        }
    }
}


