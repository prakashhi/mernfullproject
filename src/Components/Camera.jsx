import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonFun from "../Components/ButtonFun";

// Constants
const EXPRESSIONS = ["happy", "angry", "surprised"];
const DETECTION_INTERVAL = 500; // 1 second interval for smooth performance

const Camera = ({setShowCamera}) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [textualAnalysis, setTextualAnalysis] = useState("Initializing...");
  const [faceEncodings, setFaceEncodings] = useState(null);
  const [expectedExpression, setExpectedExpression] = useState("");

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const rafId = useRef(null);
  const isMounted = useRef(false);
  const lastDetectionTime = useRef(0);
  const expressionMatched = useRef(false);

  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  // Load face-api.js models
  const loadModels = useCallback(async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        await faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        console.log("✅ Models loaded");
      if (isMounted.current) setModelsLoaded(true);
    } catch (error) {
      console.error("Error loading models:", error);
      if (isMounted.current) setTextualAnalysis("Failed to load models");
    }
  }, []);

  // Initial setup with cleanup
  useEffect(() => {
    isMounted.current = true;
    loadModels();
    setExpectedExpression(
      EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)]
    );

    return () => {
      isMounted.current = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (webcamRef.current?.stream) {
        webcamRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [loadModels]);

  // Save face encoding
  const saveFaceEncoding = () => {
    setLoad(true);
    try {
      if (faceEncodings) {
        const faceEncodingArray = Array.from(faceEncodings);
        navigate("/Register", { state: { savedEncodings: faceEncodingArray } });
        setShowCamera(false)
        toast.info("FaceData set Sucessfully");
      } else {
        toast.error("No valid face encodings to save");
      }
    } catch (err) {
      toast.error("No valid face encodings available to save");
      consoe.log(err);
    } finally {
      setLoad(false);
    }
  };

  // 🔹 Expression helper
  const getMostLikelyExpression = useCallback((expressions) => {
    return Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );
  }, []);

  // Face detection with corrected chaining
  const detectFace = useCallback(async () => {
    if (!webcamRef.current?.video || webcamRef.current.video.readyState !== 4)
      return;

    const now = performance.now();
    if (now - lastDetectionTime.current < DETECTION_INTERVAL) return;
    lastDetectionTime.current = now;

    const video = webcamRef.current.video;
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    try {
      // Detect face with all features in one call
      const detections = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptor(); // Correct chaining order

      if (!detections) {
        console.warn("No face detected in this frame.");
        return;
      }

      const ctx = canvasRef.current.getContext("2d", {
        willReadFrequently: true,
      });

      ctx.clearRect(0, 0, displaySize.width, displaySize.height);

      if (detections && isMounted.current) {
        const resized = faceapi.resizeResults([detections], displaySize);

        // overlays
        faceapi.draw.drawDetections(canvasRef.current, resized);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

        // metadata
        setFaceEncodings(detections.descriptor);

        let Accuracy = (detections.detection.score * 100).toFixed(2);

        setTextualAnalysis(`Face detected with ${Accuracy}% confidence`);

        if (!expressionMatched.current) {
          // expression match
          const mostLikelyExpression = getMostLikelyExpression(
            detections.expressions
          );

          expressionMatched.current =
            mostLikelyExpression === expectedExpression;
        }
      } else {
        expressionMatched.current = false;
        setTextualAnalysis("No face detected. Please adjust your position.");
      }

    } catch (error) {
      console.error("Detection error:", error);

      setTextualAnalysis("Error during face detection");
    }
  }, [expectedExpression, getMostLikelyExpression]);

  // Smooth detection loop
  const detectionLoop = useCallback(() => {
    if (!modelsLoaded || !isMounted.current) return;
    detectFace();
    rafId.current = requestAnimationFrame(detectionLoop);
  }, [modelsLoaded, detectFace]);

  // 🔹 Start detection loop
  useEffect(() => {
    if (modelsLoaded === true) {
      rafId.current = requestAnimationFrame(detectionLoop);
    }
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [modelsLoaded, detectionLoop]);

  return (
    <div className="inline-grid justify-center p-2 rounded mb-3  ">
      <div className="relative  mb-3 height-[20dvh] mx-auto">
        <Webcam
          className="w-full h-full rounded-xl"
          ref={webcamRef}
          audio={false}
          onUserMediaError={() => setTextualAnalysis("Camera access denied")}
        />
        <canvas
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          ref={canvasRef}
        />
      </div>

      {!expressionMatched.current && (
        <div className="flex gap-3 justify-center flex-wrap">
          <div className="bg-[#F7F7F7] border border-gray rounded-xl  w-full text-gray-700 p-3 rounded mt-3 min-w-[150px]">
            <h3 className="font-bold">Expected Expression:</h3>
            <p>{expectedExpression}</p>
          </div>
          <div className="bg-[#F7F7F7]  border border-gray rounded-xl w-full text-gray-700 p-3 rounded mt-3 min-w-[150px]">
            <h3 className="font-bold">Expression Match Status:</h3>
            <p>{expressionMatched.current ? "Matched!" : "Not Matched"}</p>
          </div>
        </div>
      )}

      <div className="bg-[#F7F7F7] border border-gray w-full rounded-xl text-gray-700 p-3 rounded mt-3 max-w-[640px] mx-auto">
        <h3 className="font-bold">Detection Status:</h3>
        <p>{textualAnalysis}</p>
      </div>
      {expressionMatched.current && (
        <ButtonFun
          onClick={saveFaceEncoding}
          Text={"Save Encoding"}
          className={
            "hover:px-9   duration-[0.5s] px-10 py-2 text-white bg-black rounded-md mt-5 flex justify-center"
          }
          Loading={load}
        />
      )}
    </div>
  );
};

export default Camera;
