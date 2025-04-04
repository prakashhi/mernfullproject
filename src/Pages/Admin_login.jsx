import React, { useState } from 'react';
import Timer from '../Components/Timer';
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import apiClent from '../services/api'



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
                setload(false);

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
                                load == true ? (<div className='hover:px-9  duration-[0.5s] p-10 py-2 text-white bg-fuchsia-600 rounded-md'><svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg></div>) : <button onClick={submit} className='hover:px-9 duration-[0.5s] hover:py-3  text-white bg-fuchsia-600 rounded-md font-extrabold px-7 py-2 '>Log in</button>
                            }


                        </div>
                      

                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin_login;
