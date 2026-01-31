import { useContext, useEffect, useState } from "react";
import { AiPoseMeasureContext } from "@/Providers/AIPoseMeasure";
import { AuthContext } from "@/Providers/Author";
import type { AIAdvice, AiSuggestBoxProps } from "../types";

export function useAISuggest({ productId, type, subcategory }: AiSuggestBoxProps) {
  const { getAIAdviceMeasure } = useContext(AiPoseMeasureContext);
  const { isSignned } = useContext(AuthContext);
  const [AIAdvice, setAIAdvice] = useState<AIAdvice>({
    message: "",
    note: "",
    size: "",
  });

  useEffect(() => {
    if (isSignned === false) return;
    getAIAdviceMeasure(productId, type, subcategory, setAIAdvice);
  }, [productId, type, subcategory, isSignned, getAIAdviceMeasure]);

  return { AIAdvice };
}
