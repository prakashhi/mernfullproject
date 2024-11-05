import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';


const Camera = () => {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceData, setFaceData] = useState(null);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const img = new Image();
    img.src = imageSrc;

    img.onload = async () => {
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        setFaceData(detections.descriptor); // Save face encoding to state
      }
    };
  };

  // Load the face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  // Run face detection periodically
  useEffect(() => {
    if (modelsLoaded) {
      const interval = setInterval(() => {
        detectFace();
      }, 100); // Run every 100ms

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
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptors();

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
      <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid justify-center p-2 relative rounded mb-3'>
        <div className='relative w-full mb-3'>
          <Webcam className='w-full h-full rounded' ref={webcamRef} />
          <canvas className='absolute top-0 left-0 w-full h-full' ref={canvasRef} />

        </div>
        <button onClick={detectFace} className='bg-slate-300 rounded' >
          Capture & Detect Face
        </button>
        <button onClick={capture} className='bg-slate-300 rounded' >
          Capture & Detect Face23
        </button>
      </div>

    </>
  );
}

export default Camera;
