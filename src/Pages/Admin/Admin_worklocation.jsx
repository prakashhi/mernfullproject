import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import apiClent from "../../services/api";
import NavBar from "../../Components/Admin/DashBoard/NavBar";
import ButtonFun from "../../Components/ButtonFun";
import { useForm } from "react-hook-form";
import { Message } from "../../Components/Error/ErrorMessage";
import Error from "../../Components/Error/Error";

const Admin_worklocation = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [load, setload] = useState(false);

  const submit = async (values) => {
    setload(true);
    try {
      let res = await apiClent.post("/Admin/setwotkloaction", { ...values });
      toast.success(res?.data?.msg);
      reset({
        latitude: "",
        longitude: "",
        validrange: "",
        WorkCode: "",
        WorkName: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setload(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className=" h-[100dvh]">
        <div className="flex justify-center ">
          <div className="shadow-xl xs:mt-20 mt-10 border xs:p-4 backdrop-blur-sm bg-white/30 inline-grid p-10 rounded-xl w-[50%] xs:w-[95%] duration-[0.5s] my-4  m-[20px] xs:mx-[10px]">
            <h1 className="flex justify-center font-bold text-xl xs:text-md mb-5">
              Work Location data
            </h1>

            <div className=" p-2  relative rounded mb-3 border border-gray bg-[#F7F7F7] ">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-md ">Workloaction Code</span>
              </div>
              <input
                {...register("WorkCode", {
                  required: Message.Required,
                })}
                className="rounded text-sm border-[0px] w-full duration-[0.5s] bg-transparent  p-1 outline-none "
                type="text"
              />
              {errors.WorkCode && <Error erorText={errors.WorkCode.message} />}
            </div>
            <div className=" p-2 relative rounded mb-3 border border-gray bg-[#F7F7F7] ">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-md ">Workloaction Name</span>
              </div>
              <input
                {...register("WorkName", {
                  required: Message.Required,
                })}
                className="rounded text-sm border-[0px] w-full duration-[0.5s] bg-transparent  p-1 outline-none "
                type="text"
              />
              {errors.WorkName && <Error erorText={errors.WorkName.message} />}
            </div>

            <div className="border border-gray bg-[#F7F7F7]  p-2 relative rounded mb-3">
              <div className="flex items-center justify-between">
                <input
                  {...register("latitude", {
                    required: Message.Required,
                    pattern: {
                      value: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
                      message: Message.NumberRequired,
                    },
                  })}
                  placeholder="User worklatitude"
                  className="text-sm rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none "
                  type="text"
                />

                <FaLocationDot className=" text-md" />
              </div>
              {errors.latitude && <Error erorText={errors.latitude.message} />}
            </div>
            <div className="border border-gray bg-[#F7F7F7]   p-2 relative rounded mb-3">
              <div className="flex items-center justify-between">
                <input
                  {...register("longitude", {
                    required: Message.Required,
                    pattern: {
                      value:
                        /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
                      message: Message.NumberRequired,
                    },
                  })}
                  placeholder="User workLongitude"
                  className="text-sm rounded border-[0px] duration-[0.5s] bg-transparent  p-1 outline-none "
                  type="text"
                />
                <FaLocationDot className=" text-md" />
              </div>
              {errors.longitude && (
                <Error erorText={errors.longitude.message} />
              )}
            </div>

            <div className="border border-gray bg-[#F7F7F7]   p-2 relative rounded mb-3">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-md">Valid Area in meter</span>
              </div>
              <input
                {...register("validrange", {
                  required: Message.Required,
                  pattern: {
                    value: /^\d+$/,
                    message: Message.NumberRequired,
                  },
                })}
                className="rounded border-[0px] duration-[0.5s] text-sm bg-transparent  p-1 outline-none "
                type="text"
              />
              {errors.validrange && (
                <Error erorText={errors.validrange.message} />
              )}
            </div>

            <div id="btn" className="w-full flex justify-center m-2">
              <ButtonFun
                id="btn"
                onClick={handleSubmit(submit)}
                className="hover:px-9 duration-[0.5s]  text-white bg-black rounded-md font-bold px-9 py-2"
                Loading={load}
                Text={"Set Data"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin_worklocation;
