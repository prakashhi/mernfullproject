import React from "react";
import { IoCloseCircle } from "react-icons/io5";
import { IoReorderThreeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import NavBar from "../../Components/Admin/DashBoard/NavBar";

const Edit_Admin = () => {
  const ham = () => {
    document.getElementById("hamb").style.left = "0";
  };
  const close = () => {
    document.getElementById("hamb").style.left = "-1000px";
  };
  return (
    <>
      <div id="contain" className="h-[100vh] duration-[0.5s]">
        <NavBar />

        <div className=" flex m-2 p-2 gap-5 items-center max-[400px]:gap-3">
          <span>Enter Userid</span>
          <input
            type={"text"}
            className="p-1 rounded"
            placeholder="Search..."
          />
          <button className="backdrop-blur-sm bg-white/30 rounded px-4 py-2 max-[400px]:px-3 max-[400px]:py-1">
            Edit
          </button>
        </div>

      </div>
    </>
  );
};

export default Edit_Admin;
