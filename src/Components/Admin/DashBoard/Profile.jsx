import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../services/api";
import { toast } from "react-toastify";
import { FaUserAlt } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();

  const AdminData = JSON.parse(localStorage.getItem("AdminAdata"));

  const logout = async () => {
    try {
      let res = await apiClient.get("/Admin/Log_Out");
      navigate("/Admin");
      toast.info(res.data.msg);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="border bg-gray-100 absolute right-8 top-12 px-4 py-2 z-10 rounded-xl shadow-md">
        <ul className="flex flex-col gap-2">
          <li className="flex  items-center gap-2 cursor-pointer">
            <FaUserAlt size={13} />
            <span>{AdminData?.Name}</span>
          </li>
          <li
            className="flex  items-center gap-2 cursor-pointer"
            onClick={() => logout()}
          >
            <FiLogOut size={15} />
            <span>Log out</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Profile;
