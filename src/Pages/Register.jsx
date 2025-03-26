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

                                load == true ? (<div className='hover:px-9  duration-[0.5s] p-10 py-2 text-white bg-fuchsia-600 rounded-md'><svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg></div>) : <button className='duration-[0.5s] bg-fuchsia-600 hover:px-20 rounded px-[50px] py-2 text-white font-bold' onClick={submit}>Register</button>

                            }


                        </div>
                        




                    </div>

                </div>
            </div>
        </>
    );
}

export default Register;
