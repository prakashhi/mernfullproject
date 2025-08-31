import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseCircle } from "react-icons/io5";
import { IoReorderThreeOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMobile } from "react-icons/fa";
import { useState } from "react";
import Camera from "../../Components/Camera";
import { useLocation } from "react-router-dom";
import apiClent from "../../services/api";
import ButtonFun from "../../Components/ButtonFun";
import { useForm } from "react-hook-form";
import Error from "../../Components/Error/Error";
import { Message } from "../../Components/Error/ErrorMessage";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();

  const [load, setload] = useState(false);
  const { savedEncodings = [] } = location.state || {};
  const [showCamera, setShowCamera] = useState(false);

  const submit = async (values) => {
    setload(true);
    if (savedEncodings.length < 0) {
      toast.error("Face Data is not Avialble");
    }
    try {
      const res = await apiClent.post("/register_data", {
        ...values,
        savedEncodings,
      });
      navigate("/");
      toast.success("Registration is sucessfull");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setload(false);
    }
  };

  return (
    <>
      <div className=" min-h-screen">
        <div className="flex justify-center ">
          <div className="shadow-xl border border-gray xs:p-4 backdrop-blur-sm bg-white/30 inline-grid p-7 rounded-xl md:w-[40%] sm:w-[60%] xs:w-[95%] duration-[0.5s] my-6">
            <span className="text-4xl text-center p-4 font-semibold ">
              Register
            </span>
            <h1 className="pb-2">Persional Details</h1>

            <div className=" border border-gray bg-[#F7F7F7]  inline-grid p-2 relative rounded mb-3">
              <div className="flex items-center justify-between">
                <span className="text-md font-semibold">Full Name</span>
                <FaUser className=" text-md" />
              </div>
              <input
                {...register("fname", {
                  required: Message.Required,
                  minLength: { value: 2, message: Message.MoreRequired },
                })}
                className="rounded border-[0px] duration-[0.5s] bg-transparent text-sm p-1 outline-none "
                type="text"
              />
              {errors.fname && <Error erorText={errors.fname.message} />}
            </div>

            <div className=" border border-gray bg-[#F7F7F7]  inline-grid p-2 relative rounded mb-3">
              <div className="flex items-center justify-between">
                <span className="text-md font-semibold">User Email</span>
                <MdEmail className=" text-md" />
              </div>
              <input
                {...register("uemail", {
                  required: Message.Required,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: Message.ValidEmail,
                  },
                })}
                className="rounded border-[0px] duration-[0.5s] bg-transparent text-sm p-1 outline-none "
                type="email"
              />
              {errors.uemail && <Error erorText={errors.uemail.message} />}
            </div>
            <div className=" border border-gray bg-[#F7F7F7]  inline-grid p-2 relative rounded mb-3">
              <div className="flex items-center justify-between">
                <span className="text-md font-semibold">User MobileNo</span>
                <FaMobile className=" text-md" />
              </div>
              <input
                {...register("umobile", {
                  required: Message.Required,
                  pattern: {
                    value: /^\d+$/,
                    message: Message.NumberRequired,
                  },
                  minLength: { value: 10, message: Message.MobileNoRequire },
                  maxLength: { value: 10, message: Message.MobileNoRequire },
                })}
                className="rounded border-[0px] duration-[0.5s] bg-transparent text-sm p-1 outline-none "
                type="text"
              />
              {errors.umobile && <Error erorText={errors.umobile.message} />}
            </div>

            <h1>Face Register</h1>
            <div
              className="duration-[0.5s] text-3xl text-bold hover:cursor-pointer"
              onClick={() => {
                setShowCamera((prev) => !prev);
              }}
            >
              <IoReorderThreeOutline className="" />
            </div>

            {showCamera && (
              <div
                id="hamb"
                className="duration-[0.5s] border border-gray backdrop-blur-md bg-gray-100 text-white p-5 absolute h-[100%] rounded-xl  w-[100%] z-[1] transition-all  "
              >
                <div className="grid gap-5 ">
                  <div
                    onClick={() => {
                      setShowCamera((prev) => !prev);
                    }}
                    className="duration-[0.5s] text-2xl  hover:cursor-pointer"
                  >
                    <IoCloseCircle color="black" />
                  </div>

                  <Camera setShowCamera={setShowCamera} />
                </div>
              </div>
            )}

            <div className=" border border-gray bg-[#F7F7F7] text-gray-700 p-3 rounded my-3 overflow-auto h-[10vh]">
              <h3 className="font-bold shadow-2xl">Received Face Encodings:</h3>
              {savedEncodings.length > 0 ? (
                savedEncodings.map((value, index) => (
                  <div
                    key={index}
                    className="text-xs p-1 bg-gray-100 rounded shadow-md "
                  >
                    <span className="font-bold">[{index}]</span>:{" "}
                    {value.toFixed(4)}
                  </div>
                ))
              ) : (
                <p>No face encodings received.</p>
              )}
            </div>

            <h1 className="pb-2">Profissonal Details</h1>
            <div className=" border border-gray bg-[#F7F7F7]  inline-grid p-2 relative rounded mb-3">
              <div className="flex items-center justify-between">
                <span className="text-md font-semibold">Username</span>
                <FaUser className=" text-md" />
              </div>
              <input
                {...register("username", {
                  required: Message.Required,
                  minLength: { value: 2, message: Message.MoreRequired },
                })}
                className="rounded border-[0px] duration-[0.5s] bg-transparent text-sm p-1 outline-none "
                type="text"
              />
              {errors.username && <Error erorText={errors.username.message} />}
            </div>

            <div className=" border border-gray bg-[#F7F7F7]  inline-grid p-2 relative rounded mb-3">
              <div className="flex items-center justify-between">
                <span className="text-md font-semibold">WorkLoactioncode</span>
                <FaLocationDot className=" text-md" />
              </div>
              <input
                {...register("workLoctioncode", {
                  required: Message.Required,
                })}
                className=" rounded border-[0px] duration-[0.5s] bg-transparent text-sm p-1 outline-none"
                type="text"
              />
              {errors.workLoctioncode && (
                <Error erorText={errors.workLoctioncode.message} />
              )}
            </div>

            <div className=" border border-gray bg-[#F7F7F7]  inline-grid p-2 relative rounded mb-3">
              <div className="flex items-center justify-between">
                <span className="text-md font-semibold">Password</span>
                <FaKey className=" text-md" />
              </div>
              <input
                {...register("upass", {
                  required: Message.Required,
                  minLength: { value: 6, message: Message.Password6Digit },
                })}
                className=" rounded border-[0px] duration-[0.5s] bg-transparent text-sm  p-1 outline-none"
                type="password"
              />
              {errors.upass && <Error erorText={errors.upass.message} />}
            </div>

            <div id="btn" className="w-full flex justify-center m-2">
              <ButtonFun
                onClick={handleSubmit(submit)}
                className="duration-[0.5s] bg-black hover:px-20 rounded px-[50px] py-2 text-white font-bold"
                Loading={load}
                Text={"Register"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
