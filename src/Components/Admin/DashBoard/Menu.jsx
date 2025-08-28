import React from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  const Data = [
    {
      Text: "Work Location Data",
      img: <FaMapLocationDot />,
      link:"/Admin_worklocationdata"
    },
    { Text: "Edit User", img: <FaUserEdit />, link: "/Admin_Edit" },
    { Text: "DashBoard", img: <MdSpaceDashboard />, link: "/A_Dash" },
  ];
  return (
    <>
      <div className="border bg-gray-100 absolute left-3 top-12 px-4 py-2 z-10 rounded-xl shadow-md">
        <div className="flex flex-col gap-2">
          {Data.map((val, index) => (
            <p
              className="flex gap-2 items-center cursor-pointer hover:bg-white px-2 rounded-md"
              key={index}
              onClick={() => navigate(`${val?.link}`)}
            >
              {val.img}
              <span>{val.Text}</span>
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default Menu;
