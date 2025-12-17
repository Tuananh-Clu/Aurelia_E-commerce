import { api_Response } from "./http";
import { api_Config, UseApiUrl } from "./api";
import { Toaster } from "react-hot-toast";

export const MethodForgotPassword = async (Email: string) => {
  api_Response(UseApiUrl(api_Config.Password.ResetPassWord), "POST", Email, {
    "Content-Type": "application/json",
    withCredentials: true,
  });
};

export const MethodChangePassWord = async (
  Email: string | undefined,
  Token: string | undefined,
  NewPassWord: string | undefined
) => {
  try {
    const response: any = await api_Response(
      UseApiUrl(api_Config.Password.ChangePassWord),
      "POST",
      { email: Email, token: Token, newPassword: NewPassWord },
      {
        "Content-Type": "application/json",
        withCredentials: true,
      }
    );

    Toaster(response.message);
  } catch (error) {
    console.error(error);
  }
};
