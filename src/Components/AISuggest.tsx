import { useContext, useEffect, useState } from "react";
import { AiPoseMeasureContext } from "../config/AIPoseMeasure";

type AiSuggestBoxProps = {
  productId: string;
  type: string;
  subcategory: string;
};

export const AiSuggestBox = ({ productId, type, subcategory }: AiSuggestBoxProps) => {
    const {getAIAdviceMeasure}=useContext(AiPoseMeasureContext)
    const [AIAdvice,setAIAdvice]=useState("");
    useEffect(()=>{
        getAIAdviceMeasure(productId,type,subcategory,setAIAdvice)
    },[productId])
  return (
    <div className=" border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white shadow-sm mb-4">
      <h2 className="font-heading text-lg font-medium mb-2 flex items-center gap-2">
        🤖 Gợi ý từ AI
      </h2>
      {AIAdvice ? (
        <p className="text-sm text-gray-700 leading-relaxed">
          {AIAdvice}
        </p>
      ) : (
        <p className="text-gray-400 text-sm">Đang phân tích số đo của bạn...</p>
      )}
    </div>
  );
};
