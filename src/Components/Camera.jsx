import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
// import cv from 'opencv.js'; // Optional for advanced LBP

const Camera = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceEncodings, setFaceEncodings] = useState(null);
  const [savedEncodings, setSavedEncodings] = useState([]);
  const [textureScore, setTextureScore] = useState(null); // To hold texture analysis score

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

  // Detect face and perform texture analysis
  const detectFace = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      
      // Match canvas to video dimensions
      faceapi.matchDimensions(canvasRef.current, displaySize);

      // Detect face and landmarks
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        const encoding = detections.map(d => d.descriptor);
        setFaceEncodings(encoding);
        
        // Perform texture analysis to validate liveness
        const textureScore = performTextureAnalysis(video);
        setTextureScore(textureScore);
      } else {
        setFaceEncodings(null);
      }

      // Clear canvas and draw detections
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
    }
  };

  // Perform Texture Analysis using LBP or similar method
  const performTextureAnalysis = (video) => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    // Convert to grayscale for LBP
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const grayImage = cv.matFromImageData(imageData);

    // Apply LBP or similar texture analysis method
    let textureScore = calculateLBPScore(grayImage); // Example function for LBP
    grayImage.delete();

    // Threshold for a real face vs. spoof
    return textureScore < 0.6; // Adjust threshold based on testing
  };

  // Placeholder function for LBP calculation
  const calculateLBPScore = (grayImage) => {
    // Example scoring method (needs implementation based on LBP logic)
    // Higher scores mean more likely spoof, lower scores indicate real skin
    let score = 0; // Calculate texture features using LBP
    return score;
  };

  // Save the current face encoding
  const saveFaceEncoding = () => {
    if (faceEncodings && textureScore < 0.6) { // Ensure the face is real by texture score
      setSavedEncodings([...savedEncodings, ...faceEncodings]);
      console.log("Saved encoding with texture score:", textureScore);
    } else {
      console.warn("Texture analysis failed: Likely a spoof.");
    }
  };

  return (
    <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid justify-center p-2 relative rounded mb-3'>
      <div className='relative w-full mb-3'>
        <Webcam className='w-full h-full rounded' ref={webcamRef} />
        <canvas className='absolute top-0 left-0 w-full h-full' ref={canvasRef} />
      </div>
      <button onClick={detectFace} className='bg-slate-300 rounded'>
        Detect Face
      </button>
      <button onClick={saveFaceEncoding} className='bg-green-300 rounded ml-2'>
        Save Face Encoding
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

      {/* Display texture analysis score */}
      <div className='bg-white text-gray-700 p-3 rounded mt-3'>
        <h3 className="font-bold">Texture Analysis Score:</h3>
        <p>{textureScore !== null ? textureScore : "No face detected"}</p>
      </div>
    </div>
  );
};

export default Camera;
