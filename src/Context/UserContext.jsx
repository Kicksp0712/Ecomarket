import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserAuth } from './AuthContext';

const UserDataContext = createContext();


function UserContext({children}) {
    const { userAuth } =  UserAuth();

  const [userDoc, setUserDoc] = useState({});
  
  useEffect(() => {  
    const docGet = async () => {
        const docRef = doc(db, 'users', userAuth.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setUserDoc({...userAuth,...data});
    };
    if (userAuth?.uid) {
        docGet();
    }
  },[userAuth]);


    return (
        <UserDataContext.Provider value={{user:userDoc,setUserDoc}}>
            {children}
        </UserDataContext.Provider>
    )

}

export {UserContext};
export {UserDataContext};
export const UserData = () =>{
    return useContext(UserDataContext);
};
  
