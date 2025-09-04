import { useState } from "react";
import EmpLogo from "../../../public/EmpLogo.svg";
import { FaCircleUser } from "react-icons/fa6";
import { toast } from "react-toastify";
import { FaUserAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/api";


const NavBar = () => {
  const navigate = useNavigate();
  const { id, Username } = JSON.parse(localStorage?.getItem("User"));

  const [state, setState] = useState({
    UserDataModel: false,
  });

  const logout = async () => {
    try {
      let res = await apiClient.get("/User/Log_Out");
      navigate("/");
      toast.info(res.data.msg);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="border-b border-gray-2 shadow-sm p-3 flex justify-between">
        <div className="cursor-pointer">
          <img src={EmpLogo} alt="" srcset="" width={30} />
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer px-3"
          onClick={() => {
            setState((prev) => ({
              ...prev,
              UserDataModel: !state.UserDataModel,
            }));
          }}
        >
          <FaCircleUser size={20} />
          <span className="font-semibold text-md">User</span>
        </div>
      </div>

      {state.UserDataModel === true && (
        <div className="relative">
          <div className="flex flex-col border shadow-sm w-[23%] xs:w-[60%] bg-gray-100 rounded-md absolute right-2 p-2 top-2">
            <span className="xs:text:[11px] text-sm xs:text-[11px] font-semibold text-gray-600">
              Id : {id}
            </span>
            <span className="xs:text:[11px] text-sm xs:text-[11px] font-semibold text-gray-600 border-b pb-1 border-gray-500">
              Username : {Username}
            </span>
            <div className="flex flex-col p-1 gap-1">
              <div className="flex gap-2 items-center font-semibold text-sm xs:text-[11px] text-gray-600 cursor-pointer" onClick={()=>
              {
                navigate("/User_data")
              }}>
                <FaUserAlt />
                <span >View Data</span>
              </div>
              <div className="flex gap-2 items-center font-semibold text-sm xs:text-[11px]  text-gray-600 cursor-pointer">
                <FiLogOut />
                <span>View Data</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
