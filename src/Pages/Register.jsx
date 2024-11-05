import React from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { IoCloseCircle } from 'react-icons/io5';
import { IoReorderThreeOutline } from "react-icons/io5"
import axios from 'axios';
import { FaLocationDot } from "react-icons/fa6"
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMobile } from "react-icons/fa";
import { useRef, useEffect, useState } from 'react';
import Camera from '../Components/Camera';
const Register = () => {

    const [fname, setfname] = useState('');
    const [lname, setlname] = useState('');
    const [uemail, setuemail] = useState('');
    const [umobile, setumobile] = useState('');
    const [username, setusername] = useState('');
    const [workLatitude, setworkLatitude] = useState('');
    const [workLongitude, setworkLongitude] = useState('');
    const [upass, setupass] = useState('');


    const submit = async (e) => {
        e.preventDefault();
        console.log(fname, lname, uemail, umobile, username, workLatitude, workLongitude, upass)
        await axios.post('api/register_data', { fname, lname, uemail, umobile, username, workLatitude, workLongitude, upass })
    }
    const ham = () => {
        document.getElementById('hamb').style.left = "0"
    }
    const close = () => {
        document.getElementById('hamb').style.left = "-1000px"
    }


    return (
        <>
            <div className='bg-gradient-to-r from-violet-500 to-fuchsia-500 '>

                <div className='flex justify-center '>

                    <div className='max-[800px]:p-4 backdrop-blur-sm bg-white/30 inline-grid p-10 rounded w-[40%] max-[800px]:w-[95%] duration-[0.5s] my-4'>
                        <span className='text-4xl text-center p-4 font-semibold text-white'>Register</span>
                        <h1>Persional Details</h1>

                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>First Name</span>
                                <FaUser className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setfname(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                        </div>

                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>Last Name</span>
                                <FaUser className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setlname(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                        </div>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>User Email</span>
                                <MdEmail className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setuemail(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="email" />
                        </div>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>User MobileNo</span>
                                <FaMobile className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setumobile(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                        </div>


                        <h1>Face Register</h1>
                        <div className='text-3xl text-bold' onClick={ham}>
                            <IoReorderThreeOutline />
                        </div>
                        <div id='hamb' style={{ left: -1000 }} className='duration-[0.5s] bg-gradient-to-r from-emerald-400 to-cyan-400 text-white p-5 absolute h-[100%] rounded  w-[100%] z-[1] transition-all  m-1'>
                            <div className='grid gap-5 '>
                                <div onClick={close} className='text-2xl'>
                                    <IoCloseCircle />
                                </div>

                                <Camera />
                            </div>

                        </div>




                        <h1>Profissonal Details</h1>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>Username</span>
                                <FaUser className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setusername(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                        </div>


                        <div className='bg-gradient-to-r from-slate-500 to-slate-800   p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <input onChange={(e) => { setworkLatitude(e.target.value) }} placeholder="User workLatitude" className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                                <FaLocationDot className='text-white text-xl' />
                            </div>
                        </div>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800   p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <input onChange={(e) => { setworkLongitude(e.target.value) }} placeholder="User workLongitude" className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                                <FaLocationDot className='text-white text-xl' />
                            </div>
                        </div>

                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>Password</span>
                                <FaKey className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setupass(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none' type="password" />

                        </div>



                        <div id='btn' className='w-full flex justify-center m-2'>
                            <button className='bg-blue-300 px-7 py-2 rounded' onClick={submit}>Register</button>

                        </div>



                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
