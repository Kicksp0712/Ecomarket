import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';
import { async } from '@firebase/util';

const UserContext = createContext();


/**
 * AuthContext is a provider has the values or function of 
 * authentification in whole application.
*/
export const AuthContext = (props) => {

  const [userAuth,setUserAuth] = useState({});



  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

   const signIn = (email, password) =>  {
    return signInWithEmailAndPassword(auth, email, password)
   }

  const logout = () => {
      return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUserAuth(currentUser)
    });
    return () => {
      unsubscribe();
    };
  }, []);


  return (
    <UserContext.Provider value={{ createUser, userAuth, logout, signIn }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};