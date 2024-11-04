import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const Camera = () => {

  const webcamRef = useRef(null);
  const [faceData, setFaceData] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    };
    loadModels();
  }, []);

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


  return (
    <>
      <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid justify-center p-2 relative rounded mb-3'>
        <div className='flex items-center justify-center mb-4'>
          <Webcam className='w-[85%] rounded' ref={webcamRef} screenshotFormat="image/jpeg" />
        </div>
       
        <div className='flex justify-center'>
          <button onClick={capture} className='bg-slate-700 px-3 py-1 rounded text-white'>Capture Face</button>
        </div>
         <h1>{faceData}</h1>
      </div>

    </>
  );
}

export default Camera;
