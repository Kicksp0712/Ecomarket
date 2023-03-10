import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { auth, db } from './firebase';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [userDoc, setUserDoc] = useState({});
  onAuthStateChanged(auth, (cU) => {
    setCurrentUser(cU);
  });

  useEffect(() => {
    const docGet = async () => {
      const docRef = doc(db, 'users', currentUser?.uid);
      await getDoc(docRef).then((res) => {
        setUserDoc(res.data());
      });
    };
    if (currentUser?.uid) {
      docGet();
    }
  }, [currentUser]);

  let user = { ...currentUser, ...userDoc };

  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Navbar user={user} />
        <Routes>
          <Route path='/' element={<Home user={user} />} />
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
