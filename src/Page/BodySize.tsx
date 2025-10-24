
import { useContext, useState } from 'react'
import { DashBoardMeasures } from '../Components/AiModelBodySize/DashBoardMesuares'
import { Main } from '../Components/AiModelBodySize/Main'
import { Navbar } from '../Components/HomeComponent/Navbar'
import { AiPoseMeasureContext } from '../config/AIPoseMeasure'


export const BodySize = () => {
  const [isCameraOn,setIsCameraOn]=useState(false);
  const {DataMeasure,postMeasureToDB}=useContext(AiPoseMeasureContext);
  const [safeData,setSafeData]=useState(false);
  if(safeData)
  {
    postMeasureToDB()
    setSafeData(false)
  }
  return (
    <>
    <Navbar/>
    <div className='mt-20 px-20 flex flex-row items-center'>
          <Main isCameraOn={isCameraOn} setIsCameraOn={setIsCameraOn}  />
          <DashBoardMeasures setIsCameraOn={setIsCameraOn} iscameraOn={isCameraOn} datas={DataMeasure} setDatas={setSafeData}/>
    </div>
    </>
  )
}
