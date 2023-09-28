import React, { useState } from 'react';
import './auction-login.css'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';


export default function AuctionLogin(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    async function logIn(){

        try{
            
            await signInWithEmailAndPassword(auth, email, password);
        }
        catch{
            console.log("Problem with login!")
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        logIn();
    };


    return (
        <form className="box-login" onSubmit={handleSubmit}>
          <h2>Logowanie</h2>
          <div className="input-login">
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div className="input-login">
              <label>Hasło:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>
          <button type="submit" className="login-button">Zaloguj się</button>
        </form>
    )
}