import React, { createContext, useContext, useEffect, useState } from "react";
import { db, getFcmToken } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { UserAuth } from "./AuthContext";

const UserDataContext = createContext();

function UserContext({ children }) {
  const { userAuth } = UserAuth();

  const [userDoc, setUserDoc] = useState({});
  const [loadingData,setLoadingData] = useState(true)
  useEffect(() => {
    const docGet = async () => {
      const docRef = doc(db, "users", userAuth.uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      setUserDoc({ ...userAuth, ...data });
      setLoadingData(false);
    };
    if (userAuth?.uid) {
      docGet();
    }
  }, [userAuth]);
  //Get FCMtoken
  useEffect(() => {
    const uploadFcmToken = async () => {
      const token = await getFcmToken();
      const docRefUser = doc(db, `users/${userAuth?.uid}`);
      updateDoc(docRefUser, { fcmToken: token });
    };
    if(userAuth?.uid){
        uploadFcmToken();
    }
  }, [userAuth]);

  return (
    <UserDataContext.Provider value={{ user: userDoc, setUserDoc,loadingData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export { UserContext };
export { UserDataContext };
export const UserData = () => {
  return useContext(UserDataContext);
};
