import { useForm } from "react-hook-form";
import { Message } from "../../../Components/Error/ErrorMessage";
import Error from "../../../Components/Error/Error";
import { FaLocationDot } from "react-icons/fa6";
import ButtonFun from "../../../Components/ButtonFun";
import { IoClose } from "react-icons/io5";
import apiClient from "../../../services/api";
import { useState } from "react";
import { toast } from "react-toastify";

const Location_EditForm = ({ Data, setisLoading ,GetLocation}) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      WorkCode: Data?.Work_Code,
      WorkName: Data?.WorkLocation_Name,
      latitude: Data?.WorkCode_Latitude,
      longitude: Data?.WorkCode_Longitude,
      validrange: Data?.WorkLocation_VaildRange,
    },
  });
  const [load, setLoad] = useState(false);

  console.log(Data)

  const submit = async (values) => {
    setLoad(true);
    try {
      let res = await apiClient.post(`/Admin/EditLocation/Admin/${Data.WorkCode_id}`, {
        ...values,
      });
      toast.success(res.data.msg);
      GetLocation()
      setisLoading((prev) => ({ ...prev, Model: false }));
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg)
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      <div className=" z-10 absolute top-0  backdrop-blur-md w-full">
        <div className="flex justify-center">
          <div className="shadow-xl relative xs:mt-20 mt-10 border xs:p-4  bg-white/30 inline-grid p-10 rounded-xl w-[40%] xs:w-[95%] duration-[0.5s] my-4  m-[20px] xs:mx-[10px]">
            <IoClose
              size={20}
              className="cursor-pointer absolute left-[92%] top-4"
              onClick={() => {
                setisLoading((prev) => ({ ...prev, Model: false }));
              }}
            />
            <h1 className="flex justify-center font-bold text-xl xs:text-md mb-5">
              Edit Location
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
                className="rounded border-[0px] duration-[0.5s] text-sm bg-transparent  p-1 outline-none w-full"
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

export default Location_EditForm;
