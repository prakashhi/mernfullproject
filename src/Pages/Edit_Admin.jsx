import React from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { IoReorderThreeOutline } from "react-icons/io5"
import { Link } from 'react-router-dom';


const Edit_Admin = () => {
    const ham = () => {
        document.getElementById('hamb').style.left = "0"
    }
    const close = () => {
        document.getElementById('hamb').style.left = "-1000px"
    }
    return (
        <>
            <div id='contain' className='h-[100vh] duration-[0.5s] bg-blue-400 shadow-2xl m-2 rounded'>
                <div id='hamb' style={{ left: -1000 }} className='duration-[0.5s] bg-gradient-to-r from-emerald-400 to-cyan-400 text-white p-5 absolute h-[120vh] rounded max-[550px]:w-[70vw] w-[40vw] z-[1] transition-all  m-1'>
                    <div className='grid gap-5 '>
                        <div onClick={close} className='text-2xl'>
                            <IoCloseCircle />
                        </div>

                        <div className='backdrop-blur-sm bg-white/30  p-4 rounded'>
                            <Link to={'/A_Dash'}> Show User</Link>
                        </div>
                        <div className='backdrop-blur-sm bg-white/30 p-4 rounded'>
                            <Link to={'/Admin_Edit'}> Edit User</Link>
                        </div>
                    </div>

                </div>

                <div className=' flex m-2 p-2 gap-5 items-center max-[400px]:gap-3' >
                    <div className='text-3xl text-bold' onClick={ham}>
                        <IoReorderThreeOutline />
                    </div>
                    <span>Enter Userid</span>
                    <input type={"text"} className='p-1 rounded' placeholder='Search...' />
                    <button className='backdrop-blur-sm bg-white/30 rounded px-4 py-2 max-[400px]:px-3 max-[400px]:py-1'>Edit</button>
                </div>
                <div className='p-2 m-2 rounded backdrop-blur-sm bg-white/30 grid gap-5'>
                    <div className='flex gap-4 '>
                        <span>Userid</span>
                        <input className='rounded' />
                    </div>
                    <div className='flex gap-4 '>
                        <span>Username</span>
                        <input className='rounded' />
                    </div>

                    <button className='backdrop-blur-sm bg-white/30 w-[35%] rounded px-4 py-2 max-[400px]:px-3 max-[400px]:py-1'>Save</button>

                </div>
            </div>
        </>
    );
}

export default Edit_Admin;
