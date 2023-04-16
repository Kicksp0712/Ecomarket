import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from './Context/AuthContext';

/**
 * It then checks if the user is allowed to navigate to children. If the user is not allowed , 
 * it redirects to the *Login* or _redirectPath_ using Navigate.
 * 
 * `children` : The routes wil be proctect
 * 
 * `isAllowed` : The statment conditional 
 * 
 * `redirectPath` : The path to redirect is not allowed. *Default*  is "/login"
 * 
 * `callback` : Function to excute when is not allowed
 */
const ProtectedRoute = ({children}) => {
  const {userAuth} = UserAuth();
 
  
  if(!userAuth){
    return <Navigate to="/login"  />
  }
  return children;
  
};

export default ProtectedRoute ;