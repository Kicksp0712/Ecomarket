import { Spinner } from "flowbite-react";
import { Sales } from "../../api/purchase-orders";
import { FaShoppingCart } from "react-icons/fa";
import { ItemSale } from "../../components/Item/itemSale";
import { UserData } from "../../Context/UserContext";

export function SalesPage() {
  const {user} = UserData();
  const { sales, empty, loading } = Sales({
    uid: user.uid,
  });
  return (
    <>
      {empty && (
        <div className="container-center-item">
          <span>
            No hay ventas <FaShoppingCart className="inline-block" />
          </span>{" "}
        </div>
      )}
      {loading && (
        <div className="container-center-item">
          <Spinner
            color="success"
            size="xl"
            aria-label="Center-aligned spinner example"
          />
        </div>
      )}
      {(!loading && !empty) && (
        <div className="mx-[25%] flex flex-col items-center space-y-10 my-20 ">
          {sales.map((sale, index) => (
            <div key={index}>
              <ItemSale itemSale={sale}/>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
