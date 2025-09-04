import React from "react";
import Loader from "../assets/spinner.svg";

const ButtonFun = ({ Text, onClick, Loading, className }) => {
  return (
    <>
      <button disabled={Loading} onClick={onClick} className={className}>
        {Loading == true ? (
          <img  src={Loader}  width={20} />
        ) : (
          Text 
        )}
      </button>
    </>
  );
};

export default ButtonFun;
