import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  // Capture image from webcam
  const capture = () => {
    const capturedImage = webcamRef.current.getScreenshot();
    setImage(capturedImage);
  };

  return (
    <div>
      {!image ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }} // Use back camera
        />
      ) : (
        <img src={image} alt="Captured" />
      )}
      
      <div>
        {!image ? (
          <button onClick={capture}>Capture Photo</button>
        ) : (
          <button onClick={() => setImage(null)}>Retake</button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
