import { useState } from "react";
import EmpLogo from "../../../public/EmpLogo.svg";
import { FaCircleUser } from "react-icons/fa6";

const NavBar = () => {

  const [state, setState] = useState({
    UserDataModel: false,
  });
  return (
    <>
      <div className="border-b border-gray-2 shadow-sm p-3 flex justify-between">
        <div className="cursor-pointer">
          <img src={EmpLogo} alt="" srcset="" width={30} />
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer px-3"
          onClick={() => {
            setState((prev) => ({ ...prev, UserDataModel:!state.UserDataModel }));
          }}
        >
          <FaCircleUser size={20} />
          <span className="font-semibold text-md">User</span>
        </div>
      </div>

      {state.UserDataModel === true && (
        <div className="relative">
          <div className="border shadow-sm w-[20%] bg-gray-100 rounded-md absolute right-0 p-2 top-2">
            <span>Username</span>
            
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
