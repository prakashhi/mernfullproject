import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../services/api";
import Camera from "../../Components/Camera";



const Login_camers = () => {
  
  const navigate = useNavigate();

  const { id } = JSON.parse(localStorage.getItem("User"));

  const FaceEncoding = async (UserFaceEncoding) => {
    try {
      let res = await apiClient.post("/LoginFaceAuth", {
        Id: id,
        FaceEncoding: UserFaceEncoding,
      });
      navigate("/Dashboard");
      toast.success(res?.data?.msg);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex justify-center  border w-1/3 mt-10 rounded-xl m-3 xs:w-full xs:mt-20">
          <Camera Role={"UserCamera"} FaceEncoding={FaceEncoding} />
        </div>
      </div>
    </>
  );
};

export default Login_camers;
