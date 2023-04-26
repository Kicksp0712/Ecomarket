import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CreateAccount from "./pages/CreateAccount/CreateAccount";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./ProtectedRoute";

import CreatePost from "./pages/CreatePost/CreatePost";
import { ProfileManagemnt } from "./pages/ProfileManagement/ProfileManagement";

import { UserContext } from "./Context/UserContext";
import { UserAuth } from "./Context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import { NavbarLogin } from "./components/Navbar/NavbarLogin";
import ProfileUser from "./pages/ProfileUser/ProfileUser";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { useEffect } from "react";
import { notification } from "./components/notifcactionToast";


function App() {
  const { userAuth } = UserAuth();

  
 
 useEffect(()=>{
  onMessage(messaging,(message)=>{
    let title = message?.notification.title;
    let msg = message?.notification.body;
    let image = message?.notification.image;
    notification(title,msg,image);
  });
  }, []);



  return (
    <>
      <UserContext>
        <BrowserRouter>
          {Boolean(userAuth?.uid) ? <Navbar /> : <NavbarLogin />}
          <Toaster />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />

            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <ProfileManagemnt />
                </ProtectedRoute>
              }
            />
            <Route path="/user/:id" element={<ProfileUser />} />

            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </UserContext>
    </>
  );
}

export default App;
