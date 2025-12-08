import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react";
import type { Measure } from "../types/type";
import axios from "axios";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";


type AIMeasureContextType = {
  DataMeasure: Measure ;         
  postMeasureToDB:()=>Promise<void>,  
  getAIAdviceMeasure:(ProductId:string,type:string,subCategory:string,SetStateAction:React.Dispatch<React.SetStateAction<string>>)=>Promise<void>
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
  const token = useMemo(() => localStorage.getItem("token"), []);
  const fetch=async()=>{
      try{
        const data=await axios.get(UseApiUrl(api_Config.User.LaySoDo),{
          headers:{"Authorization":`Bearer ${token}`}
        });
        setDataMeasure(data.data);
      }
      catch(error){ 
      }
    }
  useEffect(()=>{
    if(!token) return;
    fetch();
  }, [token]);

  const postMeasureToDB = useCallback(async()=>{
    if (!DataMeasure || !token) return;
    try{
      await axios.post(UseApiUrl(api_Config.User.UpdataMeasure),DataMeasure,{
        headers:{
          "Authorization":`Bearer ${token}`,
          "Content-Type":"application/json"
        }
      });
      localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user") || "{}"), soDoNguoiDung: DataMeasure }));
      Toaster.success("Đã lưu số đo thành công!");
    }
    catch(error){
      Toaster.error("Không thể lưu số đo. Vui lòng thử lại.");
    }
  }, [DataMeasure, token]);

  const getAIAdviceMeasure = useCallback(async(
    ProductId:string,
    type:string,
    subCategory:string,
    SetStateAction:React.Dispatch<React.SetStateAction<string>>
  )=>{
    if (!token) return;
    try{
      const data=await axios.post(UseApiUrl(api_Config.AIAdvice.GetAdviceMeasure),{
        ProductId,
        type,
        subCategory
      },{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      SetStateAction(data.data.message);
    }
    catch{
      Toaster.error("Không thể lấy gợi ý size. Vui lòng thử lại.");
    }
  }, [token]);

  const contextValue = useMemo(() => ({
    DataMeasure,
    setDataMeasure,
    postMeasureToDB,
    getAIAdviceMeasure
  }), [DataMeasure, postMeasureToDB, getAIAdviceMeasure]);

  return (
    <AiPoseMeasureContext.Provider value={contextValue}>
      {children}
    </AiPoseMeasureContext.Provider>
  );
};
export const useAiPoseMeasure = () => useContext(AiPoseMeasureContext);
