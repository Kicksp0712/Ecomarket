import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProfileUser = () => {

  const {id} = useParams();
  const [user,setUser] = useState({});
  useEffect(()=>{
    const getDocUser = async () =>{
      const docRefUser = doc(db,'users',id);
      const docSnap = await getDoc(docRefUser);
      if(docSnap.exists()){
        setUser({...docSnap.data()});
        console.log(user);
      }
    }
    getDocUser();
  },[]);


  return (
    <div className="flex items-center my-20 justify-center">
      <div className="flex-shrink-0 mr-6">
        <img
          src={user?.image}
          alt="User Profile"
          className="w-48 h-48 rounded-full object-cover"
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2">{user?.name}</h2>
        <p className="text-gray-600 text-lg mb-4">{user?.phone}</p>
        <p className="text-gray-600 text-lg">{user?.cardNumber}</p>
      </div>
    </div>
  );
};

export default ProfileUser;