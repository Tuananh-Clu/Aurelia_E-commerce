using System.Text.Json.Serialization;

namespace AureliaE_Commerce.Common
{

    public class ApiResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;

        public static ApiResponse SuccessResponse(string message = "Success") =>
            new ApiResponse { IsSuccess = true, Message = message };

        public static ApiResponse Success(string message = "Success") =>
            SuccessResponse(message);

        public static ApiResponse Error(string message = "Error") =>
            new ApiResponse { IsSuccess = false, Message = message };
    }

    public class ApiResponse<T> : ApiResponse
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public T? Data { get; set; }

        public static ApiResponse<T> SuccessResponse(T data, string message = "Success") =>
            new ApiResponse<T> { IsSuccess = true, Message = message, Data = data };

        public new static ApiResponse<T> Error(string message = "Error") =>
            new ApiResponse<T> { IsSuccess = false, Message = message, Data = default };
    }
}

