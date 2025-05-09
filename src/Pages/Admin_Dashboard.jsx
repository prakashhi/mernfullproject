import React, { useEffect, useState,useCallback } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Timer from '../Components/Timer';
import { IoReorderThreeOutline } from "react-icons/io5"
import { Link } from 'react-router-dom';
import { IoCloseCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { IoMdRefreshCircle } from "react-icons/io";
import apiClent from '../services/api'


const Admin_Dashboard = () => {
  const navigate = useNavigate();

  const [alldata, setalldata] = useState([]);
  const [admindata, setadmindata] = useState('');
  const [adminsearch, setadminsearch] = useState('');
  const [isLoading,setisLoading] = useState(true);


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

  const loaddata = useCallback(async () => {
    setisLoading(true);

    try {
      const response = await apiClent.get('/loaddata');
      setalldata(response.data);
    }
    catch (err) {
      
      toast.error(err);
    }
    finally
    {
      setisLoading(false);
    }


  },[]);

  useEffect(() => {
    loaddata();
  },[loaddata]);



  const ham = () => {
    document.getElementById('hamb').style.left = "0";
  }
  const close = () => {
    document.getElementById('hamb').style.left = "-10000px";
  }

  const searchdata = async () => {
    try {
      const responce = await apiClent.post('/adminsearch', { adminsearch });
      setalldata(responce.data);
    }
    catch (err) {
      toast.error(err);
    }

  }

  const logout = () => {
    sessionStorage.removeItem('token');
    navigate('/Admin');
    toast.info("Log Out!");
  }


  return (
    <>

      <div id='hamb' style={{ left: -100000 }} className='duration-[0.5s] bg-blue-400 text-white p-5 absolute h-[120vh] rounded max-[550px]:w-[70vw] w-[40vw] z-[1] transition-all  m-1'>
        <div className='grid gap-5 hover:cursor-pointer'>
          <div onClick={close} className='text-2xl'>
            <IoCloseCircle />
          </div>
      
            <Link className='backdrop-blur-sm bg-white/30 p-4 rounded' to={'/Admin_Edit'}> Edit User</Link>

            <Link className='backdrop-blur-sm bg-white/30 p-4 rounded' to={'/Admin_worklocationdata'}> Work Location Data</Link>
         
        </div>


      </div>
      <div id='header' className='  m-1 rounded bg-blue-200 shadow-2xl  backdrop-blur-sm'>

        <Timer />

        <div id='nav' className='flex justify-between gap-4 p-3 items-center'>
          <div className='text-3xl text-bold hover:cursor-pointer' onClick={ham}>
            <IoReorderThreeOutline />
          </div>
          <div className='flex gap-4 items-center'>
            <span className='font-bold'>{admindata.username}</span>
            <button onClick={logout} className='flex items-center  gap-2 max-[750px]:my-0 px-4 max-[750px]:text-[15px] hover:cursor-pointer text-xl p-2  bg-purple-900 text-white rounded-lg'><span className='text-[14px]'>Log out</span><FiLogOut className='hover:text-2xl duration-[0.5s]' /></button>
          </div>
        </div>

      </div>

      <div id='contain' className='h-[100vh] duration-[0.5s] bg-blue-400 shadow-2xl m-2 rounded'>
        <div className=' flex m-1 p-2 justify-between  items-center max-[400px]:gap-2' >

          <div className='gap-3 flex'>

            <input type={"text"} onChange={(e) => { setadminsearch(e.target.value) }} className='p-1 rounded' placeholder=' Search...Username' />
            <button onClick={searchdata} className='backdrop-blur-sm bg-white/30 rounded px-4 py-1 max-[400px]:px-3 max-[400px]:py-1'>Search</button>
          </div>
          <div>
            <IoMdRefreshCircle onClick={loaddata} className='text-2xl cursor-pointer hover:text-3xl duration-[0.5s]' />
          </div>

        </div>
        <div className='duration-[0.5s] h-[80vh] overflow-auto m-2 p-2  shadow-xl bg-white rounded '>
          <table className=' max-[400px]:text-[15px] w-full text-center font-light'>
            <thead>
              <tr className='border-b-2 sticky top-0 bg-white backdrop-blur-2xl rounded-lg'>
                <td className='  font-semibold'>User Id</td>
                <td className='  font-semibold'> Fullname</td>
                <td className='  font-semibold'> Username</td>
                <td className='  font-semibold'>Email</td>
                <td className='  font-semibold'>Lastlogin</td>
                <td className='  font-semibold'>Workcode</td>
                <td className='  font-semibold'>Latitude</td>
                <td className='  font-semibold'>Longitude</td>
                <td className='  font-semibold'></td>


              </tr>
            </thead>

            <tbody>
              {

                

                alldata && alldata.length > 0 && (
                  alldata.map((user) => (
                    <tr key={user._id} className="">
                      <td className="border-r-2 rounded p-3">{user.User_id}</td>
                      <td className="border-r-2 rounded p-3">{user.User_fullname}</td>
                      <td className="border-r-2 rounded p-3">{user.Username}</td>
                      <td className="border-r-2 rounded p-3">{user.User_email}</td>
                      <td className="border-r-2 rounded p-3">{user.User_lastlogin.split(' ').splice(0,5).join(' ')}</td>
                      <td className="border-r-2 rounded p-3">{user.User_Workcode}</td>
                      <td className="border-r-2 rounded p-3">{user.User_workLatitude}</td>
                      <td className="rounded p-3">{user.User_workLongitude}</td>


                      <td className="rounded p-3">
                        <Link to='/Admin_datali' state={{ id: user.User_id, username: user.Username }} className='shadow-md px-6 max-[750px]:text-[12px] hover:cursor-pointer text-[14px] p-1 text-white bg-purple-900 font-bold rounded-full'>DATA</Link></td>
                    </tr>
                  ))
                )}
                {
                  alldata.length <= 0 && isLoading == false  && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No Data Available
                    </td>
                  </tr>
                )
                }
            </tbody>


          </table>  
          {
            isLoading && alldata == false && (<div className=" mt-[10%] flex flex-col items-center justify-center space-y-3">
        <div className="text-lg font-semibold text-gray-700">Loading data...</div>
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>)
          }
      

        </div>


      </div>


    </>
  );
}

export default Admin_Dashboard;
