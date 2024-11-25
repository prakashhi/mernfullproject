import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6"
import { IoReorderThreeOutline } from "react-icons/io5"
import { IoCloseCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Admin_worklocation = () => {
	  const navigate = useNavigate()

  const [latitude, setlatitude] = useState(null);
  const [longitude, selongitude] = useState(null);
  const [validrange, setvalidrange] = useState(null);
  const [WorkCode, setWorkCode] = useState(null);
    const [admindata, setadmindata] = useState('');
  
   useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/Admin'); // Redirect to login if no token
    } else {
      try {
        // Decode the token (using the base64 payload)
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Check if the token is expired
        const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

        if (payload.exp && payload.exp < currentTime) {
          toast.info('Sessionhas expired');
          sessionStorage.removeItem('token'); // Clear the expired token
          navigate('/Admin'); // Redirect to login
        } else {
          setadmindata(payload); // Token is valid, set user data
        }
      } catch (error) {
        console.error('Invalid token:', error);
        sessionStorage.removeItem('token'); // Clear invalid token
        navigate('/Admin'); // Redirect if token is invalid
      }
    }
  }, [navigate]);

  const submit = async (e) => {

    e.preventDefault();

    console.log(WorkCode, latitude, longitude, validrange);
    try {
      await axios.post('/api/setwotkloaction', { latitude, longitude, validrange, WorkCode });
      toast.success("Data upadated");
    }
    catch (error) {
      toast.error(error);
    }

  }



  const ham = () => {

    document.getElementById('hamb').style.left = "0";
  }
  const close = () => {
    document.getElementById('hamb').style.left = "-1000px";
  }
  return (
    <>
      <div id='hamb' style={{ left: -1000 }} className='duration-[0.5s] bg-blue-400 text-white p-5 absolute h-[120vh] rounded max-[550px]:w-[70vw] w-[40vw] z-[1] transition-all  m-1'>
        <div className='grid gap-5 hover:cursor-pointer'>
          <div onClick={close} className='text-2xl'>
            <IoCloseCircle />
          </div>

          <div className='backdrop-blur-sm bg-white/30  p-4 rounded'>
            <Link to={'/A_Dash'}> Show User</Link>
          </div>
          <div className='backdrop-blur-sm bg-white/30 p-4 rounded'>
            <Link to={'/Admin_Edit'}> Edit User</Link>
          </div>
          <div className='backdrop-blur-sm bg-white/30 p-4 rounded'>
            <Link to={'/Admin_worklocationdata'}> Worl Location Data</Link>
          </div>
        </div>


      </div>
      <div className='bg-blue-400 h-[1000px]'>
        <div className='flex justify-center '>
          <div className='text-3xl text-bold hover:cursor-pointer' onClick={ham}>
            <IoReorderThreeOutline />

          </div>

          <div className='shadow-2xl max-[800px]:p-4 backdrop-blur-sm bg-white/30 inline-grid p-10 rounded w-[100%] max-[800px]:w-[95%] duration-[0.5s] my-4 m-[20px]'>

            <h1 className='flex justify-center text-2xl text-blue-100 mb-3'>Work Location data</h1>

            <div className='bg-gradient-to-r from-slate-500 to-slate-800   p-2 relative rounded mb-3'>
              <div className='flex items-center justify-between'>
                <span className='text-xl text-white'>WorkLoactionCode</span>

              </div>
              <input onChange={(e) => { setWorkCode(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
            </div>

            <div className='bg-gradient-to-r from-slate-500 to-slate-800   p-2 relative rounded mb-3'>
              <div className='flex items-center justify-between'>
                <input onChange={(e) => { setlatitude(e.target.value) }} placeholder="User workLatitude" className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                <FaLocationDot className='text-white text-xl' />
              </div>
            </div>
            <div className='bg-gradient-to-r from-slate-500 to-slate-800   p-2 relative rounded mb-3'>
              <div className='flex items-center justify-between'>
                <input onChange={(e) => { selongitude(e.target.value) }} placeholder="User workLongitude" className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                <FaLocationDot className='text-white text-xl' />
              </div>
            </div>


            <div className='bg-gradient-to-r from-slate-500 to-slate-800   p-2 relative rounded mb-3'>
              <div className='flex items-center justify-between'>
                <span className='text-xl text-white'>Valid Area in meter</span>

              </div>
              <input onChange={(e) => { setvalidrange(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
            </div>



            <div id='btn' className='w-full flex justify-center m-2'>
              <button onClick={submit} className='duration-[0.5s] bg-fuchsia-600 hover:px-20 rounded px-[50px] py-2 text-white font-bold' >Register</button>

            </div>
            <div >
              <h1>Work laptttude:</h1>
              <h1>Work laptttude:</h1>
              <h1>Valid Range:</h1>
            </div>



          </div>
        </div>
      </div>
    </>
  );
}

export default Admin_worklocation;
