import React, { useEffect, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import Timer from "../../Components/Timer";

import { Link } from "react-router-dom";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { IoMdRefreshCircle } from "react-icons/io";
import apiClent from "../../services/api";

import Profile from "../../Components/Admin/DashBoard/Profile.jsx";
import Menu from "../../Components/Admin/DashBoard/Menu";
import NavBar from "../../Components/Admin/DashBoard/NavBar";

const Admin_Dashboard = () => {
  const navigate = useNavigate();

  const [alldata, setalldata] = useState([]);
  const [adminsearch, setadminsearch] = useState("");
  const [isLoading, setisLoading] = useState(true);

  const loaddata = useCallback(async () => {
    setisLoading(true);
    try {
      let response = await apiClent.get("/Admin/loaddata/Admin");
      setalldata(response.data.Data);
    } catch (err) {
      toast.error(err);
    } finally {
      setisLoading(false);
    }
  }, []);

  useEffect(() => {
    loaddata();
  }, [loaddata]);

  return (
    <>
      <NavBar />

      <div id="contain" className=" duration-[0.5s] mt-10">
        <div className=" flex m-1 p-2 justify-between  items-center max-[400px]:gap-2">
          <div className="gap-3 flex ">
            <input
              type={"text"}
              onChange={(e) => {
                setadminsearch(e.target.value);
              }}
              className="p-2  border focus:outline-none text-sm rounded-md"
              placeholder="Search..."
            />
            <button className="text-white bg-black rounded-md px-6 py-1 max-[400px]:px-3 max-[400px]:py-1">
              Search
            </button>
          </div>
          <div className="flex cursor-pointer gap-1 items-center ">
            <IoMdRefreshCircle
              onClick={loaddata}
              className="text-2xl cursor-pointer  duration-[0.5s]"
            />
            <span>Refreash</span>
          </div>
        </div>
        <div className="duration-[0.5s] height-full overflow-auto m-3 rounded-xl shadow-md bg-[#F7F7F7] ">
          <table className=" max-[400px]:text-[15px] w-full text-center font-light ">
            <thead className="">
              <tr className="border-b-2 sticky top-0  backdrop-blur-2xl cursor-pointer ">
                <td className=" py-3 font-bold">User Id</td>
                <td className=" font-bold"> Fullname</td>
                <td className="  font-bold"> Username</td>
                <td className="  font-bold">Email</td>
                <td className="  font-bold">Lastlogin</td>
                <td className="  font-bold">Workcode</td>
                <td className="  font-bold">Latitude</td>
                <td className="  font-bold">Longitude</td>
                <td className="  font-bold"></td>
              </tr>
            </thead>

            <tbody>
              {alldata &&
                alldata.length > 0 &&
                alldata.map((user) => (
                  <tr key={user._id} className=" cursor-pointer">
                    <td className="border-r-2   p-3 font-semibold">
                      {user.User_id}
                    </td>
                    <td className="border-r-2  p-3 font-semibold">
                      {user.User_fullname}
                    </td>
                    <td className="border-r-2 rounded p-3 font-semibold">
                      {user.Username}
                    </td>
                    <td className="border-r-2 rounded p-3 font-semibold">
                      {user.User_email}
                    </td>
                    <td className="border-r-2 rounded p-3 font-semibold">
                      {user.User_lastlogin.split(" ").splice(0, 5).join(" ")}
                    </td>
                    <td className="border-r-2 rounded p-3 font-semibold">
                      {user.User_Workcode}
                    </td>
                    <td className="border-r-2 rounded p-3 font-semibold">
                      {user.User_workLatitude}
                    </td>
                    <td className="rounded p-3 font-semibold">
                      {user.User_workLongitude}
                    </td>

                    <td className="rounded p-3">
                      <Link
                        to="/Admin_datali"
                        state={{ id: user.User_id, username: user.Username }}
                        className="shadow-md px-6 max-[750px]:text-[12px] hover:cursor-pointer text-[14px] p-1 text-white bg-purple-900 font-bold rounded-full"
                      >
                        DATA
                      </Link>
                    </td>
                  </tr>
                ))}
              {alldata.length <= 0 && isLoading == false && (
                <tr>
                  <td colSpan="3" className="text-center">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {isLoading && alldata == false && (
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
      </div>
    </>
  );
};

export default Admin_Dashboard;
