import { Tooltip } from "flowbite-react";
import {FaMapMarkerAlt} from "react-icons/fa";
import "./item.css";
export function Item({ item }) {
  const { id, address, inventory, description, contact, precio, images, name } =
    item;

  return (
    <div className="border drop-shadow-2xl shadow-2xl rounded-lg p-3  ">
      <div className="flex flex-row  justify-around ">
        <div className="flex flex-col space-y-3">
          <div className="font-bold">{description}</div>
          <Tooltip content={contact}>
            <div>{name}</div>
          </Tooltip>
          <div>Quedan: {inventory}</div>
          <div>{address}</div>
          <div>Precio <span className="italic font-semibold">${precio}</span> </div>
        </div>

        <div className="flex flex-col justify-around ">
          <div className="item-image ">
            <img src={images[0]} alt="" />
          </div>

          <Tooltip
          content={address ? address : "Sin direccion" }
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
      </div>
    </div>
  );
}
