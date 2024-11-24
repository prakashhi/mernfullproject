import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import User_datali from './Pages/User_datali';
import Admin_login from './Pages/Admin_login';
import Admin_Dashboard from './Pages/Admin_Dashboard';
import Edit_Admin from './Pages/Edit_Admin';
import Admin_Datali from './Pages/Admin_Datali';
import Admin_worklocation from './Pages/Admin_worklocation';
import Login_cameras from './Pages/Login_camers';

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
          <Route path="/A_Dash" element={<Admin_Dashboard />} />
          <Route path="/Admin_Edit" element={<Edit_Admin />} />
          <Route path="/Admin_datali" element={<Admin_Datali />} />
          <Route path="/Admin_worklocationdata" element={<Admin_worklocation />} />
          <Route path="/login_camera" element={<Login_cameras />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  )
}

export default App;