
import { useState } from "react";
import { PostsRepo } from "../../api/posts.api";
import { cloneElement } from "react";
import { useEffect } from "react";
import { Spinner } from "flowbite-react";
import { Post } from "./Posts";


 function ListPosts({ render }) {

    const { posts, loading, empty } = PostsRepo();
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    useEffect(()=>{
      const containerPost = document.querySelector("#container-post");
      containerPost.addEventListener('click',(e)=>{
       const element = e.target;
        if(element.nodeName ==="IMG"){
          setSelectedImage(element.src);
          setShowModal(true);
        };  
      });
    },[])
    return (
      <>
        {empty && <div>No hay publicaciones</div>}
        {loading && (
          <div className="container-center-item">
          <Spinner color="success" size="xl" aria-label="Center-aligned spinner example" />
        </div>
        )}
        
        <div id="container-post" className=" mx-[25%] flex flex-col space-y-10 my-20">
        {posts.map((post,index)=>(cloneElement(render,{key:index,setSelectedImage,post})))}
        </div>
  
        {showModal && (
          <div  className=" transition-opacity  ease-in-out delay-150   fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center">
            <div onClick={()=>setShowModal(false)} className=" cursor-pointer absolute top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-50"></div>
            <div className="z-50 overflow-y-auto m-auto">
              <img className="w-[100%] mx-auto rounded-lg" src={selectedImage} alt="Selected" />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-0 right-0 m-4 text-white hover:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </>
    );
        }

export function ContainerPosts() {
    return (
      <>
        <ListPosts
          render={<Post/>}
        />
      </>
    );
  }