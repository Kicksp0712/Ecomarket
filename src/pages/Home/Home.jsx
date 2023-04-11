import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../firebase';
import CommentSection  from '../../components/CommentSection';
import CreateComment  from '../../components/CreateComment';
import Navbar from '../../components/Navbar/Navbar';
const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  
  React.useEffect(() => {
    let LogsRef = collection(db, 'posts');
    const q = query(LogsRef, orderBy('time', 'desc'));
    onSnapshot(q, (querySnapshot) => {
      let logs = [];
      querySnapshot.forEach((document) => {
        let data = document.data()
        data.id = document.id;
        logs.push(data)});
      setPosts(logs);
    });
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage('');
  }

  return (
    <>
      <Navbar user={user}/>

      {posts?.length === 0 ? (
        <div className='flex items-center justify-center w-screen h-screen font-bold italic'>
          No hay publicaciones!
        </div>
      ) : (
        <>
          

          <div className='mx-auto  my-20 grid grid-cols-1 px-8 gap-4 w-[50vw] sm:w-[99vw] sm:mx-0 lg:w-[99vw]'>
            {posts?.map((post, i) => {
              return (
                <div
                  key={`post_${i}`}
                  className='w-full bg-white shadow-lg shadow-primary p-4 flex flex-col rounded-md'
                >
                  <div className='flex space-x-1 text-gray-500 italic text-sm'>
                    <span>Publicado por:</span>
                    <h1 className='font-bold text-black'>{post?.name}</h1>
                  </div>
                  <div className='flex space-x-1 text-gray-500 italic text-sm'>
                    <span>Contact</span>
                    <h1 className='font-bold text-black'>{post?.contact}</h1>
                  </div>
                  <div className='flex space-x-1 text-gray-500 italic text-sm mb-2'>
                    <span>{post?.createdAt}</span>
                  </div>
                
                  <div className="relative w-full  flex flex-row justify-center  gap-6 snap-x snap-mandatory overflow-x-auto pb-8">
                    {Array.from({ length: post?.images.length }).map((_, index) => (

                      <div key={index} className="snap-center shrink-0">
                        <img 
                        onClick={() => {
                        //console.log('on click');
                        setShowModal(true);
                        setSelectedImage(post?.images[index]);
                      }
                       }
                       onError={(e) => {
                         e.target.onerror =null;
                         e.target.src = 'No pudimos cargar la imagen:(';
                       }}
                        className='mx-auto shrink-0 cursor-pointer w-40 h-40 rounded-lg shadow-xl bg-white'
                          src={post?.images[index]} alt={`Image ${index}`} />
                      </div>
                    ))}



                  </div>
                  <h3 className='font-bold text-black mt-2'>Descripción</h3>
                  <p className='text-sm italic break-words'>
                    {post?.description}
                  </p>
                  


                  <CommentSection key={`coments_${i}`} postId={post?.id}/>
                  <CreateComment key={`createcomment_${i}`} postId={post?.id} user={user} />
                </div>
              );
            })}
          </div>
        </>
      )}
{showModal && (
  <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center">
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-50"></div>
    <div className=" rounded-lg z-50 overflow-y-auto mx-auto">
      <img className='w-2/4 mx-auto' src={selectedImage} alt="Selected Image" />
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
