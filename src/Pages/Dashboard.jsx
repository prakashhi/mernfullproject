import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { IoRefreshOutline } from "react-icons/io5";
import { HiUserAdd } from "react-icons/hi";
import Timer from '../Components/Timer';
import axios from 'axios';
import { toast } from 'react-toastify';


const Dashboard = () => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    const [logbtn, setlogbtn] = useState(false);
    const [userdata, setUserdata] = useState(null);
    const [userdb, setuserdb] = useState(false);
    const [entryc, setentryc] = useState(false);
    const [exitc, setexitc] = useState(false);


    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirect to login if no token
        } else {
            try {
                // Decode the token (using the base64 payload)
                const payload = JSON.parse(atob(token.split('.')[1]));

                // Check if the token is expired
                const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

                if (payload.exp && payload.exp < currentTime) {
                    toast.info('Sessionhas expired');
                    sessionStorage.removeItem('token'); // Clear the expired token
                    navigate('/'); // Redirect to login
                } else {
                    setUserdata(payload); // Token is valid, set user data
                }
            } catch (error) {
                console.error('Invalid token:', error);
                sessionStorage.removeItem('token'); // Clear invalid token
                navigate('/'); // Redirect if token is invalid
            }
            finally {
                setLoading(false); // Ensure loading is set to false regardless of the outcome
            }
        }


    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userdata) {
        return <div>Redirecting...</div>;
    }

    const no = userdata.userId;



    const checkbtn = async () => {
        try {
            await axios.post('/api/check', { no });
            setlogbtn(true);

        }
        catch (error) {
            if (error.response.status === 404) {
                setuserdb(true);

            }
            else if (error.response.status === 400) {
                setentryc(true);

            }
            else if (error.response.status === 401) {
                setexitc(true);
                setentryc(false);
            }

        }

    }




    const newuserdata = async () => {
        try {
            await axios.post('/api/newuserdata', { no });
            toast.success("User Created in Database");
        }
        catch (error) {
            if (error.response.status === 400) {
                toast.info("UserData Exiting");
            } else {
                toast.error(`Error: ${error.response.status} - ${error.response.statusText}`);
            }
        }

    }




    const AddIndata = async () => {
        try {
            await axios.post('/api/Enter_data', { no });
            toast.success("Today's entry data has been successfully saved!");
        }
        catch (error) {
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                if (error.response.status === 400) {
                    toast.info("You’ve already registered your Entry time for today!");
                } else {
                    toast.error(`Error: ${error.response.status} - ${error.response.statusText}`);
                }
            } else {
                console.error('Network Error:', error);
                toast.error("DataSave Failed: Network or server issue.");
            }
        }

    }

    const Exitdata = async () => {
        setlogbtn(true);
        try {
            await axios.post('/api/Exit_data', { no });
            toast.success("Today's Exitdata has been successfully saved!");
        }
        catch (error) {
            if (error.response && error.response.status === 401) {
                toast.info("You’ve already registered your Exitentry time for today!");
            } else {
                toast.error(`Error: ${error.response.status} - ${error.response.statusText}`);
            }
        }

    }



    const logout = () => {
        sessionStorage.removeItem('token');
        navigate('/');
        toast.info("Log Out!");
    }

    return (

        <>
            {userdata ? (
                <>
                    <div className='max-[750px]:p-2 p-3 h-[100%] duration-[0.5s]'>
                        <div className='bg-blue-200 shadow-2xl  rounded '>
                            <Timer />
                            <div className='max-[500px]:grid flex justify-between p-3 items-center my-3 rounded'>
                                <div className='grid'>
                                    <p className='max-[750px]:text-[15px] text-xl font-extralight'>Id:{userdata.userId} </p>
                                    <p className='max-[750px]:text-[15px]  text-xl font-extralight'>Username:{userdata.username}</p>
                                </div>
                                <button onClick={() => {
                                    navigate("/User_data")
                                }} className='shadow-2xl  duration-[0.5s] px-6 max-[750px]:text-[15px] hover:cursor-pointer text-xl hover:text-2xl font-bold p-2 text-white bg-fuchsia-600 rounded-full'>View Data</button>
                            </div>
                        </div>


                        <div className='shadow-2xl max-[750px]:p-2  p-5 py-10 bg-blue-400 rounded h-[50vh]'>
                            <div className='flex justify-end p-[10px]'>
                                <IoRefreshOutline onClick={checkbtn} className='duration-[0.5s] text-2xl cursor-pointer hover:text-3xl' />
                            </div>
                            <div className='p-2 rounded-lg backdrop-blur-sm bg-white/20  shadow-xl '>
                                {
                                    userdb === true && (<div className='max-[450px]:grid flex '>
                                        <button onClick={newuserdata} className=' duration-[0.5s] p-6 font-bold shadow-3xl bg-purple-900 text-white rounded-full m-5 flex justify-center items-center gap-3 hover:text-2xl text-xl'><HiUserAdd className=' duration-[0.5s] text-2xl ' />Create Newuser</button>
                                    </div>)
                                }

                                {
                                    entryc === true && (<div className='max-[750px]:grid flex justify-between my-9'>
                                        <div className='bg-blue-900 grid items-center text-xl font-bold text-white p-3 rounded m-3 max-[750px]:w-[60vw] max-[750px]:justify-center  w-[40%] '>
                                            Toady Time Check In
                                        </div>
                                        <button onClick={AddIndata} className='duration-[0.5s] shadow-2xl p-3 px-5 hover:text-xl bg-white rounded-full  font-bold m-5'>Check In</button>
                                    </div>)


                                }

                                {
                                    exitc === true && (<div className='max-[750px]:grid flex justify-between'>
                                        <div className='bg-blue-900 grid items-center text-xl font-bold text-white p-3 rounded m-3 max-[750px]:w-[60vw] max-[750px]:justify-center  w-[40%] '>
                                            Toady Time Check Out
                                        </div>
                                        <button onClick={Exitdata} className='duration-[0.5s] shadow-2xl p-3 px-5 hover:text-xl bg-white rounded-full font-bold m-5'>Check Out</button>
                                    </div>)
                                }

                            </div>
                            {
                                logbtn === true && (<button onClick={logout} className='duration-[0.5s] flex items-center hover:text-xl font-semibold gap-2 my-8  px-6  max-[750px]:text-[15px] hover:cursor-pointer text-xl p-2  bg-purple-900 text-white rounded-full'>Log out<FiLogOut className='font-semibold' /></button>)
                            }

                        </div>



                    </div>
                </>
            ) : (
                <p className=''>Loading...</p>
            )}

        </>
    );
}

export default Dashboard;
