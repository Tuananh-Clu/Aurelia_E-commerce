import {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Pose, type Results } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { useNavigate } from "react-router-dom";
import { AiPoseMeasureContext } from "@/Providers/AIPoseMeasure";
import type { MainCameraProps } from "../types";

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

export function useMainCamera({ isCameraOn, setIsCameraOn }: MainCameraProps) {
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
  const isMobile = window.innerWidth < 768;
  const DataMeasure = useRef({
    vai: [] as number[],
    nguc: [] as number[],
    eo: [] as number[],
    hong: [] as number[],
    chieuCao: [] as number[],
  });

  const navigate = useNavigate();

  const drawLandmarks = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      landmarks: unknown[],
      poseLandmarks: unknown[],
      w: number,
      h: number
    ) => {
      landmarks.forEach((l: unknown, i: number) => {
        const p = (poseLandmarks as { x: number; y: number; z?: number; visibility?: number }[])[i];
        const landmark = l as { x: number; y: number; z?: number; visibility?: number };
        if (!p || !landmark) return;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 5, 0, 2 * Math.PI);
        ctx.fillStyle = (landmark.z ?? 0) > 0.02 ? "#f00" : (landmark.z ?? 0) < -0.02 ? "#00f" : "#0f0";
        ctx.globalAlpha = Math.max(0.3, landmark.visibility || 0);
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
      requestAnimationFrame(() => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(video, 0, 0, width, height);
        if (
          !results.poseWorldLandmarks ||
          results.poseWorldLandmarks.length === 0
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

        const handInBox = rightHand.y < 0.45;

        if (isCountingDownRef.current && !handInBox) {
          if (countdownIntervalRef.current !== null) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          isCountingDownRef.current = false;
          setPopup(false);
          return;
        }

        if (isCountingDownRef.current || !handInBox) return;

        isCountingDownRef.current = true;
        setNumber(3);
        setPopup(true);

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
                calculateEllipseCircumference(hipWidth, hipDepth) * 100 * 1.62;

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
                1.44;

              const heightCm =
                (Math.max(leftFoot.y, rightFoot.y) - head.y) * 100;

              const BUFFER_SIZE = 20;
              if (DataMeasure.current.vai.length >= BUFFER_SIZE) {
                DataMeasure.current.vai.shift();
                DataMeasure.current.nguc.shift();
                DataMeasure.current.eo.shift();
                DataMeasure.current.hong.shift();
                DataMeasure.current.chieuCao.shift();
              }
              DataMeasure.current.vai.push(shoulderWidth * 1.38 * 100);
              DataMeasure.current.nguc.push(chest);
              DataMeasure.current.eo.push(waist);
              DataMeasure.current.hong.push(hip);
              DataMeasure.current.chieuCao.push(heightCm);
              const avg = (arr: number[]) => {
                const value = arr.reduce((a, b) => a + b, 0) / arr.length;
                return Math.round(value).toString();
              };
              setDataMeasure({
                vai: avg(DataMeasure.current.vai),
                nguc: avg(DataMeasure.current.nguc),
                eo: avg(DataMeasure.current.eo),
                hong: avg(DataMeasure.current.hong),
                chieuCao: avg(DataMeasure.current.chieuCao),
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
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: isMobile ? 0 : 2,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(handleResults);
    poseRef.current = pose;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: isMobile ? 640 : 1280,
          height: isMobile ? 480 : 720,
          frameRate: { ideal: isMobile ? 24 : 30 },
        },
        audio: false,
      })
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
      if (countdownIntervalRef.current !== null) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }

      if (cameraInstanceRef.current) {
        cameraInstanceRef.current.stop();
        cameraInstanceRef.current = null;
      }

      const stream = videoRef.current?.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }

      if (poseRef.current) {
        poseRef.current.close();
        poseRef.current = null;
      }
    };
  }, [isCameraOn, handleResults]);

  return {
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
  };
}
