import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Timer from '../Components/Timer';
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom'

import axios from 'axios';



const Login = () => {
    const [lusername, setlusername] = useState('');
    const [luserpass, setluserpass] = useState('');
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const navigate = useNavigate()

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    toast.error(error.message);
                },
                {
                    enableHighAccuracy: true, // Ensures high accuracy
                    timeout: 10000, // Wait for up to 10 seconds
                    maximumAge: 0, // Do not use a cached position
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const submit = async () => {
        if ([lusername, luserpass].some(i => i.length <= 0)) {
            toast.error("Enter Username and Password");
        }
        else {
            console.log("clicked", lusername, luserpass)
            try {
                const res = await axios.post('/api/login', { lusername, luserpass });
                navigate("/Dashboard");
                toast.success("Login sucessfull");
            } catch (error) {
                navigate("/");
                toast.error("Invalid Username or Password");
                console.error(error);
            }
        }

    }

    return (
        <>
            <div className='h-[100vh] bg-gradient-to-r from-violet-500 to-fuchsia-500'>
                <Timer />
                <div className='flex justify-center '>

                    <div className='backdrop-blur-sm bg-white/30 inline-grid max-[800px]:p-3 p-10 rounded w-[40%] max-[800px]:w-[95%] duration-[0.5s]'>
                        <span className='text-4xl text-center p-4 font-semibold text-white'>Login</span>

                        <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid p-2 relative rounded mb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>Username</span>
                                <FaUser className='text-white text-xl' />
                            </div>

                            <input onChange={(e) => { setlusername(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none ' type="text" />

                        </div>
                        <div className='bg-gradient-to-r from-slate-500 to-slate-800 inline-grid p-2 relative rounded'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xl text-slate-400'>Password</span>
                                <FaKey className='text-white text-xl' />
                            </div>
                            <input onChange={(e) => { setluserpass(e.target.value) }} className='text-white rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none' type="password" />

                        </div>
                        <div id='btn' className='w-full flex justify-center m-2'>
                            <button onClick={submit} className='hover:px-9 duration-[0.5s] bg-gradient-to-r from-blue-300 to-pink-500 font-extrabold px-7 py-2 rounded'>Log in</button>

                        </div>
                        <p>Don't have an account?<Link className='underline text-blue-300' to="/Register" >Register</Link></p>

                        <p>Don't have an account?<a className='underline text-blue-300' href="/Dashboard">Dashboard</a></p>

                    </div>
                </div>
                <h2>User Location</h2>
                {location.latitude && location.longitude ? (
                    <p>

                    </p>
                ) : (
                    <p>Fetching location...</p>
                )}
            </div>
            <div>

                {/* {error && <p>Error: {error}</p>} */}
            </div>

        </>
    );
}

export default Login;
