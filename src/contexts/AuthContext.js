import React, { createContext, useState, useEffect } from 'react';
import { auth,db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const AuthContext = createContext();

const fetchUserByUID = async (uid) => {

    let q = query(collection(db, "users"), where("uid", "==", uid));

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      } else {
        const user = {...querySnapshot.docs[0].data(),id: querySnapshot.docs[0].id };
        return user;
      }
    } catch (error) {
      console.log("Problem with user data!");
      return null;
    }
       
}

const AuthProvider = ({ children }) => {
  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged( async (user) => {
      let userData = user===null ? null : await fetchUserByUID(user.uid);
      setCurrentUser(userData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;