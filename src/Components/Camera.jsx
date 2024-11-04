import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const Camera = () => {

  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const handleCapture = async () => {
    if (webcamRef.current && modelsLoaded) {
      const video = webcamRef.current.video;
      const detection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();
      console.log(detection);
    }
  };

  const loadModels = async () => {
    // Load the models from the specified URI
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  };

  const FaceRecognition = () => {
    useEffect(() => {
      loadModels();
    }, []);

    return (
      <>
        <div>
          <Webcam ref={webcamRef} />
          <button onClick={handleCapture}>Capture and Detect Face</button>
        </div>

      </>
    );
  }
}

export default Camera;
