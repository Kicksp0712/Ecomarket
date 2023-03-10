import { collection, onSnapshot, orderBy, query, doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../firebase';

const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [comment, setComment] = useState('');
  

  React.useEffect(() => {
    let LogsRef = collection(db, 'posts');
    const q = query(LogsRef, orderBy('time', 'desc'));
    onSnapshot(q, (querySnapshot) => {
      let logs = [];
      querySnapshot.forEach((doc) => logs.push(doc.data()));
      setPosts(logs);
    });
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage('');
  }

  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    if (!comment) return;
    
    const postRef = doc(db, 'posts', postId);
    const post = post.find(p => p.id === postId);
    if(post) {
    await updateDoc(postRef, {
      comments: [...posts.comment, { user: user.displayName, text: comment }]
    });
  }
    setComment('');
  };

  return (
    <>
      {posts?.length === 0 ? (
        <div className='flex items-center justify-center w-screen h-screen font-bold italic'>
          No hay publicaciones!
        </div>
      ) : (
        <>
          <div className='mx-auto my-8 grid grid-cols-1 px-8 gap-4 w-[40vw] sm:w-[99vw] sm:mx-0 lg:w-[99vw]'>
            {posts?.map((post, i) => {
              return (
                <div
                  key={i}
                  className='w-full bg-white shadow-lg shadow-primary p-4 flex flex-col rounded-md'
                >
                  <div className='flex space-x-1 text-gray-500 italic text-sm'>
                    <span>Publicado por:</span>
                    <h1 className='font-bold text-black'>{post?.name}</h1>
                  </div>
                  <div className='flex space-x-1 text-gray-500 italic text-sm'>
                    <span>Contacto</span>
                    <h1 className='font-bold text-black'>{post?.contact}</h1>
                  </div>
                  <div className='flex space-x-1 text-gray-500 italic text-sm mb-2'>
                    <span>{post?.createdAt}</span>
                  </div>
                  <div>
                    <img
                      src={post?.image}
                      alt={post?.name}
                      className='w-full h-64 rounded-md cursor-pointer object-contain'
                      onClick={() => {
                        //console.log('on click');
                        setShowModal(true);
                        setSelectedImage(post?.image);
                      }
                       }
                       onError={(e) => {
                         e.target.onerror =null;
                         e.target.src = 'No pudimos cargar la imagen:(';
                       }}
                    />
                  </div>
                  <h3 className='font-bold text-black mt-2'>Descripción</h3>
                  <p className='text-sm italic break-words'>
                    {post?.description}
                  </p>
                  <div className="my-2">
                    {post?.comments?.map((comment, i) => (
                      <div key={i} className="my-2">
                        <p className="text-sm font-bold">{comment.user}:</p>
                        <p className="text-sm">{comment.text}</p>
                        </div>
                    ))}
                    </div>
                    <form onSubmit={handleAddComment} className="my-2">
                      <div className="flex flex-col">
                        <label htmlFor="comment" className="text-sm font-bold mb-1">Agregar un comentario:</label>
                        <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="border border-gray-400 p-2 rounded-md"
                        />
                        <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded-md"
                        >
                          Enviar comentario
                        </button>
                      </div>
                    </form>
                </div>
              );
            })}
          </div>
        </>
      )}
      {showModal && (
  <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center">
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-50"></div>
    <div className="bg-white rounded-lg z-50 overflow-y-auto">
      <img src={selectedImage} alt="Selected Image" />
      <button onClick={handleCloseModal} className="absolute top-0 right-0 m-4 text-white hover:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}
      
    </>
  );
};

export default Home;
