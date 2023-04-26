import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../firebase'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { notification } from '../notifcactionToast';



const SectionComment = ({user, postId, setCommentEditing}) => {
    const [comments, setComments] = useState([]);

    //Use to navigate to user profile
    let navigate = useNavigate();

    const navigateProfile = (uid)=>{
        navigate(`/user/${uid}`);
    }   

    const handleEditingComment = (textComment,idComment)=>{ 
        setCommentEditing({id:idComment,content:textComment});
    }

    const deleteComment = (idComment,index) =>{
        let docRef = doc(db,`posts/${postId}/comments/${idComment}`);
        deleteDoc(docRef).then(()=>{
            toast.success("Se eliminado el comentario",{position:"bottom-center"});
            const newComments = comments.slice(0,index).concat(comments.slice(index+1));
            setComments(newComments);
            
        }).catch(()=>{
            toast.error("Intentalo mas tarde",{position:"bottom-center"});
        });
    }

    // Get comments firestore and excute the render the dom.
    React.useEffect(() => {

        let commentsRef = collection(db, "posts", postId, 'comments');
        // let postRef = collection(db, 'posts')
        const q = query(commentsRef, orderBy('datetime', 'asc'));
        onSnapshot(q, (querySnapshot) => {
            let logs = [];
            querySnapshot.forEach((doc) => {
                let comment = {id:doc.id,...doc.data()};
                logs.push(comment);
                setComments(logs);
            })
        })
    }, [])


    return (
        <>
            <div className='w-full bg-white rounded-lg border p-2 my-4 '>
                <h3 className='font-bold'>Comentarios</h3>
                <div className="flex flex-col">
                    <div className=" p-1 my-1">

                        {/* Show message if there aren't comments*/}
                        {comments?.length === 0 ? (
                            <>
                                <div>
                                    <p className='text-sm text-center'>No hay comentarios aun</p>
                                </div>
                            </>
                        )
                            : (
                                <>
                                    {/* Render the list of comments */}
                                    {comments?.map((comment, i) => {
                                        return (
                                            <div key={i} className='flex flex-flow-row my-2 '>
                                                <div className=" gap-3 items-center">
                                                    {comment.userImage ? (

                                                        <img src={comment?.userImage}
                                                            className="object-cover w-6 h-6 rounded-full" />
                                                    ) : (
                                                        <img src="https://www.seekpng.com/png/detail/41-410093_circled-user-icon-user-profile-icon-png.png"
                                                            className="object-cover w-6 h-6 rounded-full" />

                                                    )
                                                    }
                                                </div>
                                                <div className='ml-1 border rounded-md w-full p-1'>
                                                    <a onClick={()=>navigateProfile(comment?.ownerId)} className="font-bold text-sm cursor-pointer">

                                                        {comment?.userName}
                                                    </a>
                                                    <p className="text-gray-600 text-sm break-all">
                                                        {comment?.content} 
                                                    </p>
                                                    {(user?.uid === comment?.ownerId) && (
                                                        <div name={`${user?.uid}_${comment?.uid}`} className='flex justify-end space-x-3'>
                                                            <a onClick={()=>{handleEditingComment(comment?.content,comment.id)}} className=' hover:text-primary cursor-pointer'>Editar</a>
                                                            <a onClick={()=>{deleteComment(comment?.id,i)}} className='hover:text-primary cursor-pointer'>Eliminar</a>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        );
                                    })}
                                </>
                            )}
                    </div>

                </div>


            </div>
        </>
    );

};

export default SectionComment;