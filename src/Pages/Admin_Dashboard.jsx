import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Timer from '../Components/Timer';
import { IoReorderThreeOutline } from "react-icons/io5"
import { Link } from 'react-router-dom';
import { IoCloseCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { IoMdRefreshCircle } from "react-icons/io";

const Admin_Dashboard = () => {

  const [alldata, setalldata] = useState([]);

  const loaddata = async () => {
    try {
      const responce = await axios.get('api/loaddata');
      setalldata(responce.data);
    }
    catch (err) {
      toast.error(err)
    }

  }

  const refresh = () => {
    loaddata();
  }
  useEffect(() => {
    loaddata();
  }, []);

  const ham = () => {
    document.getElementById('hamb').style.left = "0"
  }
  const close = () => {
    document.getElementById('hamb').style.left = "-1000px"
  }
  return (
    <>

      <div id='hamb' style={{ left: -1000 }} className='duration-[0.5s] bg-gradient-to-r from-emerald-400 to-cyan-400 text-white p-5 absolute h-[120vh] rounded max-[550px]:w-[70vw] w-[40vw] z-[1] transition-all  m-1'>
        <div className='grid gap-5 '>
          <div onClick={close} className='text-2xl'>
            <IoCloseCircle />
          </div>

          <div className='backdrop-blur-sm bg-white/30  p-4 rounded'>
            <Link to={'/A_Dash'}> Show User</Link>
          </div>
          <div className='backdrop-blur-sm bg-white/30 p-4 rounded'>
            <Link to={'/Admin_Edit'}> Edit User</Link>
          </div>
        </div>


      </div>
      <div id='header' className='  m-1 rounded bg-gradient-to-r from-emerald-400 to-cyan-400 backdrop-blur-sm bg-white/30'>

        <Timer />

        <div id='nav' className='flex justify-between gap-4 p-3 items-center'>
          <div className='text-3xl text-bold' onClick={ham}>
            <IoReorderThreeOutline />
          </div>
          <div className='flex gap-4'>
            <span>Username</span>
            <button>Log Out</button>
          </div>
        </div>

      </div>

      <div id='contain' className='h-[100vh] duration-[0.5s] bg-gradient-to-r from-violet-500 to-fuchsia-500 m-2 rounded'>
        <div className=' flex m-1 p-2 justify-between  items-center max-[400px]:gap-6' >

          <div className='gap-5 flex'>

            <input type={"text"} className='p-1 rounded' placeholder=' Search...Username' />
            <button className='backdrop-blur-sm bg-white/30 rounded px-4 py-1 max-[400px]:px-3 max-[400px]:py-1'>Search</button>
          </div>
          <div>
            <IoMdRefreshCircle onClick={refresh} className='text-3xl cursor-pointer' />
          </div>

        </div>
        <div className='duration-[0.5s] h-[80vh] overflow-auto m-2 p-2  backdrop-blur-sm bg-white/20 rounded '>
          <table className=' max-[400px]:text-[15px] w-full text-center font-light'>
            <tr className='border-b-2 sticky'>
              <td className=' rounded'>User Id</td>
              <td className=' rounded '> Fullname</td>
              <td className=' rounded '> Username</td>
              <td className=' rounded '>Email</td>
              <td className=' rounded '>User Lastlogin</td>
            </tr>
            {

              alldata && alldata.length > 0 ? (
                alldata.map((user) => (
                  <tr key={user._id} className="">
                    <td className="border-r-2 rounded p-3">{user.User_id}</td>
                    <td className="border-r-2 rounded p-3">{user.User_fullname}</td>
                    <td className="border-r-2 rounded p-3">{user.Username}</td>
                    <td className="border-r-2 rounded p-3">{user.User_email}</td>
                    <td className="rounded p-3">{user.User_lastlogin}</td>
                    <td className="rounded p-3"><Link to={'/User_data'} state={user.User_id} className='px-6 max-[750px]:text-[12px] hover:cursor-pointer text-[14px] p-1 text-white bg-gradient-to-r from-fuchsia-600 to-bg-pink-600 rounded'>DATA</Link></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No Data Available
                  </td>
                </tr>
              )}

          </table>

        </div>
        <div className='m-2 p-2 flex gap-5 items-center'>
          <span>Month Of Working Days</span>
          <span className='bg-white px-4 py-1 rounded'>Days</span>

        </div>

      </div>


    </>
  );
}

export default Admin_Dashboard;
