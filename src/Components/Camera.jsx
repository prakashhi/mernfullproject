import React, { useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const Camera = () => {
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState('');

  const handleDevices = useCallback((mediaDevices) => {
    const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput');
    setDevices(videoDevices);

    // Prefer the back camera by default if available
    const backCamera = videoDevices.find(({ label }) =>
      label.toLowerCase().includes('back')
    );
    setDeviceId(backCamera ? backCamera.deviceId : videoDevices[0]?.deviceId);
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <>
      {deviceId && (
        <Webcam
          audio={false}
          videoConstraints={{ deviceId: deviceId }}
        />
      )}
      {devices.map((device, index) => (
        <div key={device.deviceId}>
          <button onClick={() => setDeviceId(device.deviceId)}>
            {device.label || `Device ${index + 1}`}
          </button>
        </div>
      ))}
    </>
  );
};

export default Camera;
