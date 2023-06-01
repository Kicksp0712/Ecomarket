import { useEffect, useState } from "react";
import { UserData } from "../../Context/UserContext";
import { getFavoritesPost } from "../../api/posts.api";
import { Post } from "../../components/Posts/Posts";
import { Spinner } from "flowbite-react";

export function FavoritePage() {
  const { user, favoritesPost } = UserData();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true)
    getFavoritesPost(Array.from(favoritesPost.values())).then((posts) => {
      setPosts(posts);
      setLoading(false);
    });
  }, [favoritesPost]);

  return (
    <>
      {loading && (
        <div className="container-center-item">
          <Spinner
            color="success"
            size="xl"
            aria-label="Center-aligned spinner example"
          />
        </div>
      )}
      {favoritesPost.size < 1 && !loading && (
        <div className="container-center-item">
          <span>No tienes publicaciones guardadas</span>{" "}
        </div>
      )}
      <div
        id="container-post"
        className=" mx-[25%] flex flex-col space-y-10 my-20"
      >
        {posts.map((post) => (
          <Post post={post} />
        ))}
      </div>
    </>
  );
}
