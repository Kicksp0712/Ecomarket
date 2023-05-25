import { Query, QueryConstraint, addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";



export  function Purchases({uid,state,filter}){
    const [purchases,setPurchases]= useState([]);
    const [loading,setLoading] = useState(true);
    const [empty,setEmpty] = useState(false);


    useEffect(()=>{
        const req = async()=>{
         const refBuyer = doc(db,"users",uid);
         const refCollection = collection(db,"purchase-orders");
         const qr = query(refCollection,orderBy("datetime","desc"),where("buyer","==",refBuyer));
             onSnapshot(qr,(snapShot)=>{
                if(snapShot.size <1) {setEmpty(true);setLoading(false);return};

                const mapPurchase = new Map() 
                 snapShot.forEach((doc)=>{  
                    mapPurchase.set(doc.data().item.id,{id:doc.id,...doc.data()})
                 })
                
                 // Generator to get each document post of a purchase.
                 async function* fetchPostsDoc(ids){
                    try{

                        for ( let id of ids){
                            const ref = doc(db,`/posts/${id}`);
                            const snap = await getDoc(ref);
                            const data = snap.data()
                            yield {id:snap.id,description:data.description,image:data.images[0]}
                        }
                    } finally{
                        console.log("Called finally");
                    }
                 }

                 // Add post data to the purchase data.
                 (async () =>{

                    try{
                        for await (const post of fetchPostsDoc(mapPurchase.keys())){
                            mapPurchase.set(post.id,{...mapPurchase.get(post.id),post:{...post}})
                         }
                         setPurchases(Array.from(mapPurchase.values()));
                         setLoading(false);
                    }catch(e){
                        console.error("Error Purchase",e.message);
                    }
                 })();
         
             });
         }
         
         if(uid !== undefined){
            req();
         }
        
     },[uid]);
     return {purchases,empty,loading,setPurchases};

}

export  function Sales({uid,state,filter}){

    const [sales,setSales]= useState([]);
    const [loading,setLoading] = useState(true);
    const [empty,setEmpty] = useState(false);
    const [postsOwner, setPostsOwner] = useState(new Map());
  
 
    useEffect(()=>{

       const req = async()=>{
        const refSeller = doc(db,"users",uid);
        const refCollection = collection(db,"purchase-orders");
        const qr = query(refCollection,orderBy("datetime","desc"),
        where("seller","==",refSeller),);
            onSnapshot(qr,(snapShot)=>{
                const list = []
                snapShot.forEach((doc)=>{
                    const post = postsOwner.get(doc.data().item.id);
                    list.push({id:doc.id,...doc.data(),post:{description:post.description,image:post.images[0]}});
                })
                
                if(list.length < 1){
                    setEmpty(true);
                }else{
                    setSales(list);
                }
                if(loading){
                    setLoading(false);
                }
        
            });
        }
         if(postsOwner.size >0 && Boolean(uid)){
            req();
         }
       
    },[postsOwner,uid]);

    useEffect(()=>{
        const req = ()=>{
            const qrPostOwner = query(collection(db, 'posts'), 
        orderBy('time', 'desc'),
        where("ownerId","==",uid));
        onSnapshot(qrPostOwner,(snapShot)=>{
            const map = new Map();
            snapShot.forEach((doc)=>
            {
                const data = {id:doc.id,...doc.data()}
                map.set(doc.id,data);
            });
            setPostsOwner(map);
        })
        }
        if(uid){
            req();
        }
    },[uid]);
    

    return {sales,empty,loading,setSales};

}


export async function buyItem(order){

    const refDoc = doc(db,"post-orders");

    return await  addDoc(refDoc,order);

}


