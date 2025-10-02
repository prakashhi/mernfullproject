import React, { useEffect, useState } from "react";
import apiClent from "./api";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, Role }) => {
  const [flag, setflag] = useState();
  const navigate = useNavigate();

  const AuthCheck = async () => {
    try {
      await apiClent.get(`/auth/${Role}`);
      setflag(true);
    } catch (err) {
      console.log(err);
      if (Role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    AuthCheck();
  }, []);

  return flag == true && children;
};

export default ProtectedRoute;
