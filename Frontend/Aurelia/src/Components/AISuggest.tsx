import { useContext, useEffect, useState} from "react";
import { AiPoseMeasureContext } from "../contexts/AIPoseMeasure";
import { AuthContext } from "../contexts/Author";

type AiSuggestBoxProps = {
  productId: string;
  type: string;
  subcategory: string;
};
export const AiSuggestBox = ({ productId, type, subcategory }: AiSuggestBoxProps) => {
    const {getAIAdviceMeasure}=useContext(AiPoseMeasureContext)
    const [AIAdvice,setAIAdvice]=useState<{message:string,note:string,size:string}>({message:"",note:"",size:""});
    const {isSignned}=useContext(AuthContext)
    useEffect(()=>{
      if(isSignned===false) return; 
        getAIAdviceMeasure(productId,type,subcategory,setAIAdvice)
    },[productId])
  return (
<div className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
  <h2 className="text-sm font-semibold text-gray-900 mb-2">
    AI Size Recommendation
  </h2>

  {AIAdvice ? (
    <div className="space-y-1 text-sm text-gray-700">
      {AIAdvice.size && (
        <div>
          <span className="text-gray-500">Recommended size:</span>{" "}
          <span className="font-medium text-gray-900">
            {AIAdvice.size}
          </span>
        </div>
      )}

      {AIAdvice.message && (
        <p className="text-gray-600">
          {AIAdvice.message}
        </p>
      )}

      {AIAdvice.note && (
        <p className="text-xs text-gray-500">
          {AIAdvice.note}
        </p>
      )}
    </div>
  ) : (
    <p className="text-sm text-gray-400">
      Analyzing your measurements…
    </p>
  )}
</div>

  );
};
