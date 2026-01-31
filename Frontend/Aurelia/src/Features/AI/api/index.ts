
import { api_Url, UseApiUrl } from "@/services/api";

const User = {
  LaySoDo: "/api/Client/GetSoDo",
  UpdataMeasure: "/api/Client/UpMeasure",
};

const AIAdvice = {
  GetAdviceMeasure: "/api/GetAIAdvice/GetAdviceSize",
};

export const aiApi = {
  User,
  AIAdvice,
};

export { api_Url, UseApiUrl };
