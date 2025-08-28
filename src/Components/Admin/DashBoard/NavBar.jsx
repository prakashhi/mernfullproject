import React, { useState } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import Menu from "./Menu";
import Profile from "./Profile";

const NavBar = () => {
  const [model, setmodel] = useState({
    Profile: false,
    Menu: false,
  });

  return (
    <React.Fragment>
      <div className="flex justify-between p-3 shadow-md">
        <div
          className=" cursor-pointer border px-1   rounded-md items-center"
          onClick={() => {
            setmodel((prev) => ({ ...prev, Menu: !model.Menu }));
          }}
        >
          <IoReorderThreeOutline size={22} />
        </div>
        {model.Menu === true && <Menu />}

        <div
          className="flex flex-row items-center gap-2 cursor-pointer"
          onClick={() => {
            setmodel((prev) => ({ ...prev, Profile: !model.Profile }));
          }}
        >
          <FaCircleUser size={20} />
          <span>Admin</span>
        </div>

        {model.Profile === true && <Profile />}
      </div>
    </React.Fragment>
  );
};

export default NavBar;
