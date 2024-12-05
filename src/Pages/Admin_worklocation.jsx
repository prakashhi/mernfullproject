import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6"
import { IoReorderThreeOutline } from "react-icons/io5"
import { IoCloseCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import apiClent from '../services/api'

const Admin_worklocation = () => {
  const navigate = useNavigate()

  const [latitude, setlatitude] = useState(null);
  const [longitude, selongitude] = useState(null);
  const [validrange, setvalidrange] = useState(null);
  const [WorkCode, setWorkCode] = useState(null);
  const [admindata, setadmindata] = useState('');
  const [load, setload] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/Admin');
    } else {
      try {

        const payload = JSON.parse(atob(token.split('.')[1]));

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
    setload(true);

    e.preventDefault();

    if ([WorkCode, latitude, longitude, validrange].some(i => i.length <= 0)) {
      setload(false);
      toast.error("Fill out all fields!");

    }

    else {
      if ([WorkCode, latitude, longitude, validrange].some(i => isNaN(i))) {
        setload(false);
        toast.error("Enter Numbers!");
      }
      else {

        try {
          await apiClent.post('/setwotkloaction', { latitude, longitude, validrange, WorkCode });
          toast.success("Data upadated");
		  setload(false);
        }
        catch (error) {
          setload(false);
          toast.error(error);
        }
      }

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


          <div className='shadow-2xl max-[800px]:p-4 backdrop-blur-sm bg-white/30 inline-grid p-10 rounded w-[100%] max-[800px]:w-[95%] duration-[0.5s] my-4 m-[20px]'>

            <div className=''>
              <div className='text-3xl text-bold hover:cursor-pointer ' onClick={ham}>
                <IoReorderThreeOutline />

              </div>

              <h1 className='flex justify-center text-2xl text-blue-100 mb-3'>Work Location data</h1>
            </div>



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
              <button onClick={submit} className='duration-[0.5s] bg-fuchsia-600 hover:px-20 rounded px-[50px] py-2 text-white font-bold' >
                {
                  load == true ? (<svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>) : <p>Set Data</p>
                }

              </button>

            </div>




          </div>
        </div>
      </div>
    </>
  );
}

export default Admin_worklocation;
