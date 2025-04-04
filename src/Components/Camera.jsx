import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Constants
const EXPRESSIONS = ["happy", "angry", "surprised"];
const DETECTION_INTERVAL = 1000; // 1 second interval for smooth performance

const Camera = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceEncodings, setFaceEncodings] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionAccuracy, setDetectionAccuracy] = useState(0);
  const [expectedExpression, setExpectedExpression] = useState("");
  const [textualAnalysis, setTextualAnalysis] = useState("Initializing...");
  const expressionMatched = useRef(false);
  const [load, setLoad] = useState(false);
  const rafId = useRef(null);
  const isMounted = useRef(true);
  const lastDetectionTime = useRef(0);

  // Load face-api.js models
  const loadModels = useCallback(async () => {
    try {
      const modelUrl = 'https://justadudewhohacks.github.io/face-api.js/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
        faceapi.nets.faceExpressionNet.loadFromUri(modelUrl),
      ]);
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
    setExpectedExpression(EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)]);

    return () => {
      isMounted.current = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (webcamRef.current?.stream) {
        webcamRef.current.stream.getTracks().forEach(track => track.stop());
      }
      faceapi.tf.dispose();
    };
  }, [loadModels]);

  // Face detection with corrected chaining
  const detectFace = useCallback(async () => {
    if (!webcamRef.current?.video || webcamRef.current.video.readyState !== 4) return;

    const now = performance.now();
    if (now - lastDetectionTime.current < DETECTION_INTERVAL) return;
    lastDetectionTime.current = now;

    const video = webcamRef.current.video;
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    try {
      // Detect face with all features in one call
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptor(); // Correct chaining order

      const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
      ctx.clearRect(0, 0, displaySize.width, displaySize.height);

      if (detections && isMounted.current) {
        const resizedDetections = faceapi.resizeResults([detections], displaySize);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        setFaceEncodings(detections.descriptor);
        setFaceDetected(true);
        const accuracy = (detections.detection.score * 100).toFixed(2);
        setDetectionAccuracy(accuracy);
        setTextualAnalysis(`Face detected with ${accuracy}% confidence`);

        const mostLikelyExpression = getMostLikelyExpression(detections.expressions);
        expressionMatched.current = mostLikelyExpression === expectedExpression;
      } else if (isMounted.current) {
        setFaceDetected(false);
        expressionMatched.current = false;
        setTextualAnalysis("No face detected. Please adjust your position.");
      }

      faceapi.tf.dispose(); // Dispose tensors
    } catch (error) {
      console.error("Detection error:", error);
      if (isMounted.current) setTextualAnalysis("Error during face detection");
    }
  }, [expectedExpression]);

  // Smooth detection loop
  const detectionLoop = useCallback(() => {
    if (!modelsLoaded || !isMounted.current) return;
    detectFace();
    rafId.current = requestAnimationFrame(detectionLoop);
  }, [modelsLoaded, detectFace]);

  useEffect(() => {
    if (modelsLoaded) {
      rafId.current = requestAnimationFrame(detectionLoop);
    }
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [modelsLoaded, detectionLoop]);

  // Memoized expression checker
  const getMostLikelyExpression = useCallback((expressions) => {
    return Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));
  }, []);

  // Save face encoding
  const saveFaceEncoding = useCallback(() => {
    setLoad(true);
    if (faceEncodings) {
      const faceEncodingArray = Array.from(faceEncodings);
      navigate('/Register', { state: { savedEncodings: faceEncodingArray } });
      toast.info("Face data added");
    } else {
      toast.error("No valid face encodings available to save");
      console.error('No valid face encodings available to save.');
    }
    setLoad(false);
  }, [faceEncodings, navigate]);

  return (
    <div className="bg-gradient-to-r from-slate-500 to-slate-800 inline-grid justify-center p-2 rounded mb-3">
      <div className="relative w-full mb-3 max-w-[640px] mx-auto">
        <Webcam
          className="w-full h-full rounded"
          ref={webcamRef}
          audio={false}
          onUserMediaError={() => setTextualAnalysis("Camera access denied")}
        />
        <canvas className="absolute top-0 left-0 w-full h-full pointer-events-none" ref={canvasRef} />
      </div>
      <div className="flex gap-3 justify-center flex-wrap">
        <div className="bg-white w-full text-gray-700 p-3 rounded mt-3 min-w-[150px]">
          <h3 className="font-bold">Expected Expression:</h3>
          <p>{expectedExpression.charAt(0).toUpperCase() + expectedExpression.slice(1)}</p>
        </div>
        <div className="bg-white w-full text-gray-700 p-3 rounded mt-3 min-w-[150px]">
          <h3 className="font-bold">Expression Match Status:</h3>
          <p>{expressionMatched.current ? "Matched!" : "Not Matched"}</p>
        </div>
      </div>
      <div className="bg-white w-full text-gray-700 p-3 rounded mt-3 max-w-[640px] mx-auto">
        <h3 className="font-bold">Detection Status:</h3>
        <p>{textualAnalysis}</p>
      </div>
      {expressionMatched.current && (
        <button
          onClick={saveFaceEncoding}
          disabled={load}
          className="bg-green-300 rounded mt-2 p-2 mx-auto max-w-[640px] w-full flex justify-center items-center disabled:opacity-50"
        >
          {load ? (
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 mr-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <p className="font-bold">Capture Face & Save Encoding</p>
          )}
        </button>
      )}
    </div>
  );
};

export default Camera;