import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
// import './Login.css';
import axios from "../../Containers/Utils/axios";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {setAdminCredentials} from '../../Redux/Slices/adminAuthSlice'
import {useSelector,useDispatch} from 'react-redux';



function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminInfos = useSelector((state) => state.adminAuth);
  console.log(adminInfos,"this is admin info")

  const { adminInfo } = useSelector((state) => state.adminAuth || {});

  console.log(adminInfo,"admin infoooooo")

  useEffect(()=>{
    if (adminInfo){
      navigate('/admin/dashboard')
    }
  },[adminInfo])

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData.email, "email", formData.password);
    try {
      const response = await axios.post("/api/login/", {
        username: formData.name,
        password: formData.password,
      });
      if (response.status === 200) {
        const decodeAccessToken = jwtDecode(response.data.access);
        let is_active = decodeAccessToken.is_active

        if (decodeAccessToken.superuser === true || is_active === true) {
          
          dispatch(setAdminCredentials({decodeAccessToken,...response.data}))
          toast.success("Login Successfull");
          navigate("/admin/dashboard");
        } else {
          toast.error("you are not an admin");
          console.log("You are not an admin");
          navigate("/admin");
        }
      } else {
        toast.error("Invalid Credentials")
        console.log("login faild", response.data.error);
      }
    } catch (error) {
      toast.error("Invalid credentials")
      console.error("Invalid Credentials", error.message);
    }
  };

  return (
    <div style={{ height: "100vh" }}> {/* Ensure full height */}
    <section className="background-radial-gradient overflow-hidden">
      <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
        <div className="row gx-lg-5 align-items-center mb-5">
          <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
            <h1
              className="my-5 display-5 fw-bold ls-tight"
              style={{ color: "hsl(218, 81%, 95%)" }}
            >
              Welcome, Admin <br />
              <span style={{ color: "hsl(218, 81%, 75%)" }}>
                to the Dashboard
              </span>
            </h1>
            <p
              className="mb-4 opacity-70"
              style={{ color: "hsl(218, 81%, 85%)" }}
            >
            Manage your dashboard and access important information.
            Stay in control of your platform's performance, user activities, and data insights 
            to make informed decisions and drive success.

            </p>
          </div>

          <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
            <div
              id="radius-shape-1"
              className="position-absolute rounded-circle shadow-5-strong"
            ></div>
            <div
              id="radius-shape-2"
              className="position-absolute shadow-5-strong"
            ></div>

            <div className="card bg-glass">
              <div className="card-body px-4 py-5 px-md-5">
                <form onSubmit={handleSubmit}>
                  {/* Email input */}
                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      name="name"
                      id="form3Example3"
                      className="form-control"
                      onChange={handleInputChange}
                      required
                    />
                    <label className="form-label" htmlFor="form3Example3">
                      Username
                    </label>
                  </div>

                  {/* Password input */}
                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      name="password"
                      id="form3Example4"
                      className="form-control"
                      onChange={handleInputChange}
                      required
                    />
                    <label className="form-label" htmlFor="form3Example4">
                      Password
                    </label>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                  >
                    Sign up
                  </button>

                  {/* Register buttons */}
                  <div className="text-center">
                    {/* <p>or sign up with:</p> */}
                    <button
                      type="button"
                      className="btn btn-link btn-floating mx-1"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </button>

                    <button
                      type="button"
                      className="btn btn-link btn-floating mx-1"
                    >
                      <i className="fab fa-google"></i>
                    </button>

                    <button
                      type="button"
                      className="btn btn-link btn-floating mx-1"
                    >
                      <i className="fab fa-twitter"></i>
                    </button>

                    <button
                      type="button"
                      className="btn btn-link btn-floating mx-1"
                    >
                      <i className="fab fa-github"></i>
                    </button>    <button
                      type="button"
                      className="btn btn-link btn-floating mx-1"
                    >
                      <i className="fab fa-github"></i>
                    </button>
                    
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}

export default Login;
