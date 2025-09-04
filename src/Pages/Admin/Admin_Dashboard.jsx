import React, { useEffect, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdRefreshCircle } from "react-icons/io";
import apiClent from "../../services/api";
import NavBar from "../../Components/Admin/DashBoard/NavBar";
import moment from "moment";
import ButtonFun from "../../Components/ButtonFun";
import { TfiMoreAlt } from "react-icons/tfi";
import { MdViewAgenda } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import LoadingCom from "../../Components/LoadingCom";

const Admin_Dashboard = () => {
  const navigate = useNavigate();

  const [alldata, setalldata] = useState([]);
  const [adminsearch, setadminsearch] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [state, setState] = useState({
    MoreMenu: false,
    id: "",
  });

  const MenuItem = [
    {
      Name: "View Details",
      img: <MdViewAgenda size={11} />,
      textColor: "text-blue-600",
      link:'/Admin_datali'
    },
    { Name: "Edit Item", img: <FaEdit size={11} />, textColor: "text-orange-600" },
    {
      Name: "Delete Item",
      img: <MdDeleteForever size={11} />,
      textColor: "text-red-600",
    },
  ];

  const loaddata = useCallback(async () => {
    setisLoading(true);
    try {
      let response = await apiClent.get("/Admin/loaddata/Admin");
      setalldata(response.data.Data);
    } catch (err) {
      console.log(err);
      toast.error(err);
    } finally {
      setisLoading(false);
    }
  }, []);
  
  console.log(alldata)

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
              className="p-2  border bg-gray absolute-100 focus:outline-none xs:text-[10px] xs:p-1 text-sm rounded-md "
              placeholder="Search..."
            />
            {/* <button className="text-white bg-black xs:text-[10px] rounded-md px-6 py-1 xs:px-3 xs:py-1">
              Search
            </button> */}
          </div>
          <div className="flex cursor-pointer gap-1 items-center ">
            <IoMdRefreshCircle
              onClick={loaddata}
              className="text-2xl xs:text-sm cursor-pointer  duration-[0.5s]"
            />
            <span className="xs:text-sm">Refresh</span>
          </div>
        </div>
        <div className="duration-[0.5s] height-full overflow-auto m-3 xs:mx-2 rounded-xl shadow-md bg-[#F7F7F7] ">
          <table className=" w-full text-center font-light ">
            <thead className="">
              <tr className="border-b-2 sticky top-0  backdrop-blur-2xl cursor-pointer ">
                <td className=" py-3 font-bold xs:hidden">User Id</td>
                <td className="xs:text-[12px] xs:py-2  font-bold"> Username</td>
                <td className=" xs:text-[12px] font-bold">Email</td>
                <td className=" xs:text-[12px] font-bold">Lastlogin</td>
                <td className="  xs:text-[12px] font-bold">Workcode</td>
                <td className="  font-bold"></td>
              </tr>
            </thead>

            <tbody>
              {alldata &&
                alldata.length > 0 &&
                alldata.map((user) => (
                  <tr key={user._id} className=" cursor-pointer relative">
                    <td className="border-r-2  py-3  font-semibold xs:hidden ">
                      {user.User_id}
                    </td>
                    <td className="border-r-2 rounded  py-3 xs:p-1 font-semibold xs:text-[11px]">
                      {user.Username}
                    </td>
                    <td className="border-r-2 rounded  py-3 xs:p-1 font-semibold xs:text-[11px]">
                      {user.User_email}
                    </td>
                    <td className="border-r-2 rounded  py-3 xs:p-1 font-semibold xs:text-[11px]">
                      {moment(user.User_lastlogin).format(
                        "DD MMM-YYYY hh:MM a"
                      )}
                    </td>
                    <td className="border-r-2 rounded  py-3  xs:p-1 font-semibold xs:text-[11px]">
                      {user.User_Workcode}
                    </td>
                    <td className=" px-6 py-3 flex justify-center ">
                      <TfiMoreAlt
                        className="hover:bg-gray-300  rounded-sm"
                        onClick={() => {
                          setState((prev) => ({
                            ...prev,
                            MoreMenu: !state.MoreMenu,
                            id: user.User_id,
                          }));
                        }}
                      />
                    </td>
            
                      {state.MoreMenu && user.User_id === state.id && (
                        <div className="border bg-gray-100 absolute  right-3 xs:px-2  px-4 py-2 z-10 rounded-xl shadow-md">
                          <div classNAme="flex flex-col gap-1">
                            {MenuItem.map((val, index) => (
                              <div key={index}>
                              <p
                                onClick={()=>{ 
	
									navigate(`${val?.link}`,{state: {id: user.User_id ,Username:user.Username}})
								
								}
								
								}
                                className="flex gap-2 items-center cursor-pointer  hover:bg-white px-2 rounded-full"
                              >
                                {val.img}
                                <span className={`cursor-pointer ${val.textColor} font-semibold xs:text-sm text-md`}>
                                  {val.Name}
                                </span>
                              </p></div>
                            ))}
                          </div>
                        </div>
                      )}
                    
                  </tr>
                ))}
              {alldata.length <= 0 && isLoading == false && (
                <tr>
                  <td colSpan="4" className="text-center font-semibold p-3  xs:text-sm">
                    No Data Available
                  </td>
                </tr>
              )}
			   {isLoading === true && (
                <tr>
                  <td
                    colSpan="100%"
                    className="font-semiboldpy-6  text-center"
                  >
                    <LoadingCom />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Admin_Dashboard;
