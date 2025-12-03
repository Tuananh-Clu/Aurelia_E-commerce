import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react";
import type { Measure } from "../types/type";
import axios from "axios";
import { api_Config, UseApiUrl } from "../services/api";
import toast from "react-hot-toast";
import { AuthContext } from "./Author";


type AIMeasureContextType = {
  DataMeasure?: Measure;         
  postMeasureToDB:()=>Promise<void>,  
  getAIAdviceMeasure:(ProductId:string,type:string,subCategory:string,SetStateAction:React.Dispatch<React.SetStateAction<string>>)=>Promise<void>
  setDataMeasure: React.Dispatch<React.SetStateAction<Measure | undefined>>; 
};

export const AiPoseMeasureContext = createContext<AIMeasureContextType>({
  DataMeasure: undefined,
  getAIAdviceMeasure:async()=>{},
  postMeasureToDB:async()=>{},
  setDataMeasure: () => {},
});

type AiPoseMeasureProviderProps = {
  children: ReactNode;
};

export const AiPoseMeasureProvider: React.FC<AiPoseMeasureProviderProps> = ({ children }) => {
  const [DataMeasure, setDataMeasure] = useState<Measure>();
  const {isSignned}=useContext(AuthContext);
  
  // Memoize token to avoid reading from localStorage on every render
  const token = useMemo(() => localStorage.getItem("token"), []);
  
  // Memoize postMeasureToDB to prevent recreation
  const postMeasureToDB = useCallback(async()=>{
    if (!DataMeasure || !token) return;
    try{
      await axios.post(UseApiUrl(api_Config.User.UpdataMeasure),DataMeasure,{
        headers:{
          "Authorization":`Bearer ${token}`,
          "Content-Type":"application/json"
        }
      });
      toast.success("Đã lưu số đo thành công");
    }
    catch(error){
      toast.error("Không thể lưu số đo");
    }
  }, [DataMeasure, token]);

  useEffect(()=>{
    if(isSignned===false || !token) return;
    const fetch=async()=>{
      try{
        const data=await axios.get(UseApiUrl(api_Config.User.LaySoDo),{
          headers:{"Authorization":`Bearer ${token}`}
        });
        setDataMeasure(data.data);
      }
      catch{
        // Silent fail - user might not have measurements yet
      }
    }
    fetch();
  }, [isSignned, token]);

  // Memoize getAIAdviceMeasure
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
      toast.error("Không thể lấy gợi ý size");
    }
  }, [token]);

  // Memoize context value to prevent unnecessary re-renders
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
