import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';


const Camera = () => {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceEncodings, setFaceEncodings] = useState(null);

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
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      // Match the canvas to video dimensions
      faceapi.matchDimensions(canvasRef.current, displaySize);

      // Detect face and landmarks
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        setFaceEncodings(detections.map(d => d.descriptor));
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






  return (
    <>
     <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid justify-center p-2 relative rounded mb-3'>
      <div className='relative w-full mb-3'>
        <Webcam className='w-full h-full rounded' ref={webcamRef} />
        <canvas className='absolute top-0 left-0 w-full h-full' ref={canvasRef} />
      </div>
      <button onClick={detectFace} className='bg-slate-300 rounded'>
        Detect Face
      </button>
      <div className='bg-white text-gray-700 p-3 rounded mt-3'>
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
      <h1>Encode:{faceEncodings}</h1>
    </div>

    </>
  );
}

export default Camera;
