import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../../api/posts.api";
import { Post } from "../../components/Posts/Posts";
import { Spinner } from "flowbite-react";

export function PostPage() {
  const params = useParams();

  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getDocument = async () => {
      setLoading(true);

      const post = await getPost(params?.id);
      setPost(post);
      setLoading(false);
    };
    getDocument();
  }, [params?.id]);

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
      <div
        id="container-post"
        className=" mx-[25%] flex flex-col space-y-10 my-20"
      >
        {!loading && <Post post={post} />}
      </div>
    </>
  );
}
