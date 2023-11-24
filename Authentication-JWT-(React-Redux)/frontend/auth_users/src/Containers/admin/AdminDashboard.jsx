import React, { useState, useEffect, useRef } from "react";
import axios from "../../Containers/Utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../Redux/Slices/adminAuthSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { setCredentials } from "../../Redux/Slices/userAuthSlice";
import ReactPaginate from "react-paginate";

function AdminDashboard() {
  const adminimage = require("./adminimages/admin.jpg"); // Relative path to the image

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPopover, setShowPopover] = useState(false);
  const [users, setUsers] = useState([]);
  const { adminInfo } = useSelector((state) => state.adminAuth);
  console.log(adminInfo, "this is admin info");

  //============================block and unblock the user================================//
  const handleBlockUser = (userId) => {
    // Make a PATCH request to block the user
    axios
      .patch(`/api/block-unblock/${userId}/`)
      .then((response) => {
        // Update the user's status in the state
        const updatedUsers = users.map((user) => {
          if (user.id === userId) {
            return { ...user, is_active: false };
          }
          return user;
        });
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error("Error blocking user:", error);
        toast.error("Error Blocking User!");
      });
  };

  const handleUnblockUser = (userId) => {
    // Make a PATCH request to unblock the user
    axios
      .patch(`/api/block-unblock/${userId}/`)
      .then((response) => {
        // Update the user's status in the state
        const updatedUsers = users.map((user) => {
          if (user.id === userId) {
            return { ...user, is_active: true };
          }
          return user;
        });
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error("Error unblocking user:", error);
      });
  };

  //================================Admin Logout====================================//

  const handleLogout = async () => {
    console.log("hello");
    dispatch(adminLogout());
    toast.success("Logout Successful");
    navigate("/admin");
  };

  //===================================Email Validation=============================================//
  const [errorMessages1, setErrorMessages1] = useState({
    email: "",
  });

  const [errorMessages2, setErrorMessages2] = useState({
    username: "",
  });

  const validateUserEmail = (e) => {
    const value = e.target.value;

    // Regular expression pattern for email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(value)) {
      setErrorMessages1({
        ...errorMessages1,
        email: "Invalid email address",
      });
    } else {
      setErrorMessages1({
        ...errorMessages1,
        email: "",
      });
    }
  };
  //=====================usernamevalidation=========================//

  const validateUserName = (e) => {
    const value = e.target.value;

    const errors = {
      username: "",
    };

    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;

    if (!usernameRegex.test(value)) {
      errors.username =
        "Username must start with a letter and only contain letters and numbers.";
    }

    setErrorMessages2({
      ...errorMessages2,
      ...errors,
    });
  };
  //=================================editing user==================================//
  const modalRef = useRef(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({
    username: "",
    email: "",
  });
  const existingUserInfo = useSelector((state) => state.auth);
  console.log(existingUserInfo, "this is the existing use info");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

  const handleUpdateUser = (userId) => {
    setIsEdited(true);
    axios
      .put(`/api/updateUsers/${userId}/`, updatedUserData)
      .then((response) => {
        console.log(response.data, "success editing");
        toast.success("Profile Updated Successfull");

        // Reset the editingUser and updatedUserData states
        setEditingUser(null);
        setUpdatedUserData({ username: "", email: "" });
      })
      .catch((error) => {
        console.error("Error updating user data:", error);

        let emailError = null;
        let nameError = null;

        if (error.response.data.email) {
          emailError = error.response.data.email[0];
        }

        if (error.response.data.username) {
          nameError = error.response.data.username[0];
        }
        if (emailError !== null) {
          toast.error(emailError);
        }
        if (nameError !== null) {
          toast.error(nameError);
        }
      });
  };

  //=======================Create User==================//
  const [isCreated, setIsCreated] = useState(false);
  const [errorMessages3, setErrorMessages3] = useState({
    password: "",
    password1: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    username: "",
    email: "",
  });

  //================================password validation====================================//

  const validatePassword = (e) => {
    const value = e.target.value;

    const errors = {
      password: "",
      password1: "",
    };

    // Minimum 6 characters
    if (value.length < 6) {
      errors.password = "Your password must be at least 6 characters long.";
    }

    // No spaces allowed
    if (value.includes(" ")) {
      errors.password1 = "Password should not contain any spaces.";
    }

    // Regex for at least one uppercase letter, one lowercase letter, one digit, and one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

    if (!passwordRegex.test(value)) {
      errors.password +=
        " Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    }

    setErrorMessages3({
      ...errorMessages1,
      ...errors,
    });
  };

  const registerInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //====================create user=========================================//
  console.log(formData, "this is form dataaaaaaaaaaa");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreated(true);

    try {
      const response = await axios.post("/api/register/", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        toast.success("Registration Successful");
        navigate("/admin/dashboard");
        console.log("Registration successful", response.data);
      } else {
        setErrorMessages(response.data);
        toast.error("Registration Failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Validation error from Django REST Framework
        setErrorMessages(error.response.data);

        console.log("Username error:", errorMessages.username);
        console.log("Email error:", errorMessages.email);
        toast.error(errorMessages.username ? errorMessages.username[0] : null);
        toast.error(errorMessages.email ? errorMessages.email[0] : null);
      } else {
        setErrorMessages({
          username: "",
          email: "",
        });
        toast.error("Registration Failed");
        console.log("Registration failed", error.message);
      }
    }
  };

  //======================Search User=========================//
  const handleSearch = (query) => {
    // Update the API request with the search query
    axios.get(`/api/userslist/?search=${query}`).then((response) => {
      setUsers(response.data);
    });
  };



  //======================useEffect===========================//
  useEffect(() => {
    // Make an API request to fetch user data
    axios
      .get("/api/userslist/")
      .then((response) => {
        setUsers(response.data);
        console.log(response.data, "response dataaaaaaaaaaaaa");
        setIsEdited(false);
        setIsCreated(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [isEdited, isCreated]);
  //==============================================================================================//
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "30px" }}
    >
      <div 
      className="mt-0"
      style={{marginRight : "30px", marginBottom : "50rem"}}
      >
            {/* for adimin  */}
      {users.map((user) =>
        user.is_superuser === true ? (
          <div className="card mb-0 mt-5 align-items-center">
            <div className="card-body text-center">
              <img
                // src={user.image}
                src={adminimage}
                alt="avatar"
                className="rounded-circle img-fluid"
                style={{ width: "150px", border: "2px solid black" }}
              />
              <h5 className="my-3">{user.username.toUpperCase()}</h5>
              <p className="text-muted mb-1">{user.email}</p>
              <div className="d-flex justify-content-center mb-2">
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-danger px-5 mt-2"
                    style={{ marginRight: "10px" }} // Add margin to create spacing
                    onClick={() => setShowPopover(true)}
                  >
                    Logout
                  </button>
                  {showPopover && (
                    <div className="popover">
                      <div className="popover-content">
                        <p>Are you sure you want to log out?</p>
                        <button
                          className="btn btn-danger"
                          style={{
                            marginRight: "10px",
                            border: "none",
                            outline: "none",
                          }}
                          onClick={() => {
                            handleLogout();
                            setShowPopover(false);
                          }}
                        >
                          Yes
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ border: "none", outline: "none" }}
                          onClick={() => setShowPopover(false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null
      )}
      </div>

      <div className="col-md-9">
        <div
          className="mt-5 display: 'flex',"
          style={{ alignItems: "center" }}
        >
          
          <h3 style={{ background: "#99b138", letterSpacing: "0.2rem" }}>
            Hello, Admin! Welcome to the Dashboard.
          </h3>
        </div>
        <button
          style={{
            background: "#0c6060",
            color: "#fff",
            marginLeft: "52.2rem",
          }}
          type="button"
          className=" btn-sm btn-rounded"
          data-toggle="modal"
          data-target={`#exampleModal`}
          data-whatever="@getbootstrap"
          // onClick={() =>
          //   setUpdatedUserData({
          //     username: user.username,
          //     email: user.email,
          //   })
          // }
        >
          Create User
        </button>
        <input
          type="text"
          style={{ marginLeft: "15px" }}
          placeholder="Search users..."
          onChange={(e) => handleSearch(e.target.value)}
        />
        {/* ==================================================================================== */}
        <table className="table align-middle mb-0 bg-white mt-5">
          <thead className="bg-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) =>
              user.is_superuser === false ? (
                <tr key={user.id}>
                  <td>
                    <div className="align-items-center">
                      <div className="ms-3">
                        <p className="fw-bold mb-1">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="fw-normal mb-1">{user.email}</p>
                  </td>
                  <td>{user.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    <>
                      {user.is_active ? (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm btn-rounded"
                          onClick={() => handleBlockUser(user.id)}
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-success btn-sm btn-rounded btn-sm btn-rounded"
                          onClick={() => handleUnblockUser(user.id)}
                        >
                          Unblock
                        </button>
                      )}
                    </>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm btn-rounded"
                      data-toggle="modal"
                      data-target={`#exampleModal-${user.id}`}
                      data-whatever="@getbootstrap"
                      onClick={() =>
                        setUpdatedUserData({
                          username: user.username,
                          email: user.email,
                        })
                      }
                    >
                      Edit
                    </button>

                    <div
                      className="modal fade"
                      id={`exampleModal-${user.id}`}
                      tabIndex="-1"
                      role="dialog"
                      aria-labelledby={`exampleModalLabel-${user.id}`}
                      aria-hidden="true"
                      ref={modalRef}
                    >
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                              Edit Profile
                            </h5>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <form>
                              <div className="form-group">
                                <label
                                  htmlFor="recipient-name"
                                  className="col-form-label"
                                >
                                  Name:{user.id}
                                </label>
                                <div className="text-danger">
                                  {errorMessages2.username}
                                </div>{" "}
                                <input
                                  type="text"
                                  className="form-control"
                                  id="recipient-name"
                                  value={updatedUserData.username}
                                  onChange={(e) => {
                                    validateUserName(e);
                                    handleInputChange(e);
                                  }}
                                  name="username"
                                />
                              </div>
                              <div className="form-group">
                                <label
                                  htmlFor="recipient-name"
                                  className="col-form-label"
                                >
                                  Email:
                                </label>
                                <div className="text-danger">
                                  {errorMessages1.email}
                                </div>{" "}
                                <input
                                  type="email"
                                  className="form-control"
                                  id="recipient-email"
                                  value={updatedUserData.email} // Set value to updatedUserData.email
                                  onChange={(e) => {
                                    validateUserEmail(e);
                                    handleInputChange(e);
                                  }}
                                  name="email"
                                />
                              </div>
                            </form>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-dismiss="modal"
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleUpdateUser(user.id)}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="modal fade"
                      id={`exampleModal`}
                      tabIndex="-1"
                      role="dialog"
                      aria-labelledby={`exampleModalLabel`}
                      aria-hidden="true"
                    >
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                              Create User
                            </h5>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                              <div className="form-outline mb-4">
                                <input
                                  onChange={(e) => {
                                    validateUserName(e);
                                    registerInputChange(e);
                                  }}
                                  type="text"
                                  name="name"
                                  id="form3Example1cg"
                                  className="form-control form-control-lg"
                                  required
                                />
                                <label
                                  className="form-label"
                                  htmlFor="form3Example1cg"
                                >
                                  Your Name
                                </label>
                                <div className="text-danger">
                                  {errorMessages2.username}
                                </div>{" "}
                              </div>

                              <div className="form-outline mb-4">
                                <input
                                  onChange={(e) => {
                                    validateUserEmail(e);
                                    registerInputChange(e);
                                  }}
                                  type="email"
                                  name="email"
                                  id="form3Example3cg"
                                  className="form-control form-control-lg"
                                  required
                                />
                                <label
                                  className="form-label"
                                  htmlFor="form3Example3cg"
                                >
                                  Your Email
                                </label>
                                <div className="text-danger">
                                  {errorMessages1.email}
                                </div>{" "}
                              </div>

                              <div className="form-outline mb-4">
                                <input
                                  onChange={(e) => {
                                    validatePassword(e);
                                    registerInputChange(e);
                                  }}
                                  type="password"
                                  name="password"
                                  id="form3Example4cg"
                                  className="form-control form-control-lg"
                                  required
                                />
                                <label
                                  className="form-label"
                                  htmlFor="form3Example4cg"
                                >
                                  Password
                                </label>
                                <div className="text-danger">
                                  {errorMessages3.password}
                                  {errorMessages3.password1}
                                </div>{" "}
                              </div>
                              <div className="d-flex justify-content-center">
                                <button
                                  type="submit"
                                  className="btn btn-success btn-block btn-md gradient-custom-4 text-body"
                                >
                                  Register
                                </button>
                              </div>
                            </form>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-dismiss="modal"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : null
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
