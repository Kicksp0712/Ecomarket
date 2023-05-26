import { useEffect, useState } from "react";
import {
  PostIsBuying,
  PostsUserRepo,
  deletePost,
  updatePost,
  updateStatePost,
} from "../../api/posts.api";
import {
  UserContext,
  UserData,
  UserDataContext,
} from "../../Context/UserContext";
import { FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { Modal, Spinner, Tooltip } from "flowbite-react";
import { CardPost } from "../../components/Posts/CardPost";
import { toast } from "react-hot-toast";
import { ErrorMessage, Formik, useFormik } from "formik";
import * as yup from "yup";
import { render } from "@testing-library/react";
import { Form, Outlet } from "react-router-dom";
import { Children } from "react";
import {FaShoppingCart} from "react-icons/fa"
/**
 * Manager of posts, show the inventory each post and allow delete them and restablish inventory.
 */
export function ManagePostsPage() {
  return (
    <>
      {/* Wati until get the data user when refresh the page */}
      <UserDataContext.Consumer>
        {(data) => (
          <>{Boolean(!data.loadingData) && <ListPostOwn user={data.user} />}</>
        )}
      </UserDataContext.Consumer>
    </>
  );
}

export function ListPostOwn({ user }) {
  const [openOpenModal, setOpenModal] = useState(false);
  const [selectPost, setSelectPost] = useState({});
  const { empty, posts, loading, setEmpty, setPosts, setLoading } =PostsUserRepo({ uid: user.uid });
  const handleDelete = async (id) => {
    
    const isBuying = await PostIsBuying(id);
    
    if(isBuying){
      toast.error("No es posible eliminar este elemento, solo desactivar su publicacion");
      return;
    }
    deletePost(id)
    .then(() => {
      toast.success("Se ha eliminado el post");
    })
    .catch((e) => {
      toast.error(`Error eliminacion: ${e.message}`);
    });
   
  };
  const hanldeUpdateInventory = (post) => {
    setSelectPost(post);
    setOpenModal(true);
  };

  const changeState = (id, state) => {
    updateStatePost(id, state ? !state : true);
  };

  return (
    <>
      <Modal
        id="formPost"
        className="h-full py-[10%]"
        size="lg"
        position="center"
        show={openOpenModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Actualizar Inventario</Modal.Header>
        <Modal.Body>
          <FormPost values={selectPost}>
            {(formik) => (
              <form>
                <input
                  id="inventory"
                  onBlur={formik.handleBlur}
                  className="w-full"
                  type="number"
                  value={formik.values.inventory}
                  onChange={formik.handleChange}
                />
                {formik.errors.inventory && formik.touched.inventory ? (
                  <div>{formik.errors.inventory}</div>
                ) : null}

                <button
                  id="sumbitButton"
                  className="button-custom"
                  type="submit"
                  onClick={formik.handleSubmit}
                >
                  Actualizar
                </button>
              </form>
            )}
          </FormPost>
        </Modal.Body>
      </Modal>

      {empty && (<div className="container-center-item"><span>No hay publicaciones <FaShoppingCart  className="inline-block"/>
        </span> </div>)}
      {loading && (
        <div className="container-center-item">
          <Spinner
            color="success"
            size="xl"
            aria-label="Center-aligned spinner example"
          />
        </div>
      )}
      
      {(!loading || !empty) && (
         <div
         id="container-post"
         className="flex flex-row flex-wrap justify-center  gap-5 mx-5 my-20 "
       >
         {posts.map((post, index) => (
           <div key={index} id={post.id}>
             <CardPost state={post.state}>
               <div
                 id="state-delete"
                 className="flex flex-row justify-between w-full"
               >
                 <label className="relative inline-flex items-center mb-4 cursor-pointer">
                   <input
                     type="checkbox"
                     checked={post?.state}
                     onClick={() => changeState(post.id, post.state)}
                     className="sr-only peer"
                   />
                   <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                   <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                     {post.state ? "Activo" : "Inactivo"}
                   </span>
                 </label>
 
                 <FaTrash
                   className="text-red-600 hover:text-red-800 cursor-pointer text-lg "
                   onClick={() => handleDelete(post.id)}
                 />
               </div>
               <div className="grid grid-cols-2 gap-2 align-middle">
                 <div>
                   <div className="card-post-image">
                     <img src={post.images[0]} alt=""></img>
                   </div>
                   <p className="clip-text">{post.description}</p>
                   <p>{post.createdAt}</p>
                   <p>Inventario: {post.inventory ?? ""}</p>
                 </div>
                 <div id="controls">
                   <button
                     disabled={!post.state}
                     className="button-custom"
                     onClick={() => hanldeUpdateInventory(post)}
                   >
                     Inventario
                   </button>
                   <Tooltip
                   content={post?.address ? post?.address :"Sin direccion" }
                   placement="bottom"
                   >
                        <div
                     className="flex flex-col items-center cursor-pointer"
                     data-popover-target="popover-image"
                   >
                     Ubicacion
                     <FaMapMarkerAlt className="text-primary   text-lg" />
                   </div>
                   </Tooltip>
                  
                 </div>
               </div>
 
               
             </CardPost>
 
 
           </div>
         ))}
 
         
       </div>
      )
      }
     


          


      
    </>
  );
}

export function FormPost(props) {
  const { id, inventory } = props.values;
  const formik = useFormik({
    initialValues: { id, inventory: inventory ?? 0 },
    validationSchema: yup.object({
      inventory: yup.number().required("Se requiere un valor"),
    }),
    onSubmit: (data) => {
      updatePost(data, data.id)
        .then(() => {
          toast.success("Se ha actualizado el inventario correctamente");
        })
        .catch((e) => {
          toast.errror(`Error ${e.message}`);
        });
    },
    enableReinitialize: true,
  });

  return <>{props.children(formik)}</>;
}
