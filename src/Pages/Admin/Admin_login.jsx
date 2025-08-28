import React, { useState } from "react";
import Timer from "../../Components/Timer";
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import apiClent from "../../services/api";
import ButtonFun from "../../Components/ButtonFun";
import { useForm } from "react-hook-form";
import Error from "../../Components/Error/Error";

const Admin_login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const [load, setload] = useState(false);

  const submit = async (values) => {
    setload(true);
    try {
      const res = await apiClent.post("/Admin/admin_login", { ...values });
      localStorage.setItem("AdminAdata",JSON.stringify(res.data.Data) )
      toast.success(res?.data?.msg);
      navigate("/A_Dash");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setload(false);
    }
  };
  return (
    <>
      <div className="min-h-screen">
        <Timer />
        <div className="flex justify-center xs:mt-[25%] mt-[10%]">
          <div className="shadow-xl border border-gray inline-grid xs:p-4 p-10 rounded-xl md:w-[40%] sm:w-[60%] xs:w-[95%] duration-[0.5s]">
            <span className="text-4xl xs:text-2xl text-center p-4 font-semibold">
              Admin Login
            </span>
            <div className=" border border-gray bg-[#F7F7F7] inline-grid p-2 relative rounded mb-3">
              <div className="flex items-center justify-between">
                <span className="text-md xs:text-[16px] ">
                  Username
                </span>
                <FaUser className=" text-md" />
              </div>

              <input
                {...register("uuser", { required: true })}
                className=" rounded border-[0px] duration-[0.5s] bg-transparent text-sm  p-1 outline-none "
                type="text"
              />
              {errors.uuser && <Error erorText={"Required"} />}
            </div>
            <div className="border border-gray bg-[#F7F7F7] inline-grid p-2 relative rounded">
              <div className="flex items-center justify-between">
                <span className="text-md xs:text-[16px] ">
                  Password
                </span>
                <FaKey className=" text-md" />
              </div>
              <input
                {...register("upass", { required: true })}
                className=" rounded border-[0px] duration-[0.5s] bg-transparent text-sm p-1 outline-none"
                type="password"
              />
              {errors.upass && <Error erorText={"Required"} />}
            </div>
            <div className="w-full flex justify-center m-2">
              <ButtonFun
                id="btn"
                onClick={handleSubmit(submit)}
                className="hover:px-9 duration-[0.5s]  xs:text-md text-white bg-black rounded-md font-bold px-9 py-2"
                Loading={load}
                Text={"Log in"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin_login;
