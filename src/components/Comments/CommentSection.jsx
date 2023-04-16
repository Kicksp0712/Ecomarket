import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../firebase'



const CommentSection = ({ postId }) => {
    // State variables
    const [comments, setComments] = useState([]);

    // Get comments firestore and excute the render the dom.
    React.useEffect(() => {

        let commentsRef = collection(db, "posts", postId, 'comments');
        // let postRef = collection(db, 'posts')
        const q = query(commentsRef, orderBy('datetime', 'asc'));
        onSnapshot(q, (querySnapshot) => {
            let logs = [];
            querySnapshot.forEach((doc) => {
                let comment = doc.data();
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
                                                    <h3 className="font-bold text-sm">
                                                        {comment?.userName}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm break-all">
                                                        {comment?.content} 
                                                    </p>
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

export default CommentSection;