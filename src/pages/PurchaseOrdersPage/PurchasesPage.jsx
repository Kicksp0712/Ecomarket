
import { Spinner } from "flowbite-react";
import { Purchases, Sales } from "../../api/purchase-orders";
import { FaShoppingCart } from "react-icons/fa";
import { UserData } from "../../Context/UserContext";
import { ItemPurchase } from "../../components/Item/ItemPurchase";

export  function PurchasesPage(){

    const {user} = UserData();
    const { purchases, empty, loading } = Purchases({
      uid: user.uid,
    });
    return (
      <>
        {empty && (
          <div className="container-center-item">
            <span>
              No hay compras <FaShoppingCart className="inline-block" />
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
            {purchases.map((sale, index) => (
              <div key={index}>
                <ItemPurchase itemSale={sale}/>
              </div>
            ))}
          </div>
        )}
      </>
    );
}