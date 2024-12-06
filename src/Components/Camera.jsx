import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  
  const [load, setload] = useState(false);

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
  setload(true); 
	if (faceEncodings) {
    const faceEncodingArray = Array.from(faceEncodings); 
    navigate('/Register', { state: { savedEncodings: faceEncodingArray } }); 
	toast.info("Face data added");// Pass the array correctly
    setload(false); // Stop loading after navigation
  } else {
	 setload(false);
    console.error('No valid face encodings available to save.');
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
			{
				load == true ? (<svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
              </svg>):<p>Capture Face & Save Encoding</p>
				
			}
          
        </button>
      )}
    </div>
  );
};

export default Camera;
