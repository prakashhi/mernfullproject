import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';

const expressions = ["happy", "angry", "surprised"];

const Camera = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceEncodings, setFaceEncodings] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionAccuracy, setDetectionAccuracy] = useState(0);
  const [expectedExpression, setExpectedExpression] = useState("");
  const [textualAnalysis, setTextualAnalysis] = useState("");
  const expressionMatched = useRef(false);
  const detectingRef = useRef(false);

  // Load face-api.js models
  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
      ]);
      setModelsLoaded(true);
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  useEffect(() => {
    loadModels();
    setExpectedExpression(expressions[Math.floor(Math.random() * expressions.length)]);
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      const detect = async () => {
        if (!detectingRef.current) {
          detectingRef.current = true;
          await detectFace();
          detectingRef.current = false;
        }
      };
      const interval = setInterval(detect, 500);
      return () => clearInterval(interval);
    }
  }, [modelsLoaded]);

  const detectFace = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();

      if (detections.length > 0) {
        const bestMatch = detections[0];
        setFaceEncodings(bestMatch.descriptor);
        setFaceDetected(true);
        const accuracy = (bestMatch.detection.score * 100).toFixed(2);
        setDetectionAccuracy(accuracy);
        setTextualAnalysis(`Face detected with ${accuracy}% confidence.`);

        const detectedExpressions = bestMatch.expressions;
        const mostLikelyExpression = getMostLikelyExpression(detectedExpressions);
        if (mostLikelyExpression === expectedExpression) {
          expressionMatched.current = true;
        }
      } else {
        setFaceDetected(false);
        expressionMatched.current = false;
        setTextualAnalysis("No face detected. Please adjust your position.");
      }

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
    }
  };

  const getMostLikelyExpression = (expressions) =>
    Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));

  const saveFaceEncoding = () => {
    if (faceEncodings) {
      navigate('/Register', { state: { savedEncodings: Array.from(faceEncodings) } });
    } else {
      console.error('No face encodings available to save.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-500 to-slate-800 inline-grid justify-center p-2 relative rounded mb-3">
      <div className="relative w-full mb-3 max-[450px]:w-[80%]">
        <Webcam className="w-full h-full rounded" ref={webcamRef} />
        <canvas className="absolute top-0 left-0 w-full h-full" ref={canvasRef} />
      </div>
      <div className="flex gap-3">
        <div className="bg-white text-gray-700 p-3 rounded mt-3">
          <h3 className="font-bold">Expected Expression:</h3>
          <p>{expectedExpression.charAt(0).toUpperCase() + expectedExpression.slice(1)}</p>
        </div>
        <div className="bg-white text-gray-700 p-3 rounded mt-3">
          <h3 className="font-bold">Expression Match Status:</h3>
          <p>{expressionMatched.current ? "Matched!" : "Not Matched"}</p>
        </div>
      </div>
      <div className="bg-white text-gray-700 p-3 rounded mt-3">
        <h3 className="font-bold">Detection Status:</h3>
        <p>{textualAnalysis}</p>
      </div>
      {expressionMatched.current && (
        <button onClick={saveFaceEncoding} className="bg-green-300 rounded mt-2 p-2">
          Capture Face & Save Encoding
        </button>
      )}
    </div>
  );
};

export default Camera;
