import React, { useState } from 'react';
import Timer from '../Components/Timer';
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import apiClent from '../services/api'
import 'ldrs/dotSpinner'


const Admin_login = () => {
    const navigate = useNavigate()
    const [uuser, setuser] = useState('');
    const [upass, setpass] = useState('');
    const [load, setload] = useState(false);

    const submit = async (e) => {
        setload(true);
        e.preventDefault();

        if ([uuser, upass].some(i => i.length <= 0)) {
            setload(false);
            toast.error("Enter Username and Password");
        }
        else {
            try {
                const res = await apiClent.post('/admin_login', { uuser, upass });
                sessionStorage.setItem('token', res.data.token);
                navigate("/A_Dash");
                toast.success("Login sucessfull");

            } catch (error) {
                setload(false);
                if (error.response && error.response.status === 400) {
                    navigate("/Admin");
                    toast.error("Invalid Username or Password");
                } else {
                    toast.error("Login failed");
                }
            }
        }


    }
    return (
        <>
            <div className='h-[1000px] bg-blue-400 '>
                <Timer />
                <div className='flex justify-center '>

                    <div className='shadow-2xl backdrop-blur-sm bg-white/30 inline-grid max-[800px]:p-4 p-10 rounded w-[40%] max-[800px]:w-[95%] duration-[0.5s]'>

                        <span className='text-4xl text-center p-4 font-semibold text-white'>Admin Login</span>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-white'>Username</span>
                                <FaUser className='text-white text-xl' />
                            </div>

                            <input onChange={(e) => { setuser(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />

                        </div>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid p-2 relative rounded'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-white'>Password</span>
                                <FaKey className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setpass(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none' type="password" />

                        </div>
                        <div id='btn' className='w-full flex justify-center m-2'>

                            {
                                load == true ? (<span className='px-9 py-2 bg-slate-500 rounded-md'>
                                <l-dot-spinner
                                    size="15"
                                    speed="0.9"
                                    color="white"
                                ></l-dot-spinner></span>) : <button onClick={submit} className='hover:px-9 duration-[0.5s] hover:py-3  text-white bg-fuchsia-600 rounded-md font-extrabold px-7 py-2 '>Log in</button>
                            }


                        </div>
                      

                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin_login;
