import React from "react";
import Erorimg from "../../../src/assets/alret.svg";
const Error = ({ erorText, className }) => {
  return (
    <>
      {" "}
      <div className="flex flex-row items-center gap-1">
        <img src={Erorimg} alt="" srcset="" width={12} />
        <p style={{ color: "red" ,fontSize:'12px'}} className={className}>
          {erorText}
        </p>
      </div>
    </>
  );
};

export default Error;
