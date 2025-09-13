import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "../../Components/Timer";
import { toast } from "react-toastify";
import apiClent from "../../services/api";
import NavBar from "../../Components/User/NavBar";
import { FaSignInAlt } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const { id, Username } = JSON.parse(localStorage?.getItem("User"));

  const [state, setState] = useState({
    Loading: false,
  });

  const PunchInFun = async () => {
    try {
      setState((prev) => ({ ...prev, Loading: true }));
      let res = await apiClent.post("/User/PunchIn", { id });
      toast.success(res?.data?.msg);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setState((prev) => ({ ...prev, Loading: false }));
    }
  };

  const PunchOutFun = async () => {
    try {
      setState((prev) => ({ ...prev, Loading: true }));
      let res = await apiClent.post("/User/PunchOut", { id });
      toast.success(res?.data?.msg);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setState((prev) => ({ ...prev, Loading: false }));
    }
  };

  return (
    <>
      <NavBar />
      <div className="  duration-[0.5s]">
        {/* HEader */}
        <div className="relative top-0 xs:right-[55%] right-[83%] w-full text-center">
          <Timer />
        </div>

        <div className="p-8 flex flex-col items-center space-y-6 mt-10 md:mt-5">
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-3xl xs:text-2xl font-semibold text-gray-800">
              Employee Time Tracking
            </h1>
            <p className="text-lg xs:text-md text-gray-600 mt-2">
              Manage your work hours with ease. Punch In to start, and Punch Out
              when you're done.
            </p>
          </div>

          {/* Button Group Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
            {/* Punch In Button */}
            <div>
              <button
                disabled={state.Loading}
                onClick={PunchInFun}
                className="bg-gray-200 text-gray-800 rounded-lg p-4 transition-all duration-300 ease-in-out transform hover:bg-gray-300 hover:scale-105 shadow-md hover:shadow-xl w-full"
              >
                <div className="flex items-center space-x-3">
                  {/* Icon */}
                  <FaSignInAlt className="text-3xl text-gray-800 transition-all duration-300 ease-in-out transform hover:text-teal-500" />
                  {/* Text */}
                  <div>
                    <span className="text-lg font-semibold tracking-wide transition-all duration-300 ease-in-out hover:text-teal-500">
                      Punch In
                    </span>
                    <p className="text-xs mt-1 text-gray-500 transition-all duration-300 ease-in-out hover:text-teal-400">
                      Tap here to record your check-in time
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Punch Out Button */}
            <div>
              <button
                disabled={state.Loading}
                onClick={PunchOutFun}
                className="bg-orange-200 text-gray-800 rounded-lg p-4 transition-all duration-300 ease-in-out transform hover:bg-orange-300 hover:scale-105 shadow-md hover:shadow-xl w-full"
              >
                <div className="flex items-center space-x-3">
                  {/* Icon */}
                  <FaSignOutAlt className="text-3xl text-gray-800 transition-all duration-300 ease-in-out transform hover:text-orange-600" />
                  {/* Text */}
                  <div>
                    <span className="text-lg font-semibold tracking-wide transition-all duration-300 ease-in-out hover:text-orange-600">
                      Punch Out
                    </span>
                    <p className="text-xs mt-1 text-gray-500 transition-all duration-300 ease-in-out hover:text-orange-400">
                      Tap here to record your punch-out time
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
