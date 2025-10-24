import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Measure } from "../types/type";
import axios from "axios";
import { api_Config, UseApiUrl } from "../types/api";
import toast from "react-hot-toast";


type AIMeasureContextType = {
  DataMeasure?: Measure;         
  postMeasureToDB:()=>{},  
  getAIAdviceMeasure:(ProductId:string,type:string,subCategory:string,SetStateAction:React.Dispatch<React.SetStateAction<string>>)=>{}
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
  const token=localStorage.getItem("token")
  const postMeasureToDB=async()=>{
    try{
      await axios.post(UseApiUrl(api_Config.User.UpdataMeasure),DataMeasure,{
        headers:{
          "Authorization":`Bearer ${token}`,
          "Content-Type":"application/json"
        }
      })
    }
    catch(error){
      toast.error("Khong The Them")
    }
  }
  useEffect(()=>{
    const fetch=async()=>{
      try{
        const data=await axios.get(UseApiUrl(api_Config.User.LaySoDo),{headers:{"Authorization":`Bearer ${token}`}})
        setDataMeasure(data.data)
      }
      catch{
        toast.error("Loi Load So Do")
      }
    }
    fetch()
  },[])
  const getAIAdviceMeasure=async(ProductId:string,type:string,subCategory:string,SetStateAction:React.Dispatch<React.SetStateAction<string>>)=>{
    try{
      const data=await axios.post(UseApiUrl(api_Config.AIAdvice.GetAdviceMeasure),{
        ProductId,
        type,
        subCategory
      },{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      })
      SetStateAction(data.data.message)
    }
    catch{
      toast.error("Fetch So Do Loi");
    }
  }
  return (
    <AiPoseMeasureContext.Provider value={{ DataMeasure, setDataMeasure,postMeasureToDB,getAIAdviceMeasure }}>
      {children}
    </AiPoseMeasureContext.Provider>
  );
};
export const useAiPoseMeasure = () => useContext(AiPoseMeasureContext);
