import { Spinner } from "flowbite-react";
import { getPost, thereInventoryPost } from "../../api/posts.api";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Item } from "../../components/Item/item";
import { UserData } from "../../Context/UserContext";
import { ErrorMessage, useFormik } from "formik";
import * as yup from "yup";
import moment from "moment/moment";
import { buyItem, createOrder, deletePurchaseOrder } from "../../api/purchase-orders";
import { toast } from "react-hot-toast";
import { serverTimestamp } from "firebase/firestore";
import { Wallet } from "@mercadopago/sdk-react";
import { Payment } from "../../components/Payment/Payment";
import { ConnectionErrorApi, ErrorInternalServer } from "../../utils/Errors";
export function BuyPage() {
  const params = useParams();
  const { user } = UserData();

  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrder] = useState("");
  const [diseableButton, setDiseablButton] = useState(false);

  const order = useFormik({
    initialValues: { amount: 1, total: post.precio },
    validationSchema: yup.object({
      amount: yup.number().required("Coloque una cantidad").positive(),

      total: yup.number().positive().required("Se requiere valor"),
    }),
    onSubmit: (data) => {
      setDiseablButton(true);
      const order_item = {
        amount: data.amount,
        item: `${post.id}`,
        description: post.description,
        image: post.images[0],
        precio: post.precio,
        method_pay: "Card_Debit",
        datetime: serverTimestamp(),
        buyer: user.uid,
        seller: post.ownerId,
        total: data.total,
        state: "",
      };
      thereInventoryPost(post?.id, data.amount).then((isThere) => {
        if (!isThere) {
          toast.error("No hay suficiente inventario, actualice la pagina");
          return;
        }
        buyItem(order_item)
          .then((docOrder) => {
            const orderData = { id: docOrder.id, ...order_item };

            createOrder(orderData)
              .then((url) => {
                toast.success("Se ha solictado el pago ");
                window.location.replace(url);
              })
              .catch((e) => {
                if( e instanceof ConnectionErrorApi){
                  toast.error("Error en la conexion");
                }else if ( e instanceof ErrorInternalServer){
                  toast.error("Error en la solicitud de pago");
                }
                deletePurchaseOrder(docOrder.id);
              }).finally((e)=>{
                setDiseablButton(false);

              })
          })
          .catch((e) => {
            toast.error("Error al realizar su compra");
            console.error(e.message);
          }).finally(()=>{
            setDiseablButton(false);
          })
      });
    },
  });

  const handleAddQuantity = (event, quantityAdded, inventory, callback) => {
    if (
      (quantityAdded <= inventory && quantityAdded > 0) ||
      quantityAdded === ""
    ) {
      callback(event);
    } else {
      event.preventDefault();
    }
  };
  useEffect(() => {
    order.setFieldValue(
      "total",
      order.values.amount * post.precio ?? post.precio
    );
  }, [order.values.amount, post.precio]);

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
                    onChange={(e) =>
                      handleAddQuantity(
                        e,
                        e.currentTarget.value,
                        post.inventory,
                        order.handleChange
                      )
                    }
                  />
                  {order.errors.amount && order.touched.amount && (
                    <div className="text-primary">{order.errors.amount}</div>
                  )}

                  <button
                    disabled={diseableButton}
                    type="submit"
                    className="button-custom drop-shadow-2xl shadow-2xl"
                  >
                    Solicitar compra $ {order.values.total}
                  </button>
                </form>

                {orderCreated && <Payment preferenceId={orderCreated} />}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
