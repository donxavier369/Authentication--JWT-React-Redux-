import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "../user/Register";
import Login from "../user/Login";
import Adminlogin from "../admin/Adminlogin";
import AdminDashboard from "../admin/AdminDashboard";
import Home from "../user/Home";
import UserPrivateRoute from "../Utils/UserPrivateRoute";
import AdminPrivateRoute from "../Utils/AdminPrivateRoute";
import UserProfile from "../user/UserProfile";

function Router() {
  return (
    <Routes>
      {/* for user side routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="" element={<UserPrivateRoute />}>
        <Route path="/" element={<Home />} />
        {/* <Route path='/profile' element={<UserProfile />} /> */}
      </Route>



      {/* for admin side routes */}
      <Route path="/admin" element={<Adminlogin />} />

      <Route path="" element={<AdminPrivateRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

    </Routes>
  );
}

export default Router;
