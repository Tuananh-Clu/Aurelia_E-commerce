import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Pose, type Results } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { AiPoseMeasureContext } from "../../contexts/AIPoseMeasure";
import { ArrowBigLeftDashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type MainCamera = {
  isCameraOn: boolean;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
};

const calculate3DDistance = (
  p1: { x: number; y: number; z: number },
  p2: { x: number; y: number; z: number }
) => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

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

export const Main: React.FC<MainCamera> = ({ isCameraOn, setIsCameraOn }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { setDataMeasure } = useContext(AiPoseMeasureContext);
  const [popUp, setPopup] = useState(false);
  const [number, setNumber] = useState(3);
  const [appearText, setAppearText] = useState(false);
  const isCountingDownRef = useRef(false);
  const countdownIntervalRef = useRef<number | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraInstanceRef = useRef<Camera | null>(null);

  const navigate = useNavigate();
  const drawLandmarks = useCallback(
    (
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
    },
    []
  );

  const handleResults = useCallback(
    (results: Results) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Use requestAnimationFrame for smoother rendering
      requestAnimationFrame(() => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(video, 0, 0, width, height);

        if (
          !results.poseWorldLandmarks ||
          results.poseWorldLandmarks.length < 33
        )
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
        if (!rightHand) return;

        const handInBox =
          rightHand.x > 0.2 &&
          rightHand.x < 0.56 &&
          rightHand.y > 0.41 &&
          rightHand.y < 0.78;

        ctx.strokeStyle = handInBox ? "#00FF00" : "#FF0000";
        ctx.lineWidth = 4;
        ctx.strokeRect(0.2 * width, 0.3 * height, 150, 150);

        if (isCountingDownRef.current || !handInBox) return;

        isCountingDownRef.current = true;
        setNumber(3);
        setPopup(true);

        // Clear any existing interval
        if (countdownIntervalRef.current !== null) {
          clearInterval(countdownIntervalRef.current);
        }

        countdownIntervalRef.current = window.setInterval(() => {
          setNumber((prev) => {
            if (prev <= 1) {
              if (countdownIntervalRef.current !== null) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
              }
              setPopup(false);
              isCountingDownRef.current = false;

              // Calculate measurements
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
                calculateEllipseCircumference(shoulderWidth, shoulderDepth) *
                100;

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

              const heightCm =
                (Math.max(leftFoot.y, rightFoot.y) - head.y) * 100;
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
    },
    [drawLandmarks, setDataMeasure]
  );

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

    pose.onResults(handleResults);
    poseRef.current = pose;
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then((stream) => {
        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && poseRef.current) {
              await poseRef.current.send({ image: videoRef.current });
            }
          },
          width: 1280,
          height: 720,
        });
        cameraInstanceRef.current = camera;
        camera.start();
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });

    return () => {
      // Cleanup interval
      if (countdownIntervalRef.current !== null) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }

      // Stop camera
      if (cameraInstanceRef.current) {
        cameraInstanceRef.current.stop();
        cameraInstanceRef.current = null;
      }

      // Stop media stream
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }

      // Close pose
      if (poseRef.current) {
        poseRef.current.close();
        poseRef.current = null;
      }
    };
  }, [isCameraOn, handleResults]);

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

      <div className="flex flex-col items-center text-center md:hidden mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Bảng Thông Số Cơ Thể
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Vui lòng đứng trước khung hình
        </p>
      </div>
      <div className="relative md:w-[1300px] md:h-[700px] h-[400px] sm:w-[700px] w-[400px] p-12 mt-10 overflow-hidden rounded-3xl shadow-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <video
          ref={videoRef}
          className="hidden"
          autoPlay
          playsInline
          width={1300}
          height={900}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-3xl object-cover"
          width={1300}
          height={900}
        />
        <div className="flex w-full  items-center justify-center  md:hidden ">
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
