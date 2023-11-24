import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import './Register.css';
import instance from '../../Containers/Utils/axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function Register() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    username: '',
    email: '',
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
  
    try {
      const response = await instance.post('/api/register/', {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });
    
      if (response.status === 201) {
        toast.success('Registration Successful');
        navigate('/login');
        console.log('Registration successful', response.data);
      } else {
        setErrorMessages(response.data);
        toast.error('Registration Failed');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Validation error from Django REST Framework
        setErrorMessages(error.response.data);
       
        console.log('Username error:', errorMessages.username);
        console.log('Email error:', errorMessages.email);
        toast.error(errorMessages.username ? errorMessages.username[0] : null)
        toast.error(errorMessages.email ?  errorMessages.email[0] : null)
        
      } else {
        setErrorMessages({
          username: '',
          email: '',
        });
        toast.error('Registration Failed');
        console.log('Registration failed', error.message);
      }
    }
    
  };
  

  //----------------------------validations-----------------------------------------------//
  const [errorMessages1, setErrorMessages1] = useState({
    password: '',
    password1: '',
  });

  const [errorMessages2, setErrorMessages2] = useState({
    username: '',
  });

  const [errorMessages3, setErrorMessages3] = useState({
    email: '',
  });




  const validatePassword = (e) => {
    const value = e.target.value;
  
    const errors = {
      password: '',
      password1: '',
    };
  
    // Minimum 6 characters
    if (value.length < 6) {
      errors.password = "Your password must be at least 6 characters long.";
    }
  
    // No spaces allowed
    if (value.includes(' ')) {
      errors.password1 = "Password should not contain any spaces.";
    }
  
    // Regex for at least one uppercase letter, one lowercase letter, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  
    if (!passwordRegex.test(value)) {
      errors.password += " Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    }
  
    setErrorMessages1({
      ...errorMessages1,
      ...errors,
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
  const validateUserEmail = (e) => {
    const value = e.target.value;
  
    // Regular expression pattern for email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
    if (!emailPattern.test(value)) {
      setErrorMessages3({
        ...errorMessages3,
        email: 'Invalid email address',
      });
    } else {
      setErrorMessages3({
        ...errorMessages3,
        email: '',
      });
    }
  };
  
  //======================================================//
  return (
    <section
      className="vh-100 bg-image"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: '15px' }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">Create an account</h2>

                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <input
                        onChange={(e) => {
                          validateUserName(e);
                          handleInputChange(e);
                        }}
                        type="text"
                        name="name"
                        id="form3Example1cg"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label" htmlFor="form3Example1cg">
                        Your Name
                      </label>
                      <div className="text-danger">{errorMessages2.username}</div>{' '}
                    </div>

                    <div className="form-outline mb-4">
                      <input
                      onChange={(e) => {
                        validateUserEmail(e);
                        handleInputChange(e);
                      }}
                        type="email"
                        name="email"
                        id="form3Example3cg"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label" htmlFor="form3Example3cg">
                        Your Email
                      </label>
                      <div className="text-danger">{errorMessages3.email}</div>{' '}
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        onChange={(e) => {
                          validatePassword(e);
                          handleInputChange(e);
                        }}
                        type="password"
                        name="password"
                        id="form3Example4cg"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label" htmlFor="form3Example4cg">
                        Password
                      </label>
                      <div className="text-danger">{errorMessages1.password}{errorMessages1.password1}</div>{' '}
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Register
                      </button>
                    </div>

                    <p className="text-center text-muted mt-4 mb-0">
                      Have already an account?{' '}
                      <Link to="/login" className="fw-bold text-body">
                        <u>Login here</u>
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
