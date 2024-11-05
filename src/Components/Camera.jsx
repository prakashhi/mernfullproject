import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const Camera = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceEncoding, setFaceEncoding] = useState(null);

  const [blinkDetected, setBlinkDetected] = useState(false); // Track blink status

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
        captureFaceEncoding();
      }, 500); // Run every 500ms

      return () => clearInterval(interval);
    }
  }, [modelsLoaded]);




  // Detect face from webcam feed
  const captureFaceEncoding = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        setFaceEncoding(detections.descriptor); // Capture face encoding
        detectBlink(detections.landmarks); // Check for blink
        {
          <h1>faceencode:{faceEncoding}</h1>
        }
        
      } 
      // Match the canvas to video dimensions
      faceapi.matchDimensions(canvasRef.current, displaySize);

        // Clear canvas and draw detections
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
    }
  };

  const detectBlink = (landmarks) => {
    // Calculate the Eye Aspect Ratio (EAR) for blink detection
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const calculateEAR = (eye) => {
      const distVertical1 = faceapi.euclideanDistance(eye[1], eye[5]);
      const distVertical2 = faceapi.euclideanDistance(eye[2], eye[4]);
      const distHorizontal = faceapi.euclideanDistance(eye[0], eye[3]);
      return (distVertical1 + distVertical2) / (2.0 * distHorizontal);
    };

    const leftEAR = calculateEAR(leftEye);
    const rightEAR = calculateEAR(rightEye);
    const avgEAR = (leftEAR + rightEAR) / 2.0;

    // Threshold for blink detection
    const blinkThreshold = 0.25; // Adjust as needed
    if (avgEAR < blinkThreshold) {
      setBlinkDetected(true);
    } else {
      setBlinkDetected(false);
    }
  };

  return (
    <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid justify-center p-2 relative rounded mb-3'>
      <div className='relative w-full mb-3'>
        <Webcam className='w-full h-full rounded' ref={webcamRef} />
        <canvas className='absolute top-0 left-0 w-full h-full' ref={canvasRef} />
      </div>

      <button onClick={captureFaceEncoding} className='bg-slate-300 rounded'>Capture Face</button>

      {/* Display if blink was detected */}
      {blinkDetected ? <p>Blink detected!</p> : <p>Please blink to verify liveness</p>}



    </div>
  );
};

export default Camera;
