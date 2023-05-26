import { Spinner } from "flowbite-react";
import { getPost } from "../../api/posts.api";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Item } from "../../components/Item/item";
import { UserData } from "../../Context/UserContext";
import { ErrorMessage, useFormik } from "formik";
import * as yup from "yup";
import moment from "moment/moment";
import { buyItem } from "../../api/purchase-orders";
import { toast } from "react-hot-toast";
import { serverTimestamp } from "firebase/firestore";
export function BuyPage() {
  const params = useParams();
  const { user } = UserData();

  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  
  const order = useFormik({
    initialValues: { amount: 1, total: post.precio },
    validationSchema: yup.object({
      amount: yup
        .number()
        .required("Coloque una cantidad")
        .positive("Cantidad Invalida"),
      total: yup.number().positive().required("Se requiere valor"),
    }),
    onSubmit: (data) => {
      const order_item = {
        amount: data.amount,
        item: post.id,
        method_pay: "Card_Debit",
        datetime: serverTimestamp(),
        buyer: user.uid,
        seller: post.ownerId,
        total: data.total,
        state: ""
      };
      buyItem(order_item).then(()=>{
        toast.success("Se ha solictado su compra");
      }).catch((e)=>{
        toast.error("Error al realizar su compra");
        console.error(e.message);
      })
    },
  });

  useEffect(()=>{
    order.setFieldValue("total",(order.values.amount*post.precio ?? post.precio));
  },[order.values.amount, post.precio])

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
        {!loading && (
          <>
            <Item item={post} />
            {user.uid !== post?.ownerId && (
              <>
                <form onSubmit={order.handleSubmit}>
                  <input
                    id="amount"
                    required
                    type="number"
                    className="rounded-lg w-full "
                    placeholder="Cantidad"
                    value={order.values.amount}
                    onChange={(e)=>{order.handleChange(e)}}
                  />
                  {order.errors.amount && order.touched.amount && (
                    <div className="text-primary">{order.errors.amount}</div>
                  )}

                  <button
                    type="submit"
                    className="button-custom drop-shadow-2xl shadow-2xl"
                  >
                    Comprar $ {order.values.total}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
