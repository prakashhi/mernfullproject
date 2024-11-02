import React from 'react';
import { Link } from "react-router-dom";
import Timer from '../Components/Timer';
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";

const Admin_login = () => {
  return (
    <>
    <div className='h-[100vh] bg-gradient-to-r from-violet-500 to-fuchsia-500'>
                <Timer />
                <div className='flex justify-center '>

                    <div className='backdrop-blur-sm bg-white/30 inline-grid p-10 rounded w-[40%] max-[800px]:w-[95%] duration-[0.5s]'>
                        <span className='text-4xl text-center p-4 font-semibold text-white'>Admin Login</span>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>Username</span>
                                <FaUser className='text-white text-xl' />
                            </div>

                            <input className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />

                        </div>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid p-2 relative rounded'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>Password</span>
                                <FaKey className='text-white text-xl' />
                            </div>
                            <input className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none' type="password" />

                        </div>
                        <div id='btn' className='w-full flex justify-center m-2'>
                            <button className='hover:px-9 duration-[0.5s] bg-gradient-to-r from-blue-300 to-pink-500 font-extrabold px-7 py-2 rounded'>Log in</button>

                        </div>
                        
                    </div>
                </div>
            </div>
    </>
  );
}

export default Admin_login;
