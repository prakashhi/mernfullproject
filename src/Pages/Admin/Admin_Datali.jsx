import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { IoMdArrowBack, IoMdRefreshCircle } from "react-icons/io";
import { useEffect } from "react";
import apiClent from "../../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import LoadingCom from "../../Components/LoadingCom";
import { ExitTimeval } from "../utils/function";

const Admin_Datali = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const User = location.state.user || {};
  const startDate = useRef(moment());
  const timeoutRef = useRef(null);

  const [state, setState] = useState({
    isLoading: false,
    userData: [],
    DayWork: 0,
  });

  const getdata = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      let res = await apiClent.get(
        `/User/Getdata/${User.User_id}/${startDate.current}/Admin`
      );
      setState((prev) => ({ ...prev, userData: res.data.data }));
      let count = res.data.data.filter((val) => val.FullDay === "P").length;
      setState((prev) => ({ ...prev, DayWork: count }));
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    getdata();
  }, []);

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
              Id : {User?.User_id}
            </span>
            <span className="xs:text-[13px] text-md font-semibold">
              Username : {User?.Username}
            </span>
          </div>
        </div>
      </div>

      {/* Second Haeder */}
      <div className="flex items-center justify-between duration-[0.5s]  p-5 xs:p-2 xs:mb-5">
        <div className="gap-2 flex cursor-pointer ">
          <DatePicker
            className="bg-gray-200 p-2 rounded-md border outline-none font-semibold text-center xs:w-1/2 xs:p-1 xs:text-sm"
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
          <IoMdRefreshCircle className="duration-[0.5s] text-xl  xs:text-sm" />
          <span className="xs:text-sm">Refresh</span>
        </div>
      </div>

      <div id="contain" className=" duration-[0.5s]  ">
        <div className="duration-[0.5s] m-4 xs:m-1 p-2 overflow-auto  border rounded-[10px] shadow-md bg-[#F7F7F7] ">
          <table className=" xs:text-[15px] w-full text-center  ">
            <thead>
              <tr className="border-b-2 sticky top-0 ">
                <td className="py-2 xs:py-1 rounded font-bold xs:text-[11px]">
                  Workday
                </td>
                <td className=" rounded font-bold xs:text-[11px]">Date</td>
                <td className=" rounded font-bold xs:text-[11px]">EntryTime</td>
                <td className=" rounded font-bold xs:text-[11px]">ExitTime</td>
                <td className=" rounded font-bold xs:text-[11px]">FullDay</td>
              </tr>
            </thead>
            <tbody>
              {state.userData.length > 0 &&
                state.userData.map((user) => (
                  <tr key={user._id} className="">
                    <td className="border-r-2  p-3 xs:p-2 font-semibold xs:text-sm">
                      {moment(user.Date).format("dddd")}
                    </td>
                    <td className="border-r-2 p-3 xs:p-2 font-semibold xs:text-sm">
                      {moment(user.Date).format("DD MMM")}
                    </td>
                    <td className="border-r-2  p-3 xs:p-2 font-semibold xs:text-sm">
                      {moment(user.Entry_time).format("hh:mm:ss a")}
                    </td>
                    <td className="border-r-2  p-3 xs:p-2 font-semibold xs:text-sm">
                      {ExitTimeval(user)}
                    </td>
                    <td className="p-3 font-semibold xs:p-2 xs:text-sm">
                      {user.FullDay}
                    </td>
                  </tr>
                ))}
              {state.userData.length <= 0 && state.isLoading === false && (
                <tr className="">
                  <td
                    colSpan="5"
                    className="text-center font-semibold p-3  xs:text-sm"
                  >
                    No Data Available
                  </td>
                </tr>
              )}{" "}
              {state.isLoading === true && (
                <tr>
                  <td colSpan="100%" className="font-semiboldpy-6  text-center">
                    <LoadingCom />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="m-2 p-2 flex gap-5 items-center">
          <span>Month Of Working Days : {state.DayWork} Days</span>
        </div>
      </div>
    </>
  );
};

export default Admin_Datali;
