import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { auth, db } from './firebase';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import ProtectedRoute from './ProtectedRoute';
import PrivateRoute from './ProtectedRoute';
import { onAuthStateChanged } from 'firebase/auth';

import CreatePost from './pages/CreatePost/CreatePost';
import { UserAuth } from './Context/AuthContext';

function App() {

  const { userAuth } = UserAuth();

  const [userDoc, setUserDoc] = useState({});

  useEffect(() => {
    const docGet = async () => {
      const docRef = doc(db, 'users', userAuth?.uid);
      await getDoc(docRef).then((res) => {
        setUserDoc(res.data());
      });
    };
    if (userAuth?.uid) {
      docGet();
    }
  }, [userAuth]); 

  let user = { ...userAuth, ...userDoc };

  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>

          <Route path="/" element={
          <ProtectedRoute>
            <Home user={user}/>
          </ProtectedRoute>}/>
          
          <Route path="/create-post" element={
            <ProtectedRoute>
              <CreatePost user={user}/>
            </ProtectedRoute>
          }/>

          <Route path='/login' element={<Login user={user} />} />
          <Route
            path='/create-account'
            element={<CreateAccount user={user} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
