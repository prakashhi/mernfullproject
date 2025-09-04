import React from "react";
// import EmpLogo from "../assets/EmpLogo.svg";
import EmpLogo from "../assets/EmpLogo.svg"
import Spinner from "../assets/tube-spinner.svg"

const LoadingCom = () => {
  return (
    <>
      <div className="flex flex-col  p-3 flex justify-center  items-center">

        <div className=" flex flex-row relative ">
          <img
            clasName="text-blue-100"
            src={Spinner}
            alt=""
            srcset=""
            width={60}
          />
          <img className="absolute bottom-3 left-3 " src={EmpLogo} alt="" srcset="" width={35} />
        </div>

        <div className="text-lg font-semibold text-gray-700 xs:text-sm">
          Loading data...
        </div>
      </div>
    </>
  );
};

export default LoadingCom;
