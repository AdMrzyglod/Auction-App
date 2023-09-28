import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import "./navbar.css"
import { Link } from "react-router-dom";
import {  signOut } from "firebase/auth";
import {auth} from '../../config/firebase';

export default function Navbar(){
  
   const currentUser = useContext(AuthContext);

   async function logOut(){

    try{
        
        await signOut(auth);
    }
    catch{
        console.log("Problem with logout!")
    }
}

   const handleLogout = () => {               
      
      logOut();
    };


    return(
          <nav>
              <ul className="ul-navbar">
                  <div>
                    <li><Link to="/">Home</Link></li>
                    <li className="dropdown">
                      <p className="dropbtn">Panel</p>
                        <div className="dropdown-content">
                           <Link to="/auction-list">Lista</Link>
                           {
                            currentUser ? (
                              <div>
                                 <Link to="/auction-history">Konto</Link>
                                 <Link to="/auction-add">Dodaj licytacje</Link>
                              </div>
                            ): 
                            (
                              <div>
                              </div>
                            )
                           }
                        </div>
                    </li>
                  </div>
                  {currentUser ? (
                    <div className="login-user">
                       <li><p>{currentUser.userName}</p></li>
                       <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
                    </div>
                  ): 
                  (
                    <div>
                      <li><Link to="/auction-login">Login</Link></li>
                      <li><Link to="/auction-signup">Signup</Link></li>      
                    </div>
                  )}
              </ul>
          </nav>
    )
}