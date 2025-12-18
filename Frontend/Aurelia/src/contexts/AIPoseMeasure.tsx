import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react";
import type { Measure } from "../types/type";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";
import { api_Response } from "../services/http";
import { AuthContext } from "./Author";


type AIMeasureContextType = {
  DataMeasure: Measure ;         
  postMeasureToDB:()=>Promise<void>,  
  getAIAdviceMeasure:(ProductId:string,type:string,subCategory:string,SetStateAction:React.Dispatch<React.SetStateAction<{message:string,note:string,size:string}>>)=>Promise<void>
  setDataMeasure: React.Dispatch<React.SetStateAction<Measure>>; 
};

export const AiPoseMeasureContext = createContext<AIMeasureContextType>({
  DataMeasure: {} as Measure,

  getAIAdviceMeasure:async()=>{},
  postMeasureToDB:async()=>{},
  setDataMeasure: () => {},
});

type AiPoseMeasureProviderProps = {
  children: ReactNode;
};

export const AiPoseMeasureProvider: React.FC<AiPoseMeasureProviderProps> = ({ children }) => {
  const [DataMeasure, setDataMeasure] = useState<Measure>({} as Measure);
  const {userData}=useContext(AuthContext)

  const fetch = useCallback(async () => {
    try {
      const res = await api_Response(UseApiUrl(api_Config.User.LaySoDo), "GET", null, {
        "withCredentials": true,
      });
      if (res && res as Measure) {
        setDataMeasure(res as Measure);
      }
    } catch (error) {
      console.error("Error fetching user measurements:", error);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [userData, fetch]);

  const postMeasureToDB = useCallback(async()=>{
    if (!DataMeasure ) return;
    try{
      api_Response(UseApiUrl(api_Config.User.UpdataMeasure), "POST", DataMeasure, {
        "withCredentials": true,
      });
      setDataMeasure(DataMeasure);
      Toaster.success("Đã lưu số đo thành công!");
    }
    catch(error){
      Toaster.error("Không thể lưu số đo. Vui lòng thử lại.");
    }
  }, [DataMeasure]);

  const getAIAdviceMeasure = useCallback(async(
    ProductId:string,
    type:string,
    subCategory:string,
    SetStateAction:React.Dispatch<React.SetStateAction<{message:string,note:string,size:string}>>
  )=>{
    if (!ProductId || !type || !subCategory) return;
    try{
    const res:any=await api_Response(UseApiUrl(api_Config.AIAdvice.GetAdviceMeasure)
        ,"POST",{
        productId:ProductId,
        type:type,
        subCategory:subCategory
    },{
      "withCredentials": true,
    });
    SetStateAction({message:res.message,note:res.note,size:res.size});
  }
    catch{
      Toaster.error("Không thể lấy gợi ý size. Vui lòng thử lại.");
    }
  }, []);
;
  const contextValue = useMemo(() => ({
    DataMeasure,
    setDataMeasure,
    postMeasureToDB,
    getAIAdviceMeasure,
  }), [DataMeasure, postMeasureToDB, getAIAdviceMeasure]);

  return (
    <AiPoseMeasureContext.Provider value={contextValue}>
      {children}
    </AiPoseMeasureContext.Provider>
  );
};
export const useAiPoseMeasure = () => useContext(AiPoseMeasureContext);
