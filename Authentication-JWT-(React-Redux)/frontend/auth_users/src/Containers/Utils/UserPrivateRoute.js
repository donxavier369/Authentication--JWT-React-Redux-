import React from 'react'; // Import React
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function UserPrivateRoute() { // Rename the function with an uppercase letter at the beginning
    const {userInfo} = useSelector((state) => state.auth);

  return(
    userInfo ? <Outlet /> : <Navigate to="/login" />
  ) 
}
export default UserPrivateRoute; // Export the component with the correct name
