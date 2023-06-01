import "./item.css";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import { Badge, Tooltip } from "flowbite-react";
import { FaMapMarkerAlt } from "react-icons/fa";
export function ItemPurchase({ itemPurchase }) {
  const { item, amount, total, buyer, datetime, post, state, method_pay, payment } =
  itemPurchase;

  return (
    <div className="border drop-shadow-2xl shadow-2xl rounded-lg   p-5">
      <div className="flex flex-row flex-wrap  gap-5  justify-between ">
        <div className="flex flex-col space-y-3">
          <div>
            Fecha:{" "}
            {moment.unix(datetime?.seconds).format("DD/MM/YY [Hora]: HH:mm:ss")}
          </div>

          <div>Cantidad: {amount}</div>
          <div>Total: ${total}</div>
          <div>
            Metodo de pago: {method_pay === "Cash" && "Efectivo"}{" "}
            {method_pay === "Card_Debit" && "Tarjeta de debito"}{" "}
          </div>
        </div>

        <div className="flex flex-col items-center justify-around ">
          <Link to={`/post/${item?.id}`} className="font-bold">
            {post?.description}
          </Link>

          <div className="item-image ">
            <img src={post?.image} alt="" />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center px-3 ">
 
        <div className="text-center" >
          {payment?.status === "approved" && (
            <span className="badge-success">Aprovado</span>
          )}
          {payment?.status === "rejected" && <span className="badge-fail">Pago rechazado</span>}
          {(payment?.status === "in_process" || Boolean(!payment?.status)) && <span className="badge-warning">En proceso de pago</span>}
        </div>
        <Tooltip
          content={post?.address ? post?.address : "Sin direccion"}
          placement="bottom"
        >
          <div
            className="flex flex-col items-center cursor-pointer"
            data-popover-target="popover-image"
          >
            Lugar de entrega
            <FaMapMarkerAlt className="text-primary   text-lg" />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
