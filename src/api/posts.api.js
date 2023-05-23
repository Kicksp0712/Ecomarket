import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";



export function PostsRepo(){

    const [posts,setPosts] = useState([]);
    const [loading,setLoading] = useState(true);
    const [empty, setEmpty] = useState(false);

    useEffect(() => {
        let LogsRef = collection(db, 'posts');
        const q = query(LogsRef, orderBy('time', 'desc'),
        where("state","==",true));
        onSnapshot(q, (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((document) => {
            let data = {id:document.id,...document.data()}
            
            list.push(data)}
            );
            if(!list){
                setEmpty(true);
            }else{
                setPosts(list);
            }
            if(loading){
                setLoading(false);
            }
        });
      }, []);

      return {empty,posts,loading,setEmpty,setPosts,setLoading};

}

export function PostsUserRepo({uid}){

    const [posts,setPosts] = useState([]);
    const [loading,setLoading] = useState(true);
    const [empty, setEmpty] = useState(true);

    useEffect(() => {

        const req = ()=>{
            let LogsRef = collection(db, 'posts');
        const q = query(LogsRef, orderBy('time', 'desc'),
        where("ownerId","==",uid));
        onSnapshot(q, (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((document) => {
            let data = {id:document.id,...document.data()}
            
            list.push(data)}
            );
            if(list.length > 0){
                setEmpty(false);
                setPosts(list);
            }
            if(loading){
                setLoading(false);
            }
        });
        }
        if(uid){
            req();
        }
        
      }, [uid]);

      return {empty,posts,loading,setEmpty,setPosts,setLoading};

}


export async function getPost(id){
    const ref = doc(db,"posts",id);

    const snap = await getDoc(ref);
    
    return {id: snap.id, ...snap.data() }

}

export async function deletePost(id){
    const ref = doc(db,"posts",id);

    return await deleteDoc(ref);
}

export async function updatePost(data,id){
    const ref = doc(db,"posts",id);

    return await updateDoc(ref,{...data});
}

export async function updateStatePost(id,state){
    const ref = doc(db,"posts",id);
    return await updateDoc(ref,{state:state});

}