// import React from 'react';
import React, { useEffect } from 'react';
import { useState } from 'react';


const Timer = () => {

    const [dateTime, setDateTime] = useState(new Date());
    const [day, setday] = useState('');


    useEffect(() => {
        const currntday = new Date().getDay();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        setday(days[currntday]);
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
    }, []);

    return (
        <>
            <div className='p-4 flex justify-end'>
                <div className='text-center bg-gradient-to-r from-slate-900 to-slate-700 w-[15%] rounded p-2 text-white  max-[800px]:w-[40%] max-[800px]:text-[15px] duration-[0.5s]'>
                    <p>Date: {dateTime.toLocaleDateString()}</p>
                    <p>Time: {dateTime.toLocaleTimeString()}</p>
                    <p>Day: {day }</p>
                </div>
            </div>
        </>
    );
}

export default Timer;
