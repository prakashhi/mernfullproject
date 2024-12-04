import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClent from '../services/api'



const expressions = ["happy", "sad", "angry", "surprised"];

const Login_camers = () => {
  const navigate = useNavigate()

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [load, setload] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceEncodings, setFaceEncodings] = useState(null);
  const [savedEncodings, setSavedEncodings] = useState([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionAccuracy, setDetectionAccuracy] = useState(0);
  const [expectedExpression, setExpectedExpression] = useState("");
  const expressionMatched = useRef(false);
  
  const [textualAnalysis, setTextualAnalysis] = useState("");
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setExpectedExpression(expressions[Math.floor(Math.random() * expressions.length)]);
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




  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token
    } else {
      try {
        // Decode the token (using the base64 payload)
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Check if the token is expired
        const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

        if (payload.exp && payload.exp < currentTime) {
          toast.info('Sessionhas expired');
          sessionStorage.removeItem('token'); // Clear the expired token
          navigate('/'); // Redirect to login
        } else {
          setUserdata(payload); // Token is valid, set user data
        }
      } catch (error) {
        console.error('Invalid token:', error);
        sessionStorage.removeItem('token'); // Clear invalid token
        navigate('/'); // Redirect if token is invalid
      }
      finally {
        setLoading(false); // Ensure loading is set to false regardless of the outcome
      }
    }


  }, [navigate]);



  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userdata) {
    return <div>Redirecting...</div>;
  }

  function areEncodingsMatching(dbEncoding, userEncoding, threshold = 0.6) {
    const distance = Math.sqrt(
      dbEncoding.reduce((sum, val, i) => sum + Math.pow(val - userEncoding[i], 2), 0)
    );
    return distance < threshold;
  }




  const no_user = userdata.userId


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
			   if (!expressionMatched.current) {
					setload(false);
					expressionMatched.current = true;
				}
        }


      } else {
        setFaceDetected(false);
        setDetectionAccuracy(0);
		 expressionMatched.current = false;
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
	  
    setload(true);

    if (faceEncodings) {
      const updateencode =  [...savedEncodings, ...faceEncodings];

      try {
        await apiClent.post('/loginface', { updateencode, no_user });
        navigate('/Dashboard');
      }
      catch (error) {
        setload(false);
        if (error.response && error.response.status === 400) {
			  setload(false);
          toast.error("Invalid Face Delection");
        }
        else if (error.response && error.response.status === 401) {
			setload(false);
          toast.error("Face is not match");
        }
        else {
			  setload(false);
          toast.error("Login failed");
        }
        console.log(error);

      }
    }

  };



  return (
    <>
      <div className='flex justify-center  p-3 '>
        <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid justify-center p-2 relative rounded mb-3'>
          <h1 className='bg-white text-gray-700 text-center p-1 rounded mt-1'>Id:{userdata.userId}</h1>
          <div className='relative w-full my-2 max-[450px]:w-[90%]'>

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
              <p>{expressionMatched.current ? "Matched!" : "Not Matched"}</p>

            </div>

          </div>
          {/* Display textual analysis */}
          <div className='bg-white text-gray-700 p-3 rounded mt-3'>
            <h3 className="font-bold">Detection Status:</h3>
            <p>{textualAnalysis}</p>
          </div>

          {expressionMatched.current ? <button onClick={saveFaceEncoding} className='hover:px-9 hover:py-3 duration-[0.5s] text-white bg-fuchsia-600 rounded-full font-extrabold px-7 py-2'>
            {
              load == true ? (<svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
              </svg>) : <p>Face Login</p>

            }

          </button> : null}
        </div>

      </div>
    </>
  );
}

export default Login_camers;
