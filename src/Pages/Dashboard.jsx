import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../Components/Timer';

const Dashboard = () => {
    const navigate =useNavigate()

    useEffect(() => {
     
  
    }, []);
   
    return (
        <>
            <div className='max-[750px]:p-2 p-3  bg-gradient-to-r from-violet-500 to-fuchsia-500 h-[100vh] duration-[0.5s]'>
                <div className='bg-slate-200 rounded '>
                    <Timer />
                    <div className='  flex justify-between p-3 items-center my-3 rounded'>
                        <p className='max-[750px]:text-[15px] max-[750px]:font-semibold text-xl font-mono'>Userid:</p>
                        <button onClick={()=>{
                            navigate("/User_data")
                        }} className='px-6 max-[750px]:text-[15px] hover:cursor-pointer text-xl p-2 text-white bg-gradient-to-r from-fuchsia-600 to-bg-pink-600 rounded'>View Data</button>
                    </div>
                </div>
                <div className='max-[750px]:p-2 max-[750px]:py-28 p-5 py-40 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded'>
                    <div className=' p-2  rounded-lg backdrop-blur-sm bg-white/30 '>
                        <div className='flex justify-between my-9'>
                            <div className='bg-slate-800 text-white p-3 rounded m-3 max-[750px]:w-[50%] w-[40%] font-thin'>
                                Toady Time Check In
                            </div>
                            <button className='px-6 bg-white rounded m-5'>Check In</button>
                        </div>
                        <div className='flex justify-between'>
                            <div className='bg-slate-800 text-white p-3 rounded m-3 max-[750px]:w-[50%] w-[40%] font-thin'>
                                Toady Time Check Out
                            </div>
                            <button className='px-6 bg-white rounded m-5'>Check Out</button>
                        </div>
                    </div>
                    <button className='my-8  px-6  max-[750px]:text-[15px] hover:cursor-pointer text-xl p-2 text-slate-700 bg-gradient-to-r from-neutral-300 to-bg-stone-400 rounded'>Log out</button>

                </div>



            </div>
        </>
    );
}

export default Dashboard;
