import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";
import Dashboard from "./Pages/User/Dashboard";
import User_datali from "./Pages/User/User_datali";
import Admin_login from "./Pages/Admin/Admin_login";
import Admin_Dashboard from "./Pages/Admin/Admin_Dashboard";
import Edit_Admin from "./Pages/Admin/Edit_Admin";
import Admin_Datali from "./Pages/Admin/Admin_Datali";
import Admin_worklocation from "./Pages/Admin/Admin_worklocation";
import Login_cameras from "./Pages/User/Login_camers";
import ProtectedRoute from "./services/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/User_data" element={<User_datali />} />
          <Route path="/Admin" element={<Admin_login />} />
          <Route
            path="/A_Dash"
            element={
              <ProtectedRoute Role="Admin">
                <Admin_Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Admin_Edit"
            element={
              <ProtectedRoute Role="Admin">
                <Edit_Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Admin_datali"
            element={
              <ProtectedRoute Role="Admin">
                <Admin_Datali />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Admin_worklocationdata"
            element={
              <ProtectedRoute Role="Admin">
                <Admin_worklocation />
              </ProtectedRoute>
            }
          />
           
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
