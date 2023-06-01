import { AiOutlineStar, AiFillStar } from "react-icons/ai";

export function Favorite(props) {
  return (
    <>
      <span onClick={()=>props.addFavorite()} className="text-3xl cursor-pointer">
        {props.isFavorite ? <AiFillStar /> : <AiOutlineStar />}
      </span>
    </>
  );
}
