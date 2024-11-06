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
  const [blinkDetected, setBlinkDetected] = useState(false);

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

  // Periodic face detection with blink check
  useEffect(() => {
    if (modelsLoaded) {
      const interval = setInterval(() => {
        detectFaceAndBlink();
      }, 500); // Run every 500ms
      return () => clearInterval(interval);
    }
  }, [modelsLoaded]);

  // Detect face and check for blink
  const detectFaceAndBlink = async () => {
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
        detectBlink(detections[0].landmarks); // Detect blink using first face's landmarks

        if (blinkDetected) {
          saveFaceEncoding();
        }
      } else {
        setFaceEncodings(null);
        setBlinkDetected(false);
      }

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
    }
  };

  // Blink detection using Eye Aspect Ratio (EAR)
  const detectBlink = (landmarks) => {
    const calculateEAR = (eye) => {
      const distVertical1 = faceapi.euclideanDistance(eye[1], eye[5]);
      const distVertical2 = faceapi.euclideanDistance(eye[2], eye[4]);
      const distHorizontal = faceapi.euclideanDistance(eye[0], eye[3]);
      return (distVertical1 + distVertical2) / (2.0 * distHorizontal);
    };

    const leftEAR = calculateEAR(landmarks.getLeftEye());
    const rightEAR = calculateEAR(landmarks.getRightEye());
    const avgEAR = (leftEAR + rightEAR) / 2.0;
    const blinkThreshold = 0.25; // Adjust threshold if necessary

    if (avgEAR < blinkThreshold) {
      setBlinkDetected(true);
    } else {
      setBlinkDetected(false);
    }
  };

  // Save the current face encoding if a blink was detected
  const saveFaceEncoding = async () => {
    if (faceEncodings && blinkDetected) {
      setSavedEncodings([...savedEncodings, ...faceEncodings]);
      try {
        // Replace with your actual API endpoint
        await axios.post('http://localhost:5000/save-face-encoding', { encoding: faceEncodings });
        alert("Face encoding saved to the database.");
      } catch (error) {
        console.error("Error saving encoding:", error);
        alert("Failed to save face encoding.");
      }
    }
  };

  return (
    <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid justify-center p-2 relative rounded mb-3'>
      <div className='relative w-full mb-3'>
        <Webcam className='w-full h-full rounded' ref={webcamRef} />
        <canvas className='absolute top-0 left-0 w-full h-full' ref={canvasRef} />
      </div>

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

      {/* Display blink detection status */}
      <div className='bg-white text-gray-700 p-3 rounded mt-3'>
        <h3 className="font-bold">Blink Status:</h3>
        {blinkDetected ? <p>Blink detected!</p> : <p>Please blink to verify liveness</p>}
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
