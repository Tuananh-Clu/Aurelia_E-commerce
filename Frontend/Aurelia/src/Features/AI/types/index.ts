import type React from "react";

/** AI (Camera measure) feature types - copy from shared where used */

export type Measure = {
  vai: string;
  nguc: string;
  eo: string;
  hong: string;
  chieuCao: string;
};

export type AIAdvice = {
  message: string;
  note: string;
  size: string;
};

export type AiSuggestBoxProps = {
  productId: string;
  type: string;
  subcategory: string;
};

export type MainCameraProps = {
  isCameraOn: boolean;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
};

export type MeasureItem = {
  label: string;
  value?: string;
  icon: React.ReactNode;
  unit: string;
};

export type MeasuresProps = {
  iscameraOn: boolean;
  setDatas: React.Dispatch<React.SetStateAction<boolean>>;
  datas?: Measure;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
};
