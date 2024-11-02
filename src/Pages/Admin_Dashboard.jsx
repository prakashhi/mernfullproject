import React from 'react';
import { FaHamburger, FaTable } from 'react-icons/fa';
import Timer from '../Components/Timer';
import { IoReorderThreeOutline } from "react-icons/io5"
import { Link } from 'react-router-dom';
import { IoCloseCircle } from 'react-icons/io5';

const Admin_Dashboard = () => {
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
        <div className=' flex m-2 p-2 gap-5 items-center max-[400px]:gap-3' >
          <span>Enter Userid</span>
          <input type={"text"} className='p-1 rounded' placeholder='Search...' />
          <button className='backdrop-blur-sm bg-white/30 rounded px-4 py-2 max-[400px]:px-3 max-[400px]:py-1'>Search</button>
        </div>
        <div className='duration-[0.5s] m-2 p-2  backdrop-blur-sm bg-white/20 rounded '>
          <table className='h-[80vh] max-[400px]:text-[15px]'>
            <tr className='flex gap-4 '>
              <td className='bg-red-300 rounded p-1'>User Entry_Data</td>
              <td className='bg-red-300 rounded p-1'>User Exit_Data</td>
              <td className='bg-red-300 rounded p-1'>User Data_Day</td>
            </tr>
            <tr className='flex gap-6'>
              <td>User Entry_Data</td>
              <td>User Exit_Data</td>
              <td>User Data_Day</td>
            </tr>
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
