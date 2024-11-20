import React, { useState } from 'react';
import Timer from '../Components/Timer';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { IoMdArrowBack, IoMdRefreshCircle } from "react-icons/io";
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const User_datali = () => {
  // const location = useLocation();
  // const id = location.state || {}

  const navigate = useNavigate();
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listdata, setlistdata] = useState({});




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


  const getdata = async () => {
    const id = userdata.userId;
    try {
      const res = await axios.post('/api/getdta', { id });
      setlistdata(res.data.workdta[0].work_entries);
    }
    catch (err) {
      console.log(err);

    }
  }

  return (
    <>
      <div className='bg-gradient-to-r m-1 rounded bg-blue-200 shadow-2xl'>

        <Timer />
        <div onClick={() => { navigate('/Dashboard'); }} className='w-[10%] m-1 rounded mb-1 flex items-center gap-1 p-2 cursor-pointer'>
          <IoMdArrowBack className='text-xl' />
          <span className='text-xl max-[700px]:hidden'>Back</span>
        </div>
      </div>
      <div id='contain' className='h-[100vh] duration-[0.5s]  bg-blue-400 shadow-2xl m-2 rounded'>
        <div className=' flex  justify-between m-2 p-2 gap-5 items-center max-[400px]:gap-3' >
          <div className='grid  bg-cyan-400 font-extrabold p-2 rounded'>
            <span className='max-[750px]:text-[15px] text-xl font-extralight'>Id:{userdata.userId} </span>
            <span className='max-[750px]:text-[15px] text-xl font-extralight'>Username:{userdata.username} </span>
          </div>

          <div>
            <IoMdRefreshCircle onClick={() => { getdata(); }} className='duration-[0.5s] text-3xl cursor-pointer hover:text-4xl' />
          </div>
        </div>
        <div className='duration-[0.5s] m-2 p-2 overflow-auto  backdrop-blur-sm bg-white/20 rounded '>
          <table className=' max-[400px]:text-[15px] w-full text-center '>
            <thead>
              <tr className='border-b-2 sticky'>
                <td className=' rounded '>Month</td>
                <td className=' rounded '>Workday</td>
                <td className=' rounded '>Date of Workday</td>
                <td className=' rounded '>EntryTime</td>
                <td className=' rounded '>ExitTime</td>
                <td className=' rounded '>FullDay</td>
              </tr>
            </thead>
            <tbody>
              {
                listdata && listdata.length > 0 ? (
                  listdata.map((user) => (

                    <tr key={user._id} className="">
                      <td className="border-r-2 rounded p-3">{user.Month_of_works}</td>
                      <td className="border-r-2 rounded p-3">{user.day_of_work}</td>
                      <td className="border-r-2 rounded p-3">{user.date_of_work}</td>
                      <td className="border-r-2 rounded p-3">{user.entry_time}</td>
                      <td className="border-r-2 rounded p-3">{user.exit_time}</td>
                      <td className=" rounded p-3">{user.FullDay}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No Data Available
                    </td>
                  </tr>
                )}
            </tbody>
          </table>

        </div>
        <div className='m-2 p-2 flex gap-5 items-center'>
          <span>Month Of Working Days</span>
          <span className='bg-white px-4 py-1 rounded'>Days</span>

        </div>

      </div>

    </>
  );
};



export default User_datali;
