import React from 'react';
import Timer from '../Components/Timer';

const User_datali = () => {
    return (
        <>
            <div className='bg-gradient-to-r from-violet-500 to-fuchsia-500'>
                <Timer />
               
            </div> 
            <div id='contain' className='h-[100vh] duration-[0.5s] bg-gradient-to-r from-violet-500 to-fuchsia-500 m-2 rounded'>
        <div className=' flex m-2 p-2 gap-5 items-center max-[400px]:gap-3' >
          <span>Userid</span>
           </div>
        <div className='duration-[0.5s] m-2 p-2  backdrop-blur-sm bg-white/20 rounded '>
          <table className='h-[80vh] max-[400px]:text-[15px]'>
            <tr className='flex gap-4 '>
              <td className='bg-red-300 rounded p-1'>User Entry_Data</td>
              <td className='bg-red-300 rounded p-1'>User Exit_Data</td>
              <td className='bg-red-300 rounded p-1'>User Data_Day</td>
            </tr>
            <tr className='flex gap-6'>
              <td>User Entry_Data</td>
              <td>User Exit_Data</td>
              <td>User Data_Day</td>
            </tr>
          </table>

        </div>
        <div className='m-2 p-2 flex gap-5 items-center'>
          <span>Month Of Working Days</span>
          <span className='bg-white px-4 py-1 rounded'>Days</span>

        </div>

      </div>

        </>
    );
}

export default User_datali;
