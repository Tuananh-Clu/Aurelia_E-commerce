import React, { useContext, useEffect, useRef, useState } from "react";
import { Pose, type Results } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { AiPoseMeasureContext } from "../../config/AIPoseMeasure";
import { useLocation } from "react-router-dom";

type MainCamera = {
  isCameraOn: boolean;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Main: React.FC<MainCamera> = ({ isCameraOn, setIsCameraOn }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [handOn, setHandOn] = useState(false);
  const { setDataMeasure } = useContext(AiPoseMeasureContext);
  const [popUp, setPopup] = useState(false);
  const [number, setNumber] = useState(3);
  const isCountingDownRef = useRef(false);
  const location = useLocation();

  const calculate3DDistance = (p1: any, p2: any) =>
    Math.sqrt(
      Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2) +
        Math.pow(p1.z - p2.z, 2)
    );

  const calculateDepthFromZ = (
    leftZ: number,
    rightZ: number,
    baseWidth: number
  ) => {
    const zDiff = Math.abs(leftZ - rightZ);
    let ratio = 0.8 + (zDiff > 0.03 ? zDiff * 2 : 0);
    ratio = Math.max(0.7, Math.min(1.0, ratio));
    return baseWidth * ratio;
  };

  const calculateEllipseCircumference = (width: number, depth: number) => {
    const a = width / 2;
    const b = depth / 2;
    const h = Math.pow((a - b) / (a + b), 2);
    return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  };

  const drawLandmarks = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    poseLandmarks: any[],
    w: number,
    h: number
  ) => {
    landmarks.forEach((l, i) => {
      const p = poseLandmarks[i];
      if (!p || !l) return;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, 5, 0, 2 * Math.PI);
      ctx.fillStyle = l.z > 0.02 ? "#f00" : l.z < -0.02 ? "#00f" : "#0f0";
      ctx.globalAlpha = Math.max(0.3, l.visibility || 0);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  };

  useEffect(() => {
    if (!isCameraOn || !videoRef.current || !canvasRef.current) return;

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: 2,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results: Results) => {
      const ctx = canvasRef.current!.getContext("2d")!;
      const width = canvasRef.current!.width;
      const height = canvasRef.current!.height;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(videoRef.current!, 0, 0, width, height);

      if (!results.poseWorldLandmarks || results.poseWorldLandmarks.length < 33)
        return;

      drawLandmarks(
        ctx,
        results.poseWorldLandmarks,
        results.poseLandmarks!,
        width,
        height
      );

      const [
        head,
        leftFoot,
        rightFoot,
        shoulderLeft,
        shoulderRight,
        leftHip,
        rightHip,
      ] = [
        results.poseWorldLandmarks[0],
        results.poseWorldLandmarks[31],
        results.poseWorldLandmarks[32],
        results.poseWorldLandmarks[11],
        results.poseWorldLandmarks[12],
        results.poseWorldLandmarks[23],
        results.poseWorldLandmarks[24],
      ];

      const rightHand = results.poseLandmarks?.[16];
      const handInBox =
        rightHand.x > 0.2 &&
        rightHand.x < 0.56 &&
        rightHand.y > 0.41 &&
        rightHand.y < 0.78;

      setHandOn(handInBox); // để cập nhật màu khung
      ctx.strokeStyle = handInBox ? "#00FF00" : "#FF0000";
      ctx.lineWidth = 4;
      ctx.strokeRect(0.2 * width, 0.3 * height, 150, 150);


      if ( isCountingDownRef.current || !handInBox) return;

      isCountingDownRef.current = true;
      setNumber(3);
      setPopup(true);

      const countdown = setInterval(() => {
        setNumber((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setPopup(false);
            isCountingDownRef.current = false;

            const shoulderWidth = calculate3DDistance(
              shoulderLeft,
              shoulderRight
            );
            const shoulderDepth = calculateDepthFromZ(
              shoulderLeft.z,
              shoulderRight.z,
              shoulderWidth
            );
            const chest =
              calculateEllipseCircumference(shoulderWidth, shoulderDepth) * 100;

            const hipWidth = calculate3DDistance(leftHip, rightHip);
            const hipDepth = calculateDepthFromZ(
              leftHip.z,
              rightHip.z,
              hipWidth
            );
            const hip =
              calculateEllipseCircumference(hipWidth, hipDepth) * 100 * 1.55;

            const leftWaist = {
              x: shoulderLeft.x * 0.3 + leftHip.x * 0.7,
              y: shoulderLeft.y * 0.3 + leftHip.y * 0.7,
              z: shoulderLeft.z * 0.3 + leftHip.z * 0.7,
            };
            const rightWaist = {
              x: shoulderRight.x * 0.3 + rightHip.x * 0.7,
              y: shoulderRight.y * 0.3 + rightHip.y * 0.7,
              z: shoulderRight.z * 0.3 + rightHip.z * 0.7,
            };
            const waistWidth = calculate3DDistance(leftWaist, rightWaist);
            const waistDepth = calculateDepthFromZ(
              leftWaist.z,
              rightWaist.z,
              waistWidth
            );
            const waist =
              calculateEllipseCircumference(waistWidth, waistDepth) *
              100 *
              1.35;

            const heightCm = (Math.max(leftFoot.y, rightFoot.y) - head.y) * 100;
            setDataMeasure({
              vai: (shoulderWidth * 1.56 * 100).toFixed(1),
              nguc: chest.toFixed(1),
              eo: waist.toFixed(1),
              hong: hip.toFixed(1),
              chieuCao: heightCm.toFixed(1),
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });
    let cameraInstance: Camera | null = null;
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        const camera = new Camera(videoRef.current!, {
          onFrame: async () => await pose.send({ image: videoRef.current! }),
          width: 1280,
          height: 720,
        });
        cameraInstance = camera;
        camera.start();
      });

    return () => {
      cameraInstance?.stop();
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current!.srcObject = null;
      }
    };
  }, [isCameraOn, location]);

  return (
    <div className="relative w-[1300px] h-[700px] p-9 overflow-hidden rounded-3xl shadow-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
      <video
        ref={videoRef}
        className="hidden"
        autoPlay
        playsInline
        width={1200}
        height={800}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-3xl object-cover"
        width={1200}
        height={800}
      />
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
  );
};
