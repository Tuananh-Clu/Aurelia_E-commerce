import { useContext, useState, useEffect } from "react";
import { DashBoardMeasures } from "../Components/AiModelBodySize/DashBoardMesuares";
import { Main } from "../Components/AiModelBodySize/Main";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { AiPoseMeasureContext } from "../contexts/AIPoseMeasure";

export const BodySize = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const { DataMeasure, postMeasureToDB } = useContext(AiPoseMeasureContext);
  const [safeData, setSafeData] = useState(false);

  useEffect(() => {
    if (safeData) {
      postMeasureToDB();
      setSafeData(false);
    }
  }, [safeData, postMeasureToDB]);

  return (
    <>
      <Navbar />
      <div
        className="   mt-18
  px-4 md:px-8
  flex flex-col lg:flex-row
items-center
  gap-10
  mb-10"
      >
        <Main isCameraOn={isCameraOn} setIsCameraOn={setIsCameraOn} />
        <DashBoardMeasures
          setIsCameraOn={setIsCameraOn}
          iscameraOn={isCameraOn}
          datas={DataMeasure}
          setDatas={setSafeData}
        />
      </div>
    </>
  );
};
