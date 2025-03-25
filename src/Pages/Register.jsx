import React from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoCloseCircle } from 'react-icons/io5';
import { IoReorderThreeOutline } from "react-icons/io5"
import { FaLocationDot } from "react-icons/fa6"
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMobile } from "react-icons/fa";
import { useState } from 'react';
import Camera from '../Components/Camera';
import { useLocation } from 'react-router-dom';
import apiClent from '../services/api'
import 'ldrs/dotSpinner'



const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [load, setload] = useState(false);


    const { savedEncodings = [] } = location.state || {};



    const [fname, setfname] = useState('');
    const [uemail, setuemail] = useState('');
    const [umobile, setumobile] = useState(null);
    const [username, setusername] = useState('');
    const [workLoctioncode, setworkLoctioncode] = useState(null);
    const [upass, setupass] = useState('');
    const [encodeingface, setencodeingface] = useState([]);
    const [showCamera, setShowCamera] = useState(false);

    const submit = async (e) => {
        setload(true);
        //Submit Functionality
        e.preventDefault();

        if ([fname, uemail, umobile, username, upass, workLoctioncode].some(i => i.length <= 0)) {
            setload(false);
            toast.error("Fill out all fields!");
        }
        else {
            if ([umobile, workLoctioncode].some(i => isNaN(i))) {
                setload(false);
                toast.error("Enter Numbers!");

            } if (umobile.length < 10 || umobile.length > 10) {
                setload(false);
                toast.error("Mobile number must be exactly 10 digits")
            }
            if (!/\S+@\S+\.\S+/.test(uemail)) {
                setload(false);
                toast.error("Email address is invalid!");
            }
            if (upass.length <= 6) {
                setload(false);
                toast.error("Password must be at least 6 characters");
            }
            else {

                try {

                    const res = await apiClent.post('/register_data', { fname, uemail, umobile, username, upass, workLoctioncode, savedEncodings });


                    if (res.data == "code200") {
                        navigate("/");
                        toast.success("Registration is sucessfull");

                    }
                    if (res.data == "code01") {
                        setload(false);
                        navigate("/Register");
                        toast.error("Username is allready Exits!!");
                    }


                }
                catch (error) {
                    setload(false);
                    console.log(error);
                    toast.error(error);
                }

            }
        }

    }


    const toggleCamera = () => {
        setShowCamera((prev) => !prev);
    };


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
                        <div className='duration-[0.5s] text-3xl text-bold hover:cursor-pointer' onClick={toggleCamera} >
                            <IoReorderThreeOutline className='' />
                        </div>

                        {
                            showCamera && (
                                <div id='hamb' className='duration-[0.5s] bg-blue-400 text-white p-5 absolute h-[100%] rounded  w-[100%] z-[1] transition-all  m-1'>
                                    <div className='grid gap-5 '>
                                        <div onClick={toggleCamera} className='duration-[0.5s] text-2xl hover:cursor-pointer'>
                                            <IoCloseCircle />
                                        </div>

                                        <Camera />
                                    </div>

                                </div>
                            )}



                        <div className="bg-white text-gray-700 p-3 rounded mt-3 overflow-auto h-[10vh]">
                            <h3 className="font-bold shadow-2xl">Received Face Encodings:</h3>
                            {savedEncodings.length > 0 ? (
                                savedEncodings.map((value, index) => (
                                    <div key={index} className="text-xs p-1 bg-gray-100 rounded shadow-md ">
                                        <span className="font-bold">[{index}]</span>: {value.toFixed(4)}
                                    </div>
                                ))
                            ) : (
                                <p>No face encodings received.</p>

                            )}
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
                            {

                                load == true ? (<span className='px-9 py-2  rounded-md bg-indigo-500'>
							Processing...</span>) : <button className='duration-[0.5s] bg-fuchsia-600 hover:px-20 rounded px-[50px] py-2 text-white font-bold' onClick={submit}>Register</button>

                            }


                        </div>




                    </div>

                </div>
            </div>
        </>
    );
}

export default Register;
