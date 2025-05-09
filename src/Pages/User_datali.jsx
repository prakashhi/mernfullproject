import React, { useState } from 'react';
import Timer from '../Components/Timer';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack, IoMdRefreshCircle } from "react-icons/io";
import { useEffect ,useCallback } from 'react';
import { toast } from 'react-toastify';
import apiClent from '../services/api'

const User_datali = () => {

  const navigate = useNavigate();

  const location = useLocation();
  const st = location.state || {}
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listdata, setlistdata] = useState({});
  const [month, setmonth] = useState('');
  const [daywork, setdaywork] = useState(0);
  const [isSerach,setisSerach] = useState(false);
  const [isLoading,setisLoading] = useState(false);



 useEffect(() => {
    if (!st.id) {
      return navigate('/');
    }

  }) 

 if (!st) {
    return <div>Redirecting...</div>;
  }


  const m = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];





 




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



  const id = st.id;


  const getdata = useCallback(async () => { 

        setisLoading(true);

    try {
      const res = await apiClent.post('/getdta', { id });
      setlistdata(res.data.workdta[0].work_entries);
       setisLoading(false);
    }
    catch (err) {
      console.log(err);
      setisLoading(false);

    }


  },[])

  useEffect(()=>{
    getdata();
  },[])


  const countday =  useCallback(async () => {
    setisSerach(true);
     setisLoading(true);

    try {
      setlistdata({});

      const kl = await apiClent.post('/daycount', { id, month });

      if(kl.data.workdta.length <= 0 )
      {
         setdaywork(0);
      }
      else
      {
        setlistdata(kl.data.workdta[0].work_entries);

      const alldata = kl.data.workdta[0].work_entries

        // Calculate full day counts if data exists
        let countfullday = 0;
        alldata.forEach((entry) => {
          if (entry.FullDay === 'P') {
            countfullday++;
          }
        });
        // Update the day work count state
        setdaywork(countfullday);
    
      }
         
      
     
    
    }
    catch (error) {
      console.log(error);
      setdaywork(0);
      

    }
    finally
    {
      setisSerach(false);
       setisLoading(false);
    }

  },[month]);

  return (
    <>
    <div className='bg-gradient-to-r m-1 rounded bg-blue-300 shadow-2xl'>

        <Timer />
        <div onClick={() => { navigate('/Dashboard'); }} className='w-[10%] m-1 rounded mb-1 flex items-center gap-1 p-2 cursor-pointer'>
           <IoMdArrowBack className='text-xl hover:bg-cyan-500 duration-[0.4s] rounded-full hover:text-2xl' />
          <span className='text-xl max-[700px]:hidden'>Back</span>
        </div>
      </div>
      <div id='contain' className=' duration-[0.5s]  bg-blue-400 shadow-2xl m-2 rounded'>
        <div className=' flex  justify-between m-2 p-2 gap-5 items-center max-[400px]:gap-3' >
          <div className='grid  bg-cyan-400 font-extrabold p-2 rounded'>
            <span className='max-[750px]:text-[15px] text-xl font-extralight'>Id:{id} </span>
            <span className='max-[750px]:text-[15px] text-xl font-extralight'>Username:{st.username} </span>
          </div>

          <div>
            <IoMdRefreshCircle onClick={getdata} className='duration-[0.5s] text-3xl cursor-pointer hover:text-4xl' />
          </div>
        </div>
        <div className='p-3 gap-2 flex'>
          <select onChange={(e) => { setmonth(e.target.value); }} name="months" id="month" className='rounded p-2 bg-purple-900 text-white font-bold' value={month}>
            <option value="" disabled>
              -- Select a Month --
            </option>
            {m.map((m, index) => (
              <option key={index} value={m}>
                {m}
              </option>
            ))}
          </select>

          {

             isSerach ? (<div className='bg-white px-4 opacity-50 py-1 rounded'>Loading...</div>) :(<button onClick={countday} className='bg-white px-4 py-1 rounded'>Show Month</button>)
          }
          
        </div>
        <div className='duration-[0.5s] m-2 p-2 overflow-auto  backdrop-blur-sm bg-white rounded '>
          <table className=' max-[400px]:text-[15px] w-full text-center '>
            <thead>
              <tr className='border-b-2 sticky'>
                <td className=' rounded font-semibold'>Workday</td>
                <td className=' rounded font-semibold'>Date of Workday</td>
                <td className=' rounded font-semibold'>EntryTime</td>
                <td className=' rounded font-semibold'>ExitTime</td>
                <td className=' rounded font-semibold'>FullDay</td>
              </tr>
            </thead>
            <tbody>
              {
                listdata && listdata.length > 0 ? (
                  listdata.map((user) => (

                    <tr key={user._id} className="">
                      <td className="border-r-2 rounded p-3">{user.day_of_work}</td>
                      <td className="border-r-2 rounded p-3">{user.date_of_work}</td>
                      <td className="border-r-2 rounded p-3">{user.entry_time}</td>
                      <td className="border-r-2 rounded p-3">{user.exit_time}</td>
                      <td className=" rounded p-3">{user.FullDay}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No Data Available
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>


          {
            isLoading && (<div className=" mt-[10%] flex flex-col items-center justify-center space-y-3">
        <div className="text-lg font-semibold text-gray-700">Loading data...</div>
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>)
          }

        </div>
        <div className='m-2 p-2 flex gap-5 items-center'>
          <span>Month Of Working Days : {daywork} Days</span>


        </div>

      </div>

    </>
  );
};



export default User_datali;
