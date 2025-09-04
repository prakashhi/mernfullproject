import react, { useEffect, useState } from "react";
import NavBar from "../../Components/Admin/DashBoard/NavBar";
import apiClient from "../../services/api";
import { Link } from "react-router-dom";
import ButtonFun from "../../Components/ButtonFun";
import Location_EditForm from "../../Components/Admin/LocationList/Location_EditForm";
import LoadingCom from "../../Components/LoadingCom";

const Admin_LocationList = () => {
  const [locationData, setlocationData] = useState({
    Location: [],
    Selected: [],
  });
  const [isLoading, setisLoading] = useState({ Loading: false, Model: false });

  const GetLocation = async () => {
    setisLoading((prev) => ({ ...prev, Loading: true }));
    try {
      let res = await apiClient("/Admin/LocationData/Admin");
      setlocationData((prev) => ({ ...prev, Location: res.data.Data }));
    } catch (err) {
      console.log(err);
    } finally {
      setisLoading((prev) => ({ ...prev, Loading: false }));
    }
  };
  useEffect(() => {
    GetLocation();
  }, []);
  return (
    <>
      <NavBar />

      <div className="duration-[0.5s]  overflow-auto m-3 rounded-xl shadow-md bg-[#F7F7F7] xs:mx-2">
        <table className=" w-full text-center font-light border-separate border-spacing-0">
          <thead className="">
            <tr className="sticky top-0 backdrop-blur-3xl bg-gray-100  border-b-2 cursor-pointer p-2">
              <th className="sticky top-0 backdrop-blur-3xl bg-gray-100 z-10 border-b-2 xs:hidden py-3 font-bold ">WorkCode id</th>
              <th className="sticky top-0 backdrop-blur-3xl bg-gray-100 z-10 border-b-2 xs:hidden font-bold"> WorkLocation Name</th>
              <th className="sticky top-0 backdrop-blur-3xl bg-gray-100 z-10 border-b-2  py-3 font-bold xs:text-[11px]"> Work Code</th>
              <th className="sticky top-0 backdrop-blur-3xl bg-gray-100 z-10 border-b-2  font-bold xs:text-[11px]">WorkCode Latitude</th>
              <th className="sticky top-0 backdrop-blur-3xl bg-gray-100 z-10 border-b-2  font-bold xs:text-[11px]">WorkCode Longitude</th>
              <th className="sticky top-0 backdrop-blur-3xl bg-gray-100 z-10 border-b-2  font-bold"></th>
            </tr>
          </thead>

          <tbody>
            {locationData.Location &&
              locationData.Location.length > 0 &&
              locationData.Location.map((location, index) => (
                <>
                  <tr key={location.index} className=" cursor-pointer">
                    <td className="border-r-2 xs:hidden  p-3 font-semibold">
                      {location.WorkCode_id}
                    </td>
                    <td className="border-r-2 xs:hidden p-3 font-semibold ">
                      {location.WorkLocation_Name}
                    </td>
                    <td className="border-r-2 rounded p-3 font-semibold xs:text-[11px]">
                      {location.Work_Code}
                    </td>
                    <td className="border-r-2 rounded p-3 font-semibold xs:text-[11px]">
                      {location.WorkCode_Latitude}
                    </td>
                    <td className="border-r-2 rounded p-3 font-semibold xs:text-[11px]">
                      {location.WorkCode_Longitude}
                    </td>
                    <td className="rounded p-3">
                      <ButtonFun
                        onClick={() => {
                          setisLoading((prev) => ({ ...prev, Model: true }));
                          setlocationData((prev) => ({
                            ...prev,
                            Selected: location,
                          }));
                        }}
                        Text={"EDIT"}
                        className={
                          "shadow-md px-6 xs:text-[12px] hover:cursor-pointer text-[14px] p-1 text-white bg-purple-900 font-bold rounded-full"
                        }
                      />
                    </td>{" "}
                  </tr>{" "}
                  {isLoading?.Model && (
                    <Location_EditForm
                      Data={locationData.Selected}
                      setisLoading={setisLoading}
                      GetLocation={GetLocation}
                    />
                  )}
                </>
              ))}

            {locationData.Location.length <= 0 &&
              isLoading.Loading === false && (
                <tr>
                  <td colSpan="4" className="text-center font-semibold p-2">
                    No Data Available
                  </td>
                </tr>
              )}
            {isLoading.Loading === true && (
              <tr>
                <td colSpan="100%" className="font-semiboldpy-6  text-center">
                  <LoadingCom />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Admin_LocationList;
