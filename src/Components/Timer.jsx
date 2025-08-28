// import React from 'react';
import React, { useEffect } from "react";
import { useState } from "react";

const Timer = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [day, setday] = useState("");

  useEffect(() => {
    const currntday = new Date().getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    setday(days[currntday]);
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
  }, []);

  return (
    <>
      <div className="p-4 flex justify-end">
        <div className="text-center bg-[#F7F7F7] border border-gray text-gray-600 md:w-[15%] rounded-xl p-2 text-gray-600 sm:w-[20%] xs:w-[40%] xs:text-[11px] sm:text-[13px] duration-[0.5s]">
          <p>Date: {dateTime.toLocaleDateString()}</p>
          <p>Time: {dateTime.toLocaleTimeString()}</p>
          <p>Day: {day}</p>
        </div>
      </div>
    </>
  );
};

export default Timer;
