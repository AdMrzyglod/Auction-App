import React, { useState } from 'react';
import './auction-signup.css'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { collection, addDoc } from "firebase/firestore"; 


export default function AuctionSignup(){

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    async function signUp(){

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;

        async function addUser() {
                await addDoc(collection(db, "users"), {
                    uid: user.uid,
                    userName: name,
                    phone: phone,
                    email: email
                });
                console.log("Dodano!");
        }

        await addUser();
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        signUp();
    };


    return (
        <form className="box-signup" onSubmit={handleSubmit}>
          <h2>Rejestracja</h2>
          <div className="input-signup">
              <label>Nazwa użytkownika:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
          </div>
          <div className="input-signup">
              <label>Telefon:</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required/>
          </div>
          <div className="input-signup">
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div className="input-signup">
              <label>Hasło:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>
          <button type="submit" className="signup-button">Zarejestruj się</button>
        </form>
    )
}