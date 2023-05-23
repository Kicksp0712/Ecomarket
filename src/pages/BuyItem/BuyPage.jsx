import { Spinner } from "flowbite-react";
import { getPost } from "../../api/posts.api";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Item } from "../../components/Item/item";
import { UserData } from "../../Context/UserContext";




export function BuyPage(){
    const params = useParams();
    const {user} = UserData();  

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
          className=" mx-[30%] flex flex-col space-y-10 my-20"
        >
          {!loading &&( 
            <>
             <Item item={post} />
             

             {user.uid !== post?.ownerId && (
              <>
                           <input required type="number" className="rounded-lg "  placeholder="Cantidad"/>

               <button className="button-custom drop-shadow-2xl shadow-2xl">Comprar</button>
               </>
             )}
            </>
         
          
          
          )}
        </div>
      </>
    );
}