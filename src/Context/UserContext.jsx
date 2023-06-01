import React, { createContext, useContext, useEffect, useState } from "react";
import { db, getFcmToken } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { UserAuth } from "./AuthContext";
import { changeFavorites } from "../api/users.api";
import { object } from "yup";

const UserDataContext = createContext();

function UserContext({ children }) {
  const { userAuth } = UserAuth();

  const [userDoc, setUserDoc] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [favoritesPost, setFavoritesPost] = useState(new Map());
  useEffect(() => {
    const docGet = async () => {
      const docRef = doc(db, "users", userAuth.uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      if(data.favorites){
        setFavoritesPost(new Map(Object.entries(data.favorites)));
      }
      setUserDoc({ ...userAuth, ...data });
      setLoadingData(false);
    };
    if (userAuth?.uid) {
      docGet();
    }
  }, [userAuth]);

  useEffect(() => {
    if (userAuth?.uid) {
      const favorites = Object.fromEntries(favoritesPost.entries())
      changeFavorites(userAuth.uid, favorites );
    }
  }, [favoritesPost]);

  //Get FCMtoken
  useEffect(() => {
    const uploadFcmToken = async () => {
      const token = await getFcmToken();
      const docRefUser = doc(db, `users/${userAuth?.uid}`);
      updateDoc(docRefUser, { fcmToken: token });
    };
    if (userAuth?.uid) {
      uploadFcmToken();
    }
  }, [userAuth]);

  return (
    <UserDataContext.Provider
      value={{
        user: userDoc,
        setUserDoc,
        loadingData,
        favoritesPost,
        setFavoritesPost,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export { UserContext };
export { UserDataContext };
export const UserData = () => {
  return useContext(UserDataContext);
};
