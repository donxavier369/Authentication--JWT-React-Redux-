import React from 'react'; // Import React
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function AdminPrivateRoute() { // Rename the function with an uppercase letter at the beginning
    const {adminInfo} = useSelector((state) => state.adminAuth);

  return(
    adminInfo ? <Outlet /> : <Navigate to="/admin" />
  ) 
}
export default AdminPrivateRoute; // Export the component with the correct name
