import 'bootstrap/dist/css/bootstrap.min.css'
import React,{useState, useEffect} from 'react'
import './Login.css';
import instance from '../../Containers/Utils/axios'; 
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {setCredentials} from '../../Redux/Slices/userAuthSlice'
import { jwtDecode } from 'jwt-decode';




function Login() {

  // const {userInfos} = useSelector((state)=>state.auth);


  const userInfos = useSelector((state)=>state.auth);
  console.log(userInfos,"userinfoooooooooooooooooooo")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {userInfo} = useSelector((state) => state.auth || {});

  useEffect(()=>{
    if (userInfo){
      navigate('/')
    }
  },[userInfo])

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });


  const handleInputChange = (e) =>{
    const {name, value} = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    console.log(formData.email,"email",formData.password)
  try{
    const response = await instance.post('/api/login/',{
        username: formData.name,
        password: formData.password
    });

    
    if (response.status=== 200){
      const decodeAccessToken = jwtDecode(response.data.access)
      console.log("decode access tokens", decodeAccessToken.is_active)
      const is_active = decodeAccessToken.is_active
      try{
        const decodeAccessToken = jwtDecode(response.data.access)
        console.log('login successfull'.decodeAccessToken);
        // const is_active = decodeAccessToken.userInfo.userInfo.is_active
        if (is_active === true){
          dispatch(setCredentials({decodeAccessToken,...response.data}))
          toast.success('Login successful');
          navigate('/');
          
        }else{
          toast.success('Account is blocked')
          console.log("account is blocked")
        }
  
      }catch{
        console.log("token not decoded")
      }
    }else{
      toast.error(`Login failed: ${response.data.error}`);
      console.log('login faild', response.data.error);
    }
    }catch(error){
      toast.error(`Login failed`);
      console.error('Login Faild', error.message);
    }
  }


  return (
<section className="background-radial-gradient overflow-hidden">
<div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
  <div className="row gx-lg-5 align-items-center mb-5">
    <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
      <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: 'hsl(218, 81%, 95%)' }}>
      Welcome to our platform  <br />
        <span style={{ color: 'hsl(218, 81%, 75%)' }}>Login to access your account</span>
      </h1>
      <p className="mb-4 opacity-70" style={{ color: 'hsl(218, 81%, 85%)' }}>
      Enjoy a seamless experience.
      Easily log in to access your account and explore
      the features and services we offer.
      Your satisfaction is our priority!

      </p>
    </div>

    <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
      <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
      <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

      <div className="card bg-glass">
        <div className="card-body px-4 py-5 px-md-5">
          <form onSubmit={handleSubmit}>

            {/* Email input */}
            <div className="form-outline mb-4">
              <input type="text" name='name' id="form3Example3" className="form-control" onChange={handleInputChange} required />
              <label className="form-label" htmlFor="form3Example3">Username</label>
            </div>

            {/* Password input */}
            <div className="form-outline mb-4">
              <input type="password" name='password' id="form3Example4" className="form-control" onChange={handleInputChange} required />
              <label className="form-label" htmlFor="form3Example4">Password</label>
            </div>

     
            <div>
            <p className="text-center text-muted ">Create new account? <Link to="/register" className="fw-bold text-body"><u>Register here</u></Link></p>
            <button type="submit" className="btn btn-primary btn-block ">
              Sign up
            </button>

            </div>
            {/* Submit button */}

          
            
            {/* Register buttons */}
            <div className="text-center">
              {/* <p>or sign up with:</p> */}
              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-facebook-f"></i>
              </button>

              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-google"></i>
              </button>

              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-twitter"></i>
              </button>

              <button type="button" className="btn btn-link btn-floating mx-1">
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
)
}

export default Login