import React from "react";
import { ArrowBigLeftDashIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useMainCamera } from "../hook/useMainCamera";
import type { MainCameraProps } from "../types";

export const Main: React.FC<MainCameraProps> = (props) => {
  const {
    videoRef,
    canvasRef,
    popUp,
    number,
    appearText,
    setAppearText,
    navigate,
    isMobile,
    setIsCameraOn,
    isCameraOn,
  } = useMainCamera(props);

  return (
    <>
      <div className="fixed top-20 left-3 z-50">
        <motion.button
          transition={{ type: "spring", stiffness: 300 }}
          onHoverStart={() => setAppearText(true)}
          onHoverEnd={() => setAppearText(false)}
          onClick={() => navigate(-1)}
          className="
      flex items-center gap-2
      px-4 py-2
      rounded-xl
      bg-white/30
      backdrop-blur-md
      shadow-lg
      border border-white/40
      text-gray-800 font-medium
      hover:bg-white/40
      active:scale-95
      transition
      cursor-pointer
    "
        >
          <ArrowBigLeftDashIcon className="w-5 h-5" />
          {appearText && <span>Quay Lại</span>}
        </motion.button>
      </div>

      <div className="flex flex-col items-center text-center justify-center md:hidden mb-4 w-full">
        <h2 className="text-xl font-bold text-gray-800">
          Bảng Thông Số Cơ Thể
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Vui lòng đứng trước khung hình
        </p>
      </div>
      <div className="relative    md:w-[1000px] md:h-[840px] h-[400px] sm:w-[700px] w-[400px]    rounded-3xl shadow-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100   ">
        <video
          ref={videoRef}
          className="hidden"
          autoPlay
          playsInline
          width={isMobile ? 400 : 2000}
          height={isMobile ? 400 : 2000}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-3xl object-cover"
          width={isMobile ? 400 : 2000}
          height={isMobile ? 400 : 2000}
        />
        <div className="flex w-full  items-center justify-center  md:hidden absolute bottom-0 left-0 z-40 right-0 ">
          <button
            onClick={() => setIsCameraOn(true)}
            className="bg-black/50 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full shadow"
          >
            Bắt Đầu Đo
          </button>
        </div>

        <div className="absolute top-4 left-4">
          <button
            onClick={() => setIsCameraOn((prev) => !prev)}
            className="bg-black/50 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full shadow"
          >
            {isCameraOn ? "Tắt Camera" : "Bật Camera"}
          </button>
        </div>
        {popUp && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-white text-6xl font-bold">{number}</h1>
          </div>
        )}
      </div>
    </>
  );
};
