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
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceEncodings, setFaceEncodings] = useState(null);
  const [savedEncodings, setSavedEncodings] = useState([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionAccuracy, setDetectionAccuracy] = useState(0);
  const [expectedExpression, setExpectedExpression] = useState("");
  const [expressionMatched, setExpressionMatched] = useState(false);
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




const no_user  = userdata.userId


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
	  
    if (faceEncodings) {
		setSavedEncodings([...savedEncodings, ...faceEncodings]);
		
		console.log(savedEncodings,no_user)
	  try{
		  await apiClent.post('/loginface',{ savedEncodings , no_user  });
		  navigate('/Dashboard');
	  }
	  catch(error)
	  {
		  if (error.response && error.response.status === 400) {
                    toast.error("Invalid Face Delection");
                } 
				else if(error.response && error.response.status === 401) {
                   
                    toast.error("Face is not match");
                } 
				else {
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
		<h1 className=''>Id:{userdata.userId}</h1>
          <div className='relative w-full mb-3 max-[450px]:w-[90%]'>
		  
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

          {expressionMatched ? <button onClick={saveFaceEncoding} className='hover:px-9 hover:py-3 duration-[0.5s] text-white bg-fuchsia-600 rounded-full font-extrabold px-7 py-2'>
            Log in </button> : null}
        </div>

      </div>
    </>
  );
}

export default Login_camers;
