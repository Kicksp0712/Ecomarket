import { useRef, useState } from "react";
import { PostsRepo } from "../../api/posts.api";
import { cloneElement } from "react";
import { useEffect } from "react";
import { Spinner } from "flowbite-react";
import { UserData } from "../../Context/UserContext";
import { ContainerComments } from "../Comments/ContainerComments";
import { Link } from "react-router-dom";

export function Post({ post,setSelectedImage,key }) {
  const { user } = UserData();
  const { id, images, createdAt, name, precio, description, contact } = post;
  
  return (
      <div        
        key={key}
        className="w-full bg-white shadow-lg drop-shadow-lg p-4 flex flex-col rounded-md"
      >
        <div className="flex justify-end text-gray-500  text-sm mb-2">
          {createdAt}
        </div>
        <div className="flex  text-gray-500  text-sm">
          Publicado por: 
          <h1 className="px-1 font-bold text-black"> {name}</h1>
        </div>
        <div className="flex  text-gray-500  text-sm">
          Contacto: 
          <h1 className="px-1 font-bold text-black"> {contact}</h1>
        </div>

        <div className="relative w-full  flex flex-row justify-center  gap-6 snap-x snap-mandatory overflow-x-auto pb-8">
          {Array.from({ length: images?.length }).map((_, index) => (
            <div key={index} className="snap-center shrink-0">
              <img
                onClick={() => {
                  setSelectedImage(images[index]);
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "No pudimos cargar la imagen:(";
                }}
                className="mx-auto shrink-0 cursor-pointer w-40 h-40 rounded-lg shadow-xl bg-white"
                src={images[index]}
                alt={`product_${index}`}
              />
            </div>
          ))}
        </div>
        {Boolean(precio) && (
          <div className="flex space-x-1 text-black text-md">{precio}</div>
        )}
        <Link to={`post/${id}`}>
        <h3 className="font-bold text-black mt-2">Descripción</h3>
          <p className="text-sm italic break-words">{description}</p>
        </Link>

        <ContainerComments key={post?.id} user={user} postId={post?.id} />
      </div>
   
  );
}


