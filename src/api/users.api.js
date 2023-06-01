import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";



export  async function changeFavorites(uid, favorites){
    return await updateDoc(doc(db,"users",uid),{favorites:favorites });
}



