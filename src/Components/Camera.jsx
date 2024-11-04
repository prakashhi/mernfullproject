import React, { useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const Camera = () => {
  const [devices, setDevices] = useState([]);

  const handleDevices = useCallback((mediaDevices) => {
    setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'));
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <>
      {devices.map((device, index) => (
        <div key={device.deviceId}>
          <Webcam
            audio={false}
            videoConstraints={{ deviceId: device.deviceId }}
          />
          <p>{device.label || `Device ${index + 1}`}</p>
        </div>
      ))}
    </>
  );
};

export default Camera;

