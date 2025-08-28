import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Timer from "../../Components/Timer";
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { toast } from "react-toastify";
import apiClent from "../../services/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import ButtonFun from "../../Components/ButtonFun";
import Error from "../../Components/Error/Error";

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState(null);

  const [Data, setData] = useState({
    Currlocation: null,
    address: "",
    load: false,
    More: false,
  });
  const navigate = useNavigate();

  const getLocation = useCallback(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setData((prev) => ({
            ...prev,
            Currlocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
          try {
            const response = await axios.get(
              "https://nominatim.openstreetmap.org/reverse",
              {
                params: {
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                  format: "json",
                },
                headers: {
                  "User-Agent": "YourAppName/1.0 (you@example.com)",
                },
              }
            );

            setData((prev) => ({
              ...prev,
              address: response.data.display_name,
            }));
          } catch (error) {
            console.error("Error fetching location:", error.message);
            toast.error("Error fetching location details");
          }
        },
        (error) => {
          setError(error.message);
          toast.error("Unknown error acquiring position");
          console.error("Geolocation Error:", error.message);
        },
        {
          enableHighAccuracy: true, // Ensures high accuracy
          timeout: 15000, // Increased timeout to 15 seconds
          maximumAge: 0, // Do not use a cached position
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [Data.Currlocation]);

  useEffect(() => {
    getLocation();
  }, []);

  const submit = async (values) => {
    setData((prev) => ({ ...prev, load: true }));
    try {
      const res = await apiClent.post("/login", { ...values, Data });

      toast.success("Login sucessfull");
      navigate("/login_camera");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg)
    } finally {
      setData((prev) => ({ ...prev, load: false }));
    }
  };

  return (
    <>
      <div className="min-h-screen ">
        <Timer />

        <div className="flex justify-center xs:mt-[20%] mt-[5%] ">
          <div className="shadow-xl border border-gray backdrop-blur-sm inline-grid xs:p-3 p-10 rounded-xl md:w-[40%] sm:w-[60%] xs:w-[95%] duration-[0.5s]">
            <span className="text-4xl xs:text-2xl text-center p-4 mb-3 font-semibold">
              Login
            </span>

            <div className=" border border-gray bg-[#F7F7F7]  inline-grid p-2 relative rounded mb-3">
              <div className="flex items-center justify-between">
                <span className="text-md xs:text-[16px] font-semibold">Username</span>
                <FaUser className="text-md" />
              </div>

              <input
                {...register("lusername", { required: true })}
                className=" rounded border-[0px] duration-[0.5s] bg-transparent text-sm  p-1 outline-none "
                type="text"
              />
              {errors.lusername && <Error erorText={"Required"} />}
            </div>

            <div className=" border border-gray bg-[#F7F7F7] inline-grid p-2 relative rounded">
              <div className="flex items-center justify-between">
                <span className="text-md xs:text-[16px] font-semibold">Password</span>
                <FaKey className="text-md" />
              </div>
              <input
                {...register("luserpass", { required: true })}
                className="text-sm rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none"
                type="password"
              />
              {errors.luserpass && <Error erorText={"Required"} />}
            </div>

            <div
              id="btn"
              className="w-full flex justify-center m-2 text-center"
            >
              <ButtonFun
                onClick={handleSubmit(submit)}
                className="hover:px-9   duration-[0.5s] px-10 py-2 text-white bg-black rounded-md"
                Loading={Data.load}
                Text={"Log in"}
              />
            </div>

            <p>
              Don't have an account ?
              <Link className="underline  hover:text-blue-600 " to="/Register">
                Register
              </Link>
            </p>
            {Data?.More === true && (
              <span className="text-sm">
                {Data.Currlocation ? (
                  <p>
                    Latitude: {Data.Currlocation.latitude}, Longitude:{" "}
                    {Data.Currlocation.longitude}
                  </p>
                ) : (
                  <p>Loading location...</p>
                )}
                {error && <p>Error: {error}</p>}

                <span className="cursor-pointer duration-[0.5s] ">
                  Location data:{Data.address}
                </span>
              </span>
            )}

            <p
              className="text-[10px] cursor-pointer underline"
              onClick={() => setData((prev) => ({ ...prev, More: !Data.More }))}
            >
              {Data.More ? "Less Data" : "More Data"}
            </p>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Login;
