import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const Camera = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceEncodings, setFaceEncodings] = useState(null);
  const [savedEncodings, setSavedEncodings] = useState([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionAccuracy, setDetectionAccuracy] = useState(0);
  const [textualAnalysis, setTextualAnalysis] = useState("");
  const [lastEyePositions, setLastEyePositions] = useState(null); // Store last eye positions for comparison
  const [isRealFace, setIsRealFace] = useState(false); // New state to track real face detection

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  // Periodic face detection
  useEffect(() => {
    if (modelsLoaded) {
      const interval = setInterval(() => {
        detectFace();
      }, 500); // Run every 500ms

      return () => clearInterval(interval);
    }
  }, [modelsLoaded]);

  // Detect face from webcam feed
  const detectFace = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
  
      faceapi.matchDimensions(canvasRef.current, displaySize);
  
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptors();
  
      if (detections.length > 0) {
        setFaceEncodings(detections.map(d => d.descriptor));
        setFaceDetected(true);
        const accuracy = (detections[0].detection.score * 100).toFixed(2);
        setDetectionAccuracy(accuracy);
       
  
        const landmarks = detections[0].landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
  
        // Ensure lastEyePositions is initialized
        if (!lastEyePositions) {
          setLastEyePositions({
            leftEye,
            rightEye
          });
        } else {
          const leftEyeMovement = calculateMovement(lastEyePositions.leftEye, leftEye);
          const rightEyeMovement = calculateMovement(lastEyePositions.rightEye, rightEye);
  
          if (leftEyeMovement || rightEyeMovement) {
            setIsRealFace(true);
            setTextualAnalysis(`Real face detected. Subtle texture and movement detected.${detectionAccuracy}`);
          } else {
            setIsRealFace(false);
            setTextualAnalysis("Photo detected. No significant texture or movement.");
          }
  
          // Update last eye positions after analysis
          setLastEyePositions({
            leftEye,
            rightEye
          });
        }
      } else {
        setFaceDetected(false);
        setDetectionAccuracy(0);
        setTextualAnalysis("No face detected. Please adjust your position.");
      }
  
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
      if (faceDetected) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 4;
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      }
  
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
    }
  };
  
  

 
 // Calculate movement by comparing current and last positions of landmarks
const calculateMovement = (lastPosition, currentPosition) => {
  if (!lastPosition) return false;

  // Calculate average distance between last and current positions of all eye points
  const leftEyeMovement = lastPosition.map((point, index) => {
    const distance = Math.sqrt(
      Math.pow(currentPosition[index].x - point.x, 2) +
      Math.pow(currentPosition[index].y - point.y, 2)
    );
    return distance > 2; // Check if movement is significant
  });

  return leftEyeMovement.includes(true); // Return true if any point has significant movement
};


  // Save the current face encoding to the database
  const saveFaceEncoding = async () => {
    if (faceEncodings) {
      setSavedEncodings([...savedEncodings, ...faceEncodings]);
      try {
        await axios.post('http://localhost:5000/save-face-encoding', { encoding: faceEncodings });
        alert("Face encoding saved to the database.");
      } catch (error) {
        console.error("Error saving encoding:", error);
        alert("Failed to save face encoding.");
      }
    } else {
      alert("No face encoding available to save.");
    }
  };

  return (
    <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid justify-center p-2 relative rounded mb-3'>
      <div className='relative w-full mb-3'>
        <Webcam className='w-full h-full rounded' ref={webcamRef} />
        <canvas className='absolute top-0 left-0 w-full h-full' ref={canvasRef} />
      </div>
      <button onClick={saveFaceEncoding} className='bg-green-300 rounded ml-2'>
        Capture Face & Save Encoding
      </button>
      
      {/* Display live face encodings */}
      <div className='bg-white text-gray-700 p-3 rounded mt-3'>
        <h3 className="font-bold">Live Face Encoding:</h3>
        {faceEncodings ? (
          faceEncodings.map((encoding, index) => (
            <div key={index}>
              <p>Face Encoding {index + 1}:</p>
              <pre className="text-xs overflow-scroll h-24">{JSON.stringify(encoding, null, 2)}</pre>
            </div>
          ))
        ) : (
          <p>No face detected</p>
        )}
      </div>

      {/* Display textual analysis */}
      <div className='bg-white text-gray-700 p-3 rounded mt-3'>
        <h3 className="font-bold">Detection Status:</h3>
        <p>{textualAnalysis}</p>
      </div>

      {/* Display saved face encodings */}
      <div className='bg-white text-gray-700 p-3 rounded mt-3'>
        <h3 className="font-bold">Saved Face Encodings:</h3>
        {savedEncodings.length > 0 ? (
          savedEncodings.map((encoding, index) => (
            <div key={index}>
              <p>Saved Encoding {index + 1}:</p>
              <pre className="text-xs overflow-scroll h-24">{JSON.stringify(encoding, null, 2)}</pre>
            </div>
          ))
        ) : (
          <p>No saved encodings</p>
        )}
      </div>
    </div>
  );
};

export default Camera;
