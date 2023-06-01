import { Spinner, Tooltip } from "flowbite-react";
import { UserData } from "../../Context/UserContext";
import { ContainerComments } from "../Comments/ContainerComments";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBillAlt } from "react-icons/fa";
import { Favorite } from "./Favorite";
import { changeFavorites } from "../../api/users.api";
export function Post({ post, setSelectedImage, key }) {
  const { user, setFavoritesPost, favoritesPost } = UserData();
  const {
    id,
    images,
    createdAt,
    name,
    precio,
    description,
    contact,
    inventory,
    address,
    ownerId,
  } = post;

  const handleaddFavorite = (idPost) => {
    let userFavorites = favoritesPost ;
    if (favoritesPost.get(idPost)) {
      favoritesPost.delete(idPost);
    } else {
      userFavorites.set(idPost, idPost);
    }
   
    setFavoritesPost(new Map(userFavorites.entries()));
  };

  const verifiedIfFavorite = () => {
    let userFavorites = favoritesPost;

    let isFavorite = (userFavorites.length !== 0) && 
      (userFavorites.get(id) !== undefined && userFavorites.get(id) !== null);
    return isFavorite;
  };

  return (
    <div
      key={key}
      className="w-full bg-white shadow-lg drop-shadow-lg p-4 flex flex-col rounded-md"
    >
      <div className="flex justify-between  mb-2">
        <p className="text-lg  font-bold break-words">{description}</p>
        <span className="text-gray-500  text-sm">{createdAt}</span>
        <Favorite
          isFavorite={verifiedIfFavorite()}
          addFavorite={() => handleaddFavorite(id)}
        />
      </div>
      <div className="flex  text-gray-500  text-sm">
        <Tooltip placement="bottom" content={contact}>
          <Link to={`/user/${ownerId}`}>
            <h1 className="px-1 font-bold text-black"> {name}</h1>
          </Link>
        </Tooltip>
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

      <div className="flex justify-between align-bottom">
        {Boolean(precio) && (
          <div className="flex space-x-1  text-black text-md">
            <FaMoneyBillAlt className="text-2xl text-primary" />
            <div>$ {precio}</div>
          </div>
        )}

        <Link to={`/buy-item/${id}`}>
          <button style={{ width: "fit-content" }} className="button-custom">
            Ir a comprar
          </button>
        </Link>
      </div>

      <div className="flex justify-center">
        <Tooltip
          content={post?.address ? post?.address : "Sin direccion"}
          placement="bottom"
        >
          <div
            className="flex flex-row cursor-pointer"
            data-popover-target="popover-image"
          >
            <FaMapMarkerAlt className="text-primary   text-lg" />
            Ubicacion
          </div>
        </Tooltip>
      </div>

      <ContainerComments key={post?.id} user={user} postId={post?.id} />
    </div>
  );
}
