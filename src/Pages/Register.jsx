import React from 'react';
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    const navigate = useNavigate()

    const [fname, setfname] = useState('');

    const [uemail, setuemail] = useState('');
    const [umobile, setumobile] = useState(null);
    const [username, setusername] = useState('');
    const [workLoctioncode, setworkLoctioncode] = useState(null);
    const [upass, setupass] = useState('');

    const notify = () => toast("This is a toast notification !");
    const submit = async (e) => {
        e.preventDefault();

        if ([fname, uemail, umobile, username, upass, workLoctioncode].some(i => i.length <= 0)) {
            toast.error("Fill out all fields!");
        }
        else {
            if ([umobile, workLoctioncode].some(i => isNaN(i))) {
                toast.error("Enter Numbers!");

            } if (umobile.length < 10 || umobile.length > 10) {
                toast.error("Mobile number must be exactly 10 digits")
            }
            if (!/\S+@\S+\.\S+/.test(uemail)) {
                toast.error("Email address is invalid!");
            }
            if (upass.length <= 6) {
                toast.error("Password must be at least 6 characters");
            }
            else {


                try {
                    const res = await axios.post('api/register_data', { fname, uemail, umobile, username, upass, workLoctioncode })

                    if (res.data == "code200") {
                        navigate("/");
                        toast.success("Registration is sucessfull");

                    }
                    if (res.data == "code01") {
                        navigate("/Register");
                        toast.error("Username is allready Exits!!");
                    }
                    else {
                        console.log(res.data);
                    }

                }
                catch (err) {
                    console.log(err)
                }

            }
        }




    }

    const ham = () => {
        document.getElementById('hamb').style.left = "0"
    }
    const close = () => {
        document.getElementById('hamb').style.left = "-1000px"
    }


    return (
        <>


            <div className='bg-blue-400 h-[1000px]'>

                <div className='flex justify-center '>

                    <div className='shadow-2xl max-[800px]:p-4 backdrop-blur-sm bg-white/30 inline-grid p-10 rounded w-[40%] max-[800px]:w-[95%] duration-[0.5s] my-4'>
                        <span className='text-4xl text-center p-4 font-semibold text-white'>Register</span>
                        <h1>Persional Details</h1>

                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-white'>Full Name</span>
                                <FaUser className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setfname(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                        </div>


                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-white'>User Email</span>
                                <MdEmail className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setuemail(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="email" />
                        </div>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-white'>User MobileNo</span>
                                <FaMobile className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setumobile(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                        </div>


                        <h1>Face Register</h1>
                        <div className='text-3xl text-bold hover:cursor-pointer' onClick={ham}>
                            <IoReorderThreeOutline className='' />
                        </div>
                        <div id='hamb' style={{ left: -1000 }} className='duration-[0.5s] bg-blue-400 text-white p-5 absolute h-[100%] rounded  w-[100%] z-[1] transition-all  m-1'>
                            <div className='grid gap-5 '>
                                <div onClick={close} className='text-2xl hover:cursor-pointer'>
                                    <IoCloseCircle />
                                </div>

                                <Camera />
                            </div>

                        </div>




                        <h1>Profissonal Details</h1>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-white'>Username</span>
                                <FaUser className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setusername(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />
                        </div>

                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-white'>WorkLoactioncode</span>
                                <FaLocationDot className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setworkLoctioncode(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none' type="text" />

                        </div>



                        <div className='bg-gradient-to-r from-slate-500 to-slate-800  inline-grid p-2 relative rounded'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-white'>Password</span>
                                <FaKey className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setupass(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none' type="password" />

                        </div>



                        <div id='btn' className='w-full flex justify-center m-2'>
                            <button className='duration-[0.5s] bg-fuchsia-600 hover:px-20 rounded px-[50px] py-2 text-white font-bold' onClick={submit}>Register</button>

                        </div>



                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
