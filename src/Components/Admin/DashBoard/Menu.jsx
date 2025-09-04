import React, { useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { MdAddLocationAlt } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";

const Menu = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const Data = [
    {
      Text: "Work Location",
      img: <FaMapLocationDot />,
      subItems: [
        {
          Text: "Location List",
          link: "/AdminLocation-List",
          img: <MdMyLocation />,
        },
        {
          Text: "Add Location",
          link: "/Admin_worklocationdata",
          img: <MdAddLocationAlt />,
        },
      ],
    },
 /*    { Text: "Edit User", img: <FaUserEdit />, link: "/Admin_Edit" }, */
    { Text: "DashBoard", img: <MdSpaceDashboard />, link: "/A_Dash" },
  ];

  const handleClick = (index, link, hasSubItems) => {
    if (hasSubItems) {
      setExpandedIndex(expandedIndex === index ? null : index); // Toggle
    } else {
      navigate(link);
    }
  };
  return (
    <>
      <div className="border bg-gray-100 absolute left-3 top-12 px-4 py-2 z-10 rounded-xl shadow-md">
        <div className="flex flex-col gap-2">
          {Data.map((val, index) => (
            <div key={index}>
              <p
                className="flex gap-2 items-center cursor-pointer  hover:bg-white px-2 rounded-md"
                onClick={() =>
                  handleClick(index, val.link, val.subItems?.length > 0)
                }
              >
                {val.img}
                <span className={window?.location?.pathname == val?.link && 'underline'}>{val.Text}</span>
              </p>

              {/* Render subItems if expanded */}
              {expandedIndex === index &&
                val.subItems?.map((sub, subIdx) => (
                  <p
                    key={subIdx}
                    className="ml-8 flex gap-2 items-center text-sm text-gray-700 cursor-pointer hover:bg-white px-2 rounded-md"
                    onClick={() => navigate(sub.link)}
                  >
                    {sub?.img}
                    <span className={window?.location?.pathname == sub?.link && 'underline'}>{sub.Text}</span>
                  </p>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Menu;
