import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { IoMdArrowBack, IoMdRefreshCircle } from "react-icons/io";
import { useEffect } from "react";
import apiClent from "../../services/api";
import ButtonFun from "../../Components/ButtonFun";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const Admin_Datali = () => {
  const navigate = useNavigate();

  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);

  const [listdata, setlistdata] = useState({});

  const [month, setmonth] = useState("");
  const [daywork, setdaywork] = useState(0);
  const [isLoading, setisLoading] = useState(true);

  const [startDate, setStartDate] = useState(moment());

  const location = useLocation();
  const { id, username } = location.state || {};

  const getdata = useCallback(async () => {
    setisLoading(true);
    try {
      const res = await apiClent.get(`Admin/getdata/${id}`);

 

      setlistdata(res.data.workdta[0].work_entries);
    } catch (err) {
      console.log(err);
    } finally {
      setisLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if(!location.state)
    {
      navigate("/A_Dash")
    }
    getdata();
  }, []);

  const countday = async () => {
    setisLoading(true);

    try {
      const kl = await apiClent.post("/daycount", { id, month });

      if (kl.data.workdta.length <= 0) {
        setdaywork(0);
      } else {
        const data = kl.data.workdta[0].work_entries;

        setlistdata(data);

        const alldata = kl.data.workdta[0].work_entries;

        // Calculate full day counts if data exists
        let countfullday = 0;
        alldata.forEach((entry) => {
          if (entry.FullDay === "P") {
            countfullday++;
          }
        });

        // Update the day work count state
        setdaywork(countfullday);
      }
    } catch (error) {
      console.log(error);
      setdaywork(0);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between mb-10 border-b-1 shadow-md">
        <div
          onClick={() => {
            navigate("/A_Dash");
          }}
          className="w-[10%] m-1 rounded mb-1 flex  items-center  gap-1 p-3 cursor-pointer"
        >
          <IoMdArrowBack size={22} className="" />
        </div>
        <div className=" flex  justify-between m-2 p-2 gap-5 items-center xs:gap-3">
          <div className="grid border rounded-xl bg-[#F7F7F7] text-gray-600  p-2 rounded">
            <span className="xs:text-[13px] text-md font-semibold">
              Id: {id}
            </span>
            <span className="xs:text-[13px] text-md font-semibold">
              Username:{username}
            </span>
          </div>
        </div>
      </div>

      {/* Second Haeder */}
      <div className="flex items-center justify-between duration-[0.5s]  p-5 xs:p-2">
        <div className="gap-2 flex">
          <DatePicker
            className="bg-gray-200 p-2 rounded-xl outline-none font-semibold text-center xs:w-1/2 "
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MMM - yyyy" // show month + year
            showMonthYearPicker // disables day selection
          />

          {/* <ButtonFun
            className={"bg-black text-white px-4 py-1 rounded-md"}
            Text={"Show Month"}
            onClick={countday}
          /> */}
        </div>

        <div>
          <IoMdRefreshCircle
            onClick={getdata}
            className="duration-[0.5s] text-3xl cursor-pointer xs:text-xl"
          />
        </div>
      </div>

      <div id="contain" className=" duration-[0.5s]  ">
        <div className="duration-[0.5s] m-4 xs:m-1 p-2 overflow-auto  rounded-xl shadow-md bg-[#F7F7F7] ">
          <table className=" max-[400px]:text-[15px] w-full text-center  ">
            <thead>
              <tr className="border-b-2 sticky top-0 ">
                <td className="py-2 xs:py-1 rounded font-bold xs:text-sm">
                  Workday
                </td>
                <td className=" rounded font-bold xs:text-sm">
                  Date of Workday
                </td>
                <td className=" rounded font-bold xs:text-sm">EntryTime</td>
                <td className=" rounded font-bold xs:text-sm">ExitTime</td>
                <td className=" rounded font-bold xs:text-sm">FullDay</td>
              </tr>
            </thead>
            <tbody>
              {listdata && listdata.length > 0 && isLoading === false ? (
                listdata.map((user) => (
                  <tr key={user._id} className="">
                    <td className="border-r-2  p-3 xs:p-2 font-semibold xs:text-sm">
                      {user.day_of_work}
                    </td>
                    <td className="border-r-2 p-3 xs:p-2 font-semibold xs:text-sm">
                      {user.date_of_work}
                    </td>
                    <td className="border-r-2  p-3 xs:p-2 font-semibold xs:text-sm">
                      {user.entry_time}
                    </td>
                    <td className="border-r-2  p-3 xs:p-2 font-semibold xs:text-sm">
                      {user.exit_time}
                    </td>
                    <td className="p-3 font-semibold xs:p-2 xs:text-sm">
                      {user.FullDay}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="">
                  <td colSpan="5" className="text-center font-semibold p-3 ">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {isLoading === true && (
            <div className=" mt-[10%] flex flex-col items-center justify-center space-y-3">
              <div className="text-lg font-semibold text-gray-700">
                Loading data...
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          )}
        </div>
        <div className="m-2 p-2 flex gap-5 items-center">
          <span>Month Of Working Days : {daywork} Days</span>
        </div>
      </div>
    </>
  );
};

export default Admin_Datali;
