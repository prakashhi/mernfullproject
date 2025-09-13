import React, { useState, useRef } from "react";
import Timer from "../../Components/Timer";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack, IoMdRefreshCircle } from "react-icons/io";
import { useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import apiClent from "../../services/api";
import DatePicker from "react-datepicker";
import moment from "moment";

const User_datali = () => {
  const navigate = useNavigate();

  const { id, Username } = JSON.parse(localStorage?.getItem("User"));

  const location = useLocation();
  const [listdata, setlistdata] = useState({});
  const [month, setmonth] = useState("");
  const [daywork, setdaywork] = useState(0);
  const [isSerach, setisSerach] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const timeoutRef = useRef(null);
  const startDate = useRef(moment());
  const [state, setState] = useState({
    loading: false,
    userData: [],
  });

  const getdata = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      let res = await apiClent.get(`/User/Getdata/${id}/${startDate.current}`);
      setState((prev) => ({ ...prev, userData: res.data.data }));
    } catch (err) {
      console.log(err);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    getdata();
  }, []);

  const countday = useCallback(async () => {
    setisSerach(true);
    setisLoading(true);

    try {
      setlistdata({});

      const kl = await apiClent.post("/daycount", { id, month });

      if (kl.data.workdta.length <= 0) {
        setdaywork(0);
      } else {
        setlistdata(kl.data.workdta[0].work_entries);

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
      setisSerach(false);
      setisLoading(false);
    }
  }, [month]);



  return (
    <>
      {/* Header */}
      <div className="flex justify-between mb-10 border-b-1 shadow-md">
        <div
          onClick={() => {
            navigate("/Dashboard");
          }}
          className="w-[10%] m-1 rounded mb-1 flex  items-center  gap-1 p-3 cursor-pointer"
        >
          <IoMdArrowBack size={22} className="" />
        </div>
        <div className=" flex  justify-between m-2 p-2 gap-5 items-center xs:gap-3">
          <div className="grid border rounded-xl bg-[#F7F7F7] text-gray-600  p-2 rounded cursor-pointer">
            <span className="xs:text-[13px] text-md font-semibold">
              Id : {id}
            </span>
            <span className="xs:text-[13px] text-md font-semibold">
              Username : {Username}
            </span>
          </div>
        </div>
      </div>

      {/* Second Haeder */}
      <div className="flex items-center justify-between duration-[0.5s]  p-5 xs:p-2 xs:mb-5">
        <div className="gap-2 flex cursor-pointer ">
          <DatePicker
            className="bg-gray-200 p-2 rounded-md border outline-none font-semibold text-center xs:w-1/2 xs:p-1 "
            selected={startDate.current}
            onChange={(date) => {
              clearTimeout(timeoutRef.current);
              startDate.current = moment(date).format();
              timeoutRef.current = setTimeout(() => {
                getdata();
              }, 450);
            }}
            dateFormat="MMM - yyyy" // show month + year
            showMonthYearPicker // disables day selection
          />
        </div>

        <div
          className="flex gap-1 items-center cursor-pointer"
          onClick={getdata}
        >
          <IoMdRefreshCircle className="duration-[0.5s] text-3xl  xs:text-sm" />
          <span className="xs:text-sm">Refresh</span>
        </div>
      </div>

      <div id="contain" className=" duration-[0.5s]">
        <div className="duration-[0.5s] m-4 xs:m-1 p-2 overflow-auto border rounded-[13px] shadow-md bg-[#F7F7F7]">
          <table className="  xs:text-[15px] w-full text-center   ">
            <thead>
              <tr className="border-b-2 sticky top-0">
                <td className=" rounded font-semibold xs:text-[11px] xs:py-2">Workday</td>
                <td className=" rounded font-semibold xs:text-[11px]">Date</td>
                <td className=" rounded font-semibold xs:text-[11px]">EntryTime</td>
                <td className=" rounded font-semibold xs:text-[11px]">ExitTime</td>
                <td className=" rounded font-semibold xs:text-[11px]">FullDay</td>
              </tr>
            </thead>
            <tbody>
              {listdata &&
                state?.userData.length > 0 &&
                state?.userData?.map((user) => (
                  <tr key={user._id} className="">
                    <td className="border-r-2 rounded p-3 xs:text-sm">
                      {moment(user.Date).format("ddd")}
                    </td>
                    <td className="border-r-2 rounded p-3 xs:text-sm">
                      {moment(user.Date).format("DD-MM")}
                    </td>
                    <td className="border-r-2 rounded p-3 xs:text-sm">
                      {moment(user.Entry_time).format("hh:mm:ss a")}
                    </td>
                    <td className="border-r-2 rounded p-3 xs:text-sm">{moment(user.Exit_time).format("hh:mm:ss a")}</td>
                    <td className=" rounded p-3">{user.FullDay}</td>
                  </tr>
                ))}
              {state?.userData?.length <= 0 && state.loading === false && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center font-semibold p-3  xs:text-sm"
                  >
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {state.loading === true && (
            <div className=" mt-[10%] flex flex-col items-center justify-center space-y-3">
              <div className="text-lg font-semibold text-gray-700">
                Loading data...
              </div>
              <div className="flex space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-300"></div>
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

export default User_datali;
