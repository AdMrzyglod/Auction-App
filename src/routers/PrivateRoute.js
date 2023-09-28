import {  Navigate  } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'


export default function PrivateRoute({ children }) {

  const isAuthenticated = useContext(AuthContext);
    
    if (isAuthenticated===null) {
      
        return <Navigate to="/auction-login" replace />
    }

    return children;
}