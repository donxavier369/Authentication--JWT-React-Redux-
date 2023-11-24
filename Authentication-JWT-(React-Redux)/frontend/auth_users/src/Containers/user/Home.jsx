import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "../../Containers/Utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/Slices/userAuthSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCredentials } from "../../Redux/Slices/userAuthSlice";

function Home() {
  const imagePath = require("./images/logout.png"); // Relative path to the image
  const uploadimage = require("./images/upload.png");
  const profileimage = require("./images/profile.jpg");
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth);
  // const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  console.log(userInfo, "kkkkkkkkkkkkkkkkkkkkkkk");
  let userId;
  let profileId;
  let userDetails;
  let decodeAccessToken;
  let userdetail;

  try {
    userId = userInfo.userInfo.decodeAccessToken.user_id;
    profileId = userInfo.userInfo.decodeAccessToken.id;
    userDetails = userInfo.userInfo.decodeAccessToken;
    decodeAccessToken = userInfo.userInfo.decodeAccessToken;
    userdetail = userInfo.userInfo.decodeAccessToken;
  } catch {
    userId = userInfo.userInfo.userInfo.decodeAccessToken.user_id;
    profileId = userInfo.userInfo.userInfo.decodeAccessToken.id;
    userDetails = userInfo.userInfo.userInfo.decodeAccessToken;
    decodeAccessToken = userInfo.userInfo.userInfo.decodeAccessToken;
    userdetail = userInfo.userInfo.userInfo.decodeAccessToken;
  }

  console.log(userId, "userid and profile id", profileId);
  console.log(userInfo, "user infooooooooooooooos");
  const [selectedImage, setSelectedImage] = useState({
    user: userId,
  });
  const [profile, setPorfile] = useState({});



  const [showImage, setShowImage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // const {id, user_id, userimage} = profile;

  const handleLogout = async () => {
    console.log("hello");
    dispatch(logout());
    toast.success("Logout Successful");

    navigate("/login");
  };

  //========================================Profile Image============================================//
  const [imageSelected, setImageSelected] = useState(false);

  // for uploading the 1st image
  const handleImageSubmit = (e) => {
    console.log(e, "fileeeesrrrrrr", selectedImage);

    e.preventDefault();
    console.log("with in the handleimangesubmit");
    if (!showImage) {
      // for uploading the 1st image
      axios
        .post("/api/userprofiles/", selectedImage, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("successfully  updated");
          toast.success("Image Added Successfully");
          setSubmitted(true);
        })
        .catch((error) => {
          console.error("error Adding image", error);
          toast.error("Error Adding Image!");
        });
    } else {
      // for replacing already existing image
      axios
        .patch(`api/updateimage/${profile.id}/`, selectedImage, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Image Updated Successfully");
          toast.success("Image Updated Successfully");
          setSubmitted(true);
        })
        .catch((error) => {
          console.error("Error Updating Image", error);
          toast.error("Updated Error!");
        });
    }
  };

  const handleImageChange = (e) => {
    setImageSelected(true);
    console.log("haiiiiiiiiiiiiiiiiiii");
    const file = e.target.files[0];
    setSelectedImage({
      ...selectedImage,
      userimage: file,
    });
    console.log(file, "fileeeesrrrrrr", selectedImage);
  };

  useEffect(() => {
    if (!imageSelected) {
      console.log("plz choose an image");
    }
  }, [setImageSelected]);


   //=====================delete profile image=============================//
   const [isImageDeleted, setIsImageDeleted] = useState(false);
   const handleImageDelete =()=>{
      axios
        .post(`/api/deleteuserprofile/${userId}/`)
        .then((response) => {
          setIsImageDeleted(true); // Update the state to trigger re-render
          console.log(response.data.messasge, "Image Deleted Successfully");
          toast.success("Image Deleted Successfully")
          setSubmitted(true);

          
        })
        .catch((error) => {
          console.log(error.response.data, "Can't Delete Image");
          toast.error("Cant't delete Image")
        });
   }


  //============Intial rendering=========================================================

  useEffect(() => {
    // Make a GET request to your API endpoint to fetch the user profile image
    axios
      .get(`/api/getuserprofile/${userId}/`)
      .then((response) => {
        setShowImage(`http://127.0.0.1:8000${response.data.userimage}`);
        setPorfile(response.data);
        console.log("workeddddddddddddddddd",response.data.userimage);
    
        setSubmitted(false);
        setImageSelected(false);
      })
      .catch((error) => {
        console.error("Error fetching user profile image:", error.response.data);
      });
  }, [userId, submitted, showImage, imageSelected]);

  //===================================Edit User=========================================//
  const [editingUser, setEditingUser] = useState(null);
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

  const handleUpdateUser = () => {
    axios
      .put(`/api/updateUsers/${userId}/`, updatedUserData)
      .then((response) => {
        console.log(response.data, "success editing");
        toast.success("Profile Updated Successfull");

        const updatedUserInfo = {
          ...existingUserInfo,
          userInfo: {
            ...existingUserInfo.userInfo,
            decodeAccessToken: {
              ...userDetails,
              name: updatedUserData.username,
              email: updatedUserData.email,
            },
          },
        };

        // Update the Redux state with the new object
        dispatch(setCredentials(updatedUserInfo));

        // Reset the editingUser and updatedUserData states
        setEditingUser(null);
        setUpdatedUserData({ username: "", email: "" });

        // Close the modal
        document.getElementById("exampleModal").click();
      })
      .catch((error) => {
        // console.error("Error updating user data:", error.response.data);

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
  //+++++++++++username validation+++++++++++++++++++++//

  const validateUserName = (e) => {
    const value = e.target.value;
  
    const errors = {
      username: '',
    };
  
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;
  
    if (!usernameRegex.test(value)) {
      errors.username = "Username must start with a letter and only contain letters and numbers.";
    }
  
    setErrorMessages2({
      ...errorMessages2,
      ...errors,
    });
  };

  //======================email validation=========================//
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
 
//======================================================================================//
  return (
    <div className="home-container">
      <header className="bg-primary text-white py-5">
        <div className="container text-center">
          <h1 className="display-4">Welcome to Your Website</h1>
          <p className="lead">Where great things happen</p>
          {/* <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginTop: '10px' }}>{userdetail.name}</p> */}
        </div>
      </header>

      <section className="py-5">
        <div className="container">
          <div className="row">
            {/* upload image */}
            <div className="col-md-4">
              <div className="card mb-4">
                <img
                  src={uploadimage}
                  alt="uploadimage"
                  className="card-img-top"
                />
                <div className="card-body">
                  <input
                    style={{ inlineSize: "222px", color: "#d89898" }}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <br />
                  <br />
                  {selectedImage.userimage ? (
                    <button
                      className="py1 px-4"
                      style={{ background: "#1c8adb", color: "#fff" }}
                      onClick={handleImageSubmit}
                    >
                      Submit Image
                    </button>
                  ) : (
                    <p>Update The Profile Picture</p>
                  )}
                  {/* {showImage ? (
                    <button
                    className="py1 px-4"
                    style={{ background: "#1c8adb", color: "#fff" }}
                    onClick={handleImageDelete}
                  >
                    Delete ProfileImage
                  </button>
                  ):(
                    null
                  )} */}

                  
                </div>
              </div>
            </div>
            {/* user details */}
            <div className="col-md-4">
              <div className="card mb-4">
                <img
                  className="card-img-top"
                  src={showImage ? showImage : profileimage}
                  alt="User Profile"
                />
                <div className="card-body">
                  <div>
                    <p style={{ color: "#7a0943" }}>
                      Name {userdetail && userdetail.name}
                    </p>
                    <p style={{ color: "#5b09e0" }}>
                      Email {userdetail && userdetail.email}
                    </p>
                  </div>
                </div>

                {/* modal for edit user */}
                <button
                  type="button"
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#exampleModal"
                  data-whatever="@mdo"
                  onClick={() =>
                    setUpdatedUserData({
                      username: userdetail.name,
                      email: userdetail.email,
                    })
                  }
                >
                  Edit Profile
                </button>

                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
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
                              Name:
                            </label>
                            <div className="text-danger">
                              {errorMessages2.username}
                            </div>{" "}
                            <input
                              type="text"
                              className="form-control"
                              id="recipient-name"
                              value={updatedUserData.username} // Set value to updatedUserData.username
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
                          onClick={handleUpdateUser}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* logout */}
            <div className="col-md-4">
              <div className="card mb-4">
                <img src={imagePath} alt="Logout" className="card-img-top" />
                <div className="card-body">
                  <p>Are you sure you want to logout? </p>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger px-3 py-1 "
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
