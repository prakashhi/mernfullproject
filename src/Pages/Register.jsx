import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMobile } from "react-icons/fa";
const Register = () => {

    return (
        <>
            <div className='bg-gradient-to-r from-violet-500 to-fuchsia-500 '>

                <div className='flex justify-center '>

                    <div className='backdrop-blur-sm bg-white/30 inline-grid p-10 rounded w-[40%] max-[800px]:w-[95%] duration-[0.5s] my-4'>
                        <span className='text-4xl text-center p-4 font-semibold text-white'>Register</span>
                        <h1>Persional Details</h1>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>First Name</span>
                                <FaUser className='text-white text-xl' />
                            </div>
                            <input className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                        </div>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>Last Name</span>
                                <FaUser className='text-white text-xl' />
                            </div>
                            <input className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                        </div>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>User Email</span>
                                <MdEmail className='text-white text-xl' />
                            </div>
                            <input className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="email" />
                        </div>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>User MobileNo</span>
                                <FaMobile className='text-white text-xl' />
                            </div>
                            <input className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                        </div>
                        <h1>Profissonal Details</h1>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>Username</span>
                                <FaUser className='text-white text-xl' />
                            </div>
                            <input className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                        </div>
                        
                        
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800   p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <input placeholder="User workLatitude" className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                                <FaMobile className='text-white text-xl' />
                            </div>
                        </div>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800   p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <input placeholder="User workLongitude" className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                                <FaMobile className='text-white text-xl' />
                            </div>
                        </div>

                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>Password</span>
                                <FaKey className='text-white text-xl' />
                            </div>
                            <input className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none' type="password" />

                        </div>



                        <div id='btn' className='w-full flex justify-center m-2'>
                            <button className='bg-blue-300 px-7 py-2 rounded'>Register</button>

                        </div>



                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
