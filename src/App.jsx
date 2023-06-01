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

import { UserContext, UserDataContext } from "./Context/UserContext";
import { UserAuth } from "./Context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import { NavbarLogin } from "./components/Navbar/NavbarLogin";
import ProfileUser from "./pages/ProfileUser/ProfileUser";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { useEffect } from "react";
import { notification } from "./components/notifcactionToast";
import soundpop from "./audio/soundpop.mp3";
import { Post } from "./components/Posts/Posts";
import { PostPage } from "./pages/Post/PostPage";
import { ManagePostsPage } from "./pages/ManagePosts/ManagePosts";
import { BuyPage } from "./pages/BuyItem/BuyPage";
import { SalesPage } from "./pages/SalesPage/SalesPage";
import { PurchasesPage } from "./pages/PurchaseOrdersPage/PurchasesPage";
import { FavoritePage } from "./pages/Favorite/FavoritePage";

function App() {
  const { userAuth } = UserAuth();

  useEffect(() => {
    onMessage(messaging, (message) => {
      let title = message?.notification.title;
      let msg = message?.notification.body;
      let image = message?.notification.image;
      //Play sound when recive notification
      const audio = new Audio(soundpop);
      audio.play();
      notification(title, msg, image);
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
            <Route
              path="/post/:id"
              element={
                <ProtectedRoute>
                  <PostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buy-item/:id"
              element={
                <ProtectedRoute>
                  <BuyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute>
                  <SalesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases"
              element={
                <ProtectedRoute>
                  <PurchasesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-posts"
              element={
                <ProtectedRoute>
                  <ManagePostsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritePage />
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
