import React from "react";
import NavBar from "../../Components/Admin/DashBoard/NavBar";
import ButtonFun from '../../Components/ButtonFun'

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
          {/* <span>Enter Userid</span> */}
          <input
            type={"text"}
            className="p-2 rounded-md bg-gray-100 outline-none border border-gary-2 text-sm"
            placeholder="Search..."
          />
          <ButtonFun
          Text={"Search"}
          className={"bg-black p-1 px-3 rounded-md text-white text-md"}
          />
          
        </div>
      </div>
    </>
  );
};

export default Edit_Admin;
