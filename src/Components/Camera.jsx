import React from 'react';
import Webcam from 'react-webcam';

const Camera = () => {
  const videoConstraints = {
    facingMode: { exact: "environment" } // Targets the back camera on mobile devices
  };

  return (
    <div>
      <Webcam
        audio={false}
        videoConstraints={videoConstraints}
        screenshotFormat="image/jpeg"
      />
      <p>Using mobile camera</p>
    </div>
  );
};
