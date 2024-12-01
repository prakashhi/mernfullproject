import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const expressions = ["happy", "sad", "angry", "surprised"];

const Camera = () => {
	 const navigate = useNavigate();

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceEncodings, setFaceEncodings] = useState(null);
  const [savedEncodings, setSavedEncodings] = useState([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionAccuracy, setDetectionAccuracy] = useState(0);
  const [expectedExpression, setExpectedExpression] = useState("");
  const [expressionMatched, setExpressionMatched] = useState(false);
  const [textualAnalysis, setTextualAnalysis] = useState("");
  
  const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'); // Load expression model
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
	
  // Load face-api.js models
  useEffect(() => {
    loadModels();
	setExpectedExpression(expressions[Math.floor(Math.random() * expressions.length)]);
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
  
  

  // Detect face and expressions from webcam feed
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
        .withFaceDescriptors()
        .withFaceExpressions(); // Include expression detection

      if (detections.length > 0) {
        setFaceEncodings(detections.map(d => d.descriptor));
        setFaceDetected(true);
        const accuracy = (detections[0].detection.score * 100).toFixed(2);
        setDetectionAccuracy(accuracy);
        setTextualAnalysis(`Face detected with ${accuracy}% confidence.`);

        // Check for expression match
        const detectedExpressions = detections[0].expressions;
        const mostLikelyExpression = getMostLikelyExpression(detectedExpressions);

        // Check if the detected expression matches the expected one
        if (mostLikelyExpression === expectedExpression) {
          if (!expressionMatched) { // Only set to true if it hasn’t already been set
            setExpressionMatched(true); // Set match as true to stop expression updates
          }
        }


      } else {
        setFaceDetected(false);
        setDetectionAccuracy(0);
        setExpressionMatched(false);
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

  // Function to determine the most likely expression
  const getMostLikelyExpression = (expressions) => {
    return Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));
  };

    
	
  // Save the current face encoding to the database
  const saveFaceEncoding = async () => {
	  
	  
    if (faceEncodings && faceEncodings.length > 0) {
        const updatedEncodings = [...savedEncodings, ...faceEncodings];
        setSavedEncodings(updatedEncodings); // Set the updated encodings in state
        
        navigate('/Register', { state: { savedEncodings: updatedEncodings } }); 
    } else {
        console.error('No face encodings available to save.');
    }
      
  
	  
  };



  return (
    <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid justify-center p-2 relative rounded mb-3'>
      <div className='relative w-full mb-3 max-[450px]:w-[80%] '>
        <Webcam className='w-full h-full rounded' ref={webcamRef} />
        <canvas className='absolute top-0 left-0 w-full h-full' ref={canvasRef} />
      </div>


<div className='flex gap-3'>
      {/* Display expected expression */}
      <div className='bg-white text-gray-700 p-3 rounded mt-3'>
        <h3 className="font-bold">Expected Expression:</h3>
        <p>{expectedExpression.charAt(0).toUpperCase() + expectedExpression.slice(1)}</p>
      </div>

      {/* Display match status */}
      <div className='bg-white text-gray-700 p-3 rounded mt-3'>
        <h3 className="font-bold">Expression Match Status:</h3>
        <p>{expressionMatched ? "Matched!" : "Not Matched"}</p>

      </div>

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
      {expressionMatched ? <button onClick={saveFaceEncoding} className='bg-green-300 rounded mt-2 p-2'>
        Capture Face & Save Encoding </button> : null}
    </div>
  );
};

export default Camera;
