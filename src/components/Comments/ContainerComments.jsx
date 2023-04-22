import { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import SectionComment from "./SectionComment";
import FormComment from "./FormComment";
import { db } from "../../firebase";
import { addDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";

/**
 * Component that have the  section comments of a post 
 * @param {postId} The doc id of post
 * @param {user} The user current authenticated
 * @returns JSX
 */

function ContainerComments({ user, postId }){

    const [commentEditing,setCommentEditing] = useState({id:"",content:""});


    const createComment =  (text) =>{
        const docRef = collection(db,`posts/${postId}/comments`);
            addDoc(docRef, {
                content: text,
                userName: user?.name,
                userImage: user?.image,
                datetime: moment().format('DD MM, h:mm a'),
                uid: user?.uid
            }).then(() => {
                toast.success("Comentario enviado");                
            }).catch(() => {
                toast.error("Error al enviar comentario");
            });
    }

    const updateComment =  (text) =>{
        const commentRef = doc(db,`posts/${postId}/comments/${commentEditing.id}`);
        updateDoc(commentRef, {
            content: text,
        }).then(() => {
            toast.success("Comentario editado");
        }).catch(() => {
            toast.error("Error al enviar comentario");
        }).finally(()=>{
            setCommentEditing({id:"",content:""});             
        });
    }



    return (
        <>
            <SectionComment user={user} postId={postId} setCommentEditing={setCommentEditing}/>
            <FormComment user={user} createComment={createComment} updateComment={updateComment} commentEditing={commentEditing}/>
        </>
    );
}

export {ContainerComments}