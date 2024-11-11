import React from 'react';
import Timer from '../Components/Timer';
import { useLocation } from 'react-router-dom';
import { IoMdRefreshCircle } from "react-icons/io";
import axios from 'axios';

const User_datali = () => {
  const location = useLocation();
  const id = location.state || {}

  const getdata = () =>{

    axios.get('api/getdta')

  }


  return (
    <>
      <div className='bg-gradient-to-r m-1 rounded from-violet-500 to-fuchsia-500'>
        <Timer />

      </div>
      <div id='contain' className='h-[100vh] duration-[0.5s]  bg-gradient-to-r from-violet-500 to-fuchsia-500 m-2 rounded'>
        <div className=' flex  justify-between m-2 p-2 gap-5 items-center max-[400px]:gap-3' >
          <div className='grid  bg-gradient-to-r from-emerald-400 to-cyan-400 font-extrabold p-2 rounded'>
            <span>Id : {id}</span>
            <span>Name : Prakash prajapti</span>
          </div>

          <div>
            <IoMdRefreshCircle onClick={getdata} className='text-3xl cursor-pointer' />
          </div>
        </div>
        <div className='duration-[0.5s] m-2 p-2  backdrop-blur-sm bg-white/20 rounded '>
        <table className=' max-[400px]:text-[15px] w-full text-center '>
            <tr className='border-b-2 sticky'>
              <td className=' rounded '>Workday</td>
              <td className=' rounded '>EntryTime</td>
              <td className=' rounded '>ExitTime</td>
            </tr>
            {/* {

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
              )} */}

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

export default User_datali;
